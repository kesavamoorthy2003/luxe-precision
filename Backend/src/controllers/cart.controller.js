const prisma = require('../config/db')

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: { name: true, price: true, image: true, brand: true, category: true }
        }
      }
    })

    let cartTotal = 0
    const formattedItems = cartItems.map(item => {
      const subtotal = item.quantity * item.product.price
      cartTotal += subtotal
      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        subtotal,
        product: item.product
      }
    })

    res.json({
      success: true,
      data: {
        items: formattedItems,
        cartTotal
      }
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ success: false, message: 'Server error fetching cart' })
  }
}

// POST /api/cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId, quantity } = req.body

    const qty = quantity || 1

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: parseInt(productId)
        }
      }
    })

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + qty }
      })
    } else {
      // Create new item
      await prisma.cartItem.create({
        data: {
          userId,
          productId: parseInt(productId),
          quantity: qty
        }
      })
    }

    // Return updated cart
    return exports.getCart(req, res)
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ success: false, message: 'Server error adding to cart' })
  }
}

// PUT /api/cart/:itemId
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id
    const { itemId } = req.params
    const { quantity } = req.body

    if (quantity < 1) {
      // Remove item
      await prisma.cartItem.deleteMany({
        where: { id: parseInt(itemId), userId }
      })
    } else {
      // Update quantity
      await prisma.cartItem.updateMany({
        where: { id: parseInt(itemId), userId },
        data: { quantity }
      })
    }

    // Return updated cart
    return exports.getCart(req, res)
  } catch (error) {
    console.error('Error updating cart quantity:', error)
    res.status(500).json({ success: false, message: 'Server error updating quantity' })
  }
}

// DELETE /api/cart/:itemId
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { itemId } = req.params

    await prisma.cartItem.deleteMany({
      where: { id: parseInt(itemId), userId }
    })

    // Return updated cart
    return exports.getCart(req, res)
  } catch (error) {
    console.error('Error removing from cart:', error)
    res.status(500).json({ success: false, message: 'Server error removing item' })
  }
}

// DELETE /api/cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id

    await prisma.cartItem.deleteMany({
      where: { userId }
    })

    res.json({
      success: true,
      data: {
        items: [],
        cartTotal: 0
      }
    })
  } catch (error) {
    console.error('Error clearing cart:', error)
    res.status(500).json({ success: false, message: 'Server error clearing cart' })
  }
}
