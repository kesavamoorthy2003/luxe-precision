const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const admin = require('../controllers/adminController')

// All admin routes require authentication
router.use(protect)

// Admin role guard
router.use((req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  next()
})

// Dashboard
router.get('/stats',     admin.getStats)

// Orders
router.get('/orders',              admin.getOrders)
router.patch('/orders/:id/status', admin.updateOrderStatus)

// Customers
router.get('/customers',              admin.getCustomers)
router.post('/customers',             admin.createCustomer)
router.patch('/customers/:id',        admin.updateCustomer)
router.patch('/customers/:id/role',   admin.updateCustomerRole)
router.delete('/customers/:id',       admin.deleteCustomer)

// Products
router.get('/products',       admin.getProducts)
router.post('/products',      admin.createProduct)
router.patch('/products/:id', admin.updateProduct)
router.delete('/products/:id', admin.deleteProduct)

module.exports = router
