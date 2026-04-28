const express = require('express')
const router = express.Router()
const { getCart, addToCart, updateQuantity, removeFromCart, clearCart } = require('../controllers/cart.controller')
const { protect } = require('../middleware/authMiddleware') // Wait I will check exact import name

// Apply auth middleware to all cart routes
router.use(protect)

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart)

router.route('/:itemId')
  .put(updateQuantity)
  .delete(removeFromCart)

module.exports = router
