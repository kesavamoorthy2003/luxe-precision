const prisma = require('../config/db')

// GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const items = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          select: { id: true, name: true, brand: true, category: true, price: true, image: true, inStock: true, isNew: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: items })
  } catch (err) {
    console.error('getWishlist error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' })
  }
}

// POST /api/wishlist/toggle  { productId }
// Adds the product if not present, removes it if already saved → returns new wished state
exports.toggleWishlist = async (req, res) => {
  try {
    const userId    = req.user.id
    const productId = parseInt(req.body.productId)

    if (!productId) return res.status(400).json({ success: false, message: 'productId is required' })

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } }
    })

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } })
      return res.json({ success: true, wished: false, message: 'Removed from wishlist' })
    }

    await prisma.wishlist.create({ data: { userId, productId } })
    res.json({ success: true, wished: true, message: 'Added to wishlist' })
  } catch (err) {
    console.error('toggleWishlist error:', err)
    res.status(500).json({ success: false, message: 'Failed to update wishlist' })
  }
}

// DELETE /api/wishlist/:productId  — explicit remove (used by WishlistPage)
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId    = req.user.id
    const productId = parseInt(req.params.productId)

    await prisma.wishlist.deleteMany({ where: { userId, productId } })
    res.json({ success: true, message: 'Removed from wishlist' })
  } catch (err) {
    console.error('removeFromWishlist error:', err)
    res.status(500).json({ success: false, message: 'Failed to remove from wishlist' })
  }
}
