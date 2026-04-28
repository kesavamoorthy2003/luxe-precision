const Razorpay = require('razorpay')
const crypto  = require('crypto')
const prisma  = require('../config/db')

// ── Razorpay Instance ──────────────────────────────────
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// ─────────────────────────────────────────────────────────────
// POST /api/payment/create-order
// Body: { cartItems, shippingInfo, shippingCost, tax }
// Creates a Razorpay order + a DB Order record with PENDING status
// ─────────────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id
    const { cartItems, shippingInfo, shippingCost = 0, tax = 0 } = req.body

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' })
    }

    // 1. Compute subtotal from cartItems sent by client
    //    (we trust productId + quantity; we re-fetch price from DB for safety)
    const productIds = cartItems.map(i => i.productId)
    const products   = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true }
    })
    const priceMap = Object.fromEntries(products.map(p => [p.id, p.price]))

    let subtotal = 0
    for (const item of cartItems) {
      const price = priceMap[item.productId]
      if (!price) {
        return res.status(400).json({ success: false, message: `Product ${item.productId} not found` })
      }
      subtotal += price * item.quantity
    }

    const total = subtotal + shippingCost + tax
    const amountInPaise = Math.round(total * 100)

    // 2. Create Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: 'INR',
      receipt:  `rcpt_user${userId}_${Date.now()}`,
      notes: {
        userId:    String(userId),
        customer:  shippingInfo?.name || '',
      },
    })

    // 3. Persist Order in DB (PENDING until payment verified)
    const shippingAddress = shippingInfo
      ? `${shippingInfo.firstName} ${shippingInfo.lastName}, ${shippingInfo.address}${shippingInfo.apartment ? ', ' + shippingInfo.apartment : ''}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}. Phone: ${shippingInfo.phone}`
      : null

    const dbOrder = await prisma.order.create({
      data: {
        userId,
        subtotal,
        shippingCost,
        tax,
        total,
        paymentMethod:  'razorpay',
        paymentStatus:  'PENDING',
        status:         'PROCESSING',
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity:  item.quantity,
            price:     priceMap[item.productId],
          }))
        },
        payment: {
          create: {
            razorpayOrderId: rzpOrder.id,
            amount:          total,
            status:          'PENDING',
          }
        },
      }
    })

    res.status(201).json({
      success: true,
      data: {
        razorpayOrderId: rzpOrder.id,
        amount:          amountInPaise,
        currency:        'INR',
        dbOrderId:       dbOrder.id,
      }
    })
  } catch (error) {
    console.error('❌ createOrder error:', error)
    res.status(500).json({ success: false, message: 'Failed to create order' })
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/payment/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId }
// Validates HMAC signature; on success → marks order PAID & clears cart
// ─────────────────────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body

    // 1. HMAC-SHA256 signature verification
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' })
    }

    // 2. Update Payment record
    await prisma.payment.update({
      where:  { orderId: Number(dbOrderId) },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status:            'PAID',
      }
    })

    // 3. Update Order status
    await prisma.order.update({
      where: { id: Number(dbOrderId) },
      data:  { paymentStatus: 'PAID', status: 'PROCESSING' }
    })

    // 4. Clear the user's cart
    await prisma.cartItem.deleteMany({ where: { userId } })

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data:    { orderId: dbOrderId }
    })
  } catch (error) {
    console.error('❌ verifyPayment error:', error)
    res.status(500).json({ success: false, message: 'Payment verification failed' })
  }
}

// ─────────────────────────────────────────────────────────────
// GET /api/payment/orders
// Returns all orders (with items + products) for the logged-in user
// ─────────────────────────────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id

    const orders = await prisma.order.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, brand: true, image: true, price: true }
            }
          }
        },
        payment: {
          select: { razorpayPaymentId: true, razorpayOrderId: true, status: true }
        }
      }
    })

    res.json({ success: true, data: orders })
  } catch (error) {
    console.error('❌ getMyOrders error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch orders' })
  }
}

// ─────────────────────────────────────────────────────────────
// PATCH /api/payment/orders/:id/cancel
// Cancels an order — only allowed when status === PROCESSING
// ─────────────────────────────────────────────────────────────
exports.cancelOrder = async (req, res) => {
  try {
    const userId  = req.user.id
    const orderId = parseInt(req.params.id)

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId }
    })

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.status !== 'PROCESSING') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order that is already ${order.status.toLowerCase()}`
      })
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data:  { status: 'CANCELLED' }
    })

    res.json({ success: true, data: updated, message: 'Order cancelled successfully' })
  } catch (error) {
    console.error('❌ cancelOrder error:', error)
    res.status(500).json({ success: false, message: 'Failed to cancel order' })
  }
}
