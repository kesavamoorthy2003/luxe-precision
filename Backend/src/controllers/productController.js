const prisma = require('../config/db')

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort, limit } = req.query

    // Build the query object
    const query = {
      where: {}
    }

    if (category) {
      query.where.category = category
    }

    if (search) {
      query.where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (sort) {
      if (sort === 'newest') {
        query.orderBy = { createdAt: 'desc' };
      } else {
        const [field, order] = sort.split('-') // e.g. price-asc -> ['price', 'asc']
        if (field && order) {
          query.orderBy = {
            [field]: order
          }
        }
      }
    }

    if (limit) {
      query.take = parseInt(limit, 10);
    }

    const products = await prisma.product.findMany(query)

    res.json({
      success: true,
      count: products.length,
      data: products
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ success: false, message: 'Server error fetching products' })
  }
}

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    })

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ success: false, message: 'Server error fetching product' })
  }
}
