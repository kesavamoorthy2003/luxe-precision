const prisma = require('../config/db')
const { hashPassword } = require('../utils/passwordUtils')
// GET /api/admin/stats — Dashboard overview cards
exports.getStats = async (req, res) => {
  try {
    const [totalRevenue, totalOrders, totalCustomers, activeProducts] = await Promise.all([
      // Sum of all PAID orders
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'PAID' },
      }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.product.count({ where: { inStock: true } }),
    ])

    res.json({
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalCustomers,
        activeProducts,
      },
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch stats' })
  }
}

// GET /api/admin/orders — All orders with user info
exports.getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, image: true, price: true } },
          },
        },
      },
    })

    res.json({ success: true, data: orders })
  } catch (err) {
    console.error('Admin orders error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch orders' })
  }
}

// GET /api/admin/customers — All users
exports.getCustomers = async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'USER' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        addresses: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { orders: true } },
      },
    })

    res.json({ success: true, data: customers })
  } catch (err) {
    console.error('Admin customers error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch customers' })
  }
}

// GET /api/admin/products — All products
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        price: true,
        image: true,
        inStock: true,
        stockQuantity: true,
        isNew: true,
        createdAt: true,
      },
    })

    res.json({ success: true, data: products })
  } catch (err) {
    console.error('Admin products error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch products' })
  }
}

// ── PRODUCT CRUD ──────────────────────────────────────

// POST /api/admin/products
exports.createProduct = async (req, res) => {
  try {
    const { name, brand, category, price, description, image, images, specs, isNew, stockQuantity } = req.body
    const product = await prisma.product.create({
      data: {
        name, brand, category,
        price: parseFloat(price),
        description: description || '',
        image: image || '',
        images: images || [],
        specs: specs || [],
        isNew: !!isNew,
        inStock: (parseInt(stockQuantity) || 0) > 0,
        stockQuantity: parseInt(stockQuantity) || 0,
      },
    })
    res.status(201).json({ success: true, data: product })
  } catch (err) {
    console.error('Create product error:', err)
    res.status(500).json({ success: false, message: 'Failed to create product' })
  }
}

// PATCH /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const data = { ...req.body }
    if (data.price) data.price = parseFloat(data.price)
    if (data.stockQuantity !== undefined) {
      data.stockQuantity = parseInt(data.stockQuantity)
      data.inStock = data.stockQuantity > 0
    }
    const product = await prisma.product.update({ where: { id: parseInt(id) }, data })
    res.json({ success: true, data: product })
  } catch (err) {
    console.error('Update product error:', err)
    res.status(500).json({ success: false, message: 'Failed to update product' })
  }
}

// DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    console.error('Delete product error:', err)
    res.status(500).json({ success: false, message: 'Failed to delete product' })
  }
}

// ── ORDER STATUS ──────────────────────────────────────

// PATCH /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    })
    res.json({ success: true, data: order })
  } catch (err) {
    console.error('Update order status error:', err)
    res.status(500).json({ success: false, message: 'Failed to update order' })
  }
}

// POST /api/admin/customers
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, role, password, address, city, state, pincode } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name, email, phone, role: role || 'USER', password: hashedPassword,
        ...(address && city && state && pincode ? {
          addresses: {
            create: { name, phone: phone || '', address, city, state, pincode, isDefault: true }
          }
        } : {})
      },
      include: { addresses: true }
    })

    res.status(201).json({ success: true, data: user })
  } catch (err) {
    console.error('Create customer error:', err)
    res.status(500).json({ success: false, message: 'Failed to create customer' })
  }
}

// PATCH /api/admin/customers/:id
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, role, addressId, address, city, state, pincode } = req.body

    // Update user basic info
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, phone, role },
    })

    // If address info is provided
    if (address && city && state && pincode) {
      if (addressId) {
        // Update existing address
        await prisma.address.update({
          where: { id: parseInt(addressId) },
          data: { name, phone: phone || '', address, city, state, pincode }
        })
      } else {
        // Create new address for user
        await prisma.address.create({
          data: { userId: parseInt(id), name, phone: phone || '', address, city, state, pincode, isDefault: true }
        })
      }
    }

    res.json({ success: true, data: user })
  } catch (err) {
    console.error('Update customer error:', err)
    res.status(500).json({ success: false, message: 'Failed to update customer' })
  }
}

// PATCH /api/admin/customers/:id/role
exports.updateCustomerRole = async (req, res) => {
  try {
    const { role } = req.body
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    })
    res.json({ success: true, data: user })
  } catch (err) {
    console.error('Update role error:', err)
    res.status(500).json({ success: false, message: 'Failed to update role' })
  }
}

// DELETE /api/admin/customers/:id
exports.deleteCustomer = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ success: true, message: 'Customer deleted' })
  } catch (err) {
    console.error('Delete customer error:', err)
    res.status(500).json({ success: false, message: 'Failed to delete customer' })
  }
}
