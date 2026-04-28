require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

// Routes Import
const authRoutes    = require('./routes/authRoutes');
const addressRoutes = require('./routes/addressRoutes');

const app = express()

// ── Middleware ────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Static Files (avatar uploads) ────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ── Health Check ──────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🛍️ Luxe Precision API is running!',
    version: '1.0.0',
    status: 'healthy',
  })
})

// ── API Routes ────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/products',  require('./routes/productRoutes'))
app.use('/api/cart',      require('./routes/cart.routes'))
app.use('/api/payment',   require('./routes/paymentRoutes'))
app.use('/api/wishlist',  require('./routes/wishlistRoutes'))
app.use('/api/admin',     require('./routes/adminRoutes'))

// ── 404 Handler ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.originalUrl} not found` 
  })
})

// ── Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Internal server error' 
  })
})

module.exports = app