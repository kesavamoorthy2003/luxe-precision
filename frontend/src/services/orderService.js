import api from './api'

export const orderService = {
  /**
   * POST /api/payment/create-order
   * Creates a Razorpay order and a pending DB order record.
   */
  createRazorpayOrder: async ({ cartItems, shippingInfo, shippingCost, tax }) => {
    const res = await api.post('/payment/create-order', {
      cartItems,
      shippingInfo,
      shippingCost,
      tax,
    })
    return res.data
  },

  /**
   * POST /api/payment/verify
   * Sends Razorpay payment details to backend for HMAC verification.
   */
  verifyPayment: async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId }) => {
    const res = await api.post('/payment/verify', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    })
    return res.data
  },

  /**
   * GET /api/payment/orders
   * Returns all orders for the authenticated user.
   */
  getMyOrders: async () => {
    const res = await api.get('/payment/orders')
    return res.data
  },

  /**
   * PATCH /api/payment/orders/:id/cancel
   * Cancels an order with status PROCESSING.
   */
  cancelOrder: async (orderId) => {
    const res = await api.patch(`/payment/orders/${orderId}/cancel`)
    return res.data
  },
}
