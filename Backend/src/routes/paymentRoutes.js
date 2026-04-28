const express    = require('express')
const router     = express.Router()
const { protect } = require('../middleware/authMiddleware')
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  cancelOrder,
} = require('../controllers/paymentController')

// All routes require authentication
router.use(protect)

// POST /api/payment/create-order  → create Razorpay order + DB record
router.post('/create-order', createOrder)

// POST /api/payment/verify        → verify signature, update DB, clear cart
router.post('/verify', verifyPayment)

// GET  /api/payment/orders        → get logged-in user's order history
router.get('/orders', getMyOrders)

// PATCH /api/payment/orders/:id/cancel
router.patch('/orders/:id/cancel', cancelOrder)

module.exports = router
