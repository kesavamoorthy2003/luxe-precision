const prisma = require('../src/config/db.js')

const newProducts = [
  // ── Editorial ──────────────────────────────────────────
  {
    name: 'Noir Structured Blazer',
    brand: 'Quantum',
    category: 'editorial',
    price: 890,
    description: 'Precision-tailored from Italian wool blend. Architectural shoulders and a razor-sharp silhouette for the modern editorial wardrobe.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    ],
    specs: ['Italian Wool Blend', 'Structured Shoulder', 'Double-Vented', 'Dry Clean Only', 'Made in Italy'],
    isNew: true,
    inStock: true,
    stockQuantity: 25,
    rating: 4.8,
  },
  {
    name: 'Monochrome Statement Coat',
    brand: 'Nexus',
    category: 'editorial',
    price: 1350,
    description: 'A collector\'s piece. Oversized silhouette in premium boiled wool with concealed placket. The definitive editorial outerwear.',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
    ],
    specs: ['Boiled Wool', 'Oversized Fit', 'Concealed Placket', 'Sizes XS–XXL', 'Stone White'],
    isNew: true,
    inStock: true,
    stockQuantity: 15,
    rating: 4.9,
  },
  {
    name: 'Sculptural Leather Belt',
    brand: 'Aero',
    category: 'editorial',
    price: 320,
    description: 'Architectural hardware meets full-grain vegetable-tanned leather. A statement accessory anchoring every editorial look.',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80',
    ],
    specs: ['Full-Grain Leather', 'Brass Buckle', 'Width 3.5cm', 'Sizes 70–110cm', 'Vegetable Tanned'],
    isNew: false,
    inStock: true,
    stockQuantity: 40,
    rating: 4.7,
  },

  // ── Collections ────────────────────────────────────────
  {
    name: 'Precision Chronograph I',
    brand: 'Quantum',
    category: 'collections',
    price: 2800,
    description: 'Limited to 500 pieces worldwide. Swiss-movement chronograph housed in a 42mm aerospace-grade titanium case. Signed caseback.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80',
    ],
    specs: ['Swiss ETA Movement', '42mm Titanium Case', 'Sapphire Crystal', '100m Water Resistant', 'Limited 500pcs'],
    isNew: true,
    inStock: true,
    stockQuantity: 12,
    rating: 5.0,
  },
  {
    name: 'Archive Perfume No. 7',
    brand: 'Nexus',
    category: 'collections',
    price: 480,
    description: 'An olfactory masterpiece. Notes of black amber, smoked oud, and cold vetiver. 100ml hand-blown glass flacon with 24k gold collar.',
    image: 'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?w=800&q=80',
      'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=800&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&q=80',
    ],
    specs: ['100ml EDP', 'Black Amber & Oud', 'Hand-blown Flacon', '24k Gold Collar', 'Unisex'],
    isNew: true,
    inStock: true,
    stockQuantity: 30,
    rating: 4.9,
  },
  {
    name: 'Heritage Silk Pocket Square Set',
    brand: 'Aero',
    category: 'collections',
    price: 195,
    description: 'A curated triad of hand-rolled 100% Mulberry silk pocket squares. Museum-archived prints. Presented in a lacquered keepsake box.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    ],
    specs: ['100% Mulberry Silk', 'Hand-rolled Edges', 'Set of 3', 'Museum Print', 'Lacquered Gift Box'],
    isNew: false,
    inStock: true,
    stockQuantity: 50,
    rating: 4.8,
  },
]

async function main() {
  console.log('🌱 Seeding Editorial & Collections products...')

  let created = 0
  for (const product of newProducts) {
    try {
      await prisma.product.create({ data: product })
      created++
      console.log(`  ✅ Created: ${product.name} [${product.category}]`)
    } catch (err) {
      console.warn(`  ⚠️  Skipped (may already exist): ${product.name} — ${err.message}`)
    }
  }

  console.log(`\n🎉 Done! ${created}/${newProducts.length} products added.`)
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
