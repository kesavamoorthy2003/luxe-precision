const express = require('express')
const router = express.Router()
const { getProducts, getProductById } = require('../controllers/productController')

// GET /api/products
// GET /api/products?category=electronics
// GET /api/products?search=aura
// GET /api/products?sort=price-asc
router.get('/', getProducts)

// GET /api/products/:id
router.get('/:id', getProductById)

module.exports = router
