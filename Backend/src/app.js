require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

// ── Middleware ────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Health Check ──────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🛍️ Luxe Precision API is running!',
    version: '1.0.0',
    status: 'healthy',
  })
})

// ── Routes (later add பண்ணுவோம்) ─────────────────────
// app.use('/api/auth',     require('./routes/auth.routes'))
// app.use('/api/products', require('./routes/product.routes'))
// app.use('/api/cart',     require('./routes/cart.routes'))
// app.use('/api/orders',   require('./routes/order.routes'))

// ── 404 Handler ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// ── Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

module.exports = app