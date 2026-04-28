const prisma = require('../src/config/db.js')

const products = [
  {
    name: 'Spectre Pro 16"',
    brand: 'Quantum',
    category: 'electronics',
    price: 2499,
    description: 'Ultra-thin aerospace aluminum chassis with M-Series architecture. Engineered for those who demand desktop-class performance in a portable form.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
    ],
    specs: ['M-Series Processor', '16GB RAM', '512GB SSD', '16" Retina Display', '18hr Battery'],
    isNew: true,
  },
  {
    name: 'Obsidian Studio',
    brand: 'Nexus',
    category: 'electronics',
    price: 3150,
    description: 'Matte black finish with vapor chamber cooling. Intel Core 9 powerhouse built for creators.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
    ],
    specs: ['Intel Core 9', '32GB RAM', '1TB SSD', '15.6" OLED', 'Thunderbolt 4'],
    isNew: false,
  },
  {
    name: 'Zephyr 14 Lightweight',
    brand: 'Aero',
    category: 'electronics',
    price: 1899,
    description: 'The ultimate travel companion. Weighing just 2.1 lbs with a stunning 14" display.',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    ],
    specs: ['Ryzen 9', '16GB RAM', '512GB SSD', '14" IPS', '20hr Battery'],
    isNew: false,
  },
  {
    name: 'Aura Over-Ear Pro',
    brand: 'Quantum',
    category: 'audio',
    price: 399,
    description: 'Studio-grade sound with adaptive noise cancellation. 40mm planar drivers.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80',
    ],
    specs: ['40mm Planar Drivers', 'ANC Technology', '30hr Battery', 'Bluetooth 5.3', 'Hi-Res Audio'],
    isNew: true,
  },
  {
    name: 'Sonic Precision X',
    brand: 'Nexus',
    category: 'audio',
    price: 299,
    description: 'Precision-tuned audio with deep bass response. Foldable design.',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    ],
    specs: ['50mm Drivers', 'Hybrid ANC', '25hr Battery', 'Bluetooth 5.0', 'Foldable'],
    isNew: false,
  },
  {
    name: 'Chrono Series 4',
    brand: 'Aero',
    category: 'wearables',
    price: 450,
    description: 'Sapphire crystal display with health monitoring and 7-day battery.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
    ],
    specs: ['Sapphire Crystal', 'Health Monitor', '7-day Battery', 'GPS', '5ATM Water Resistant'],
    isNew: true,
  },
  {
    name: 'Aether Pro Max',
    brand: 'Quantum',
    category: 'electronics',
    price: 1499,
    description: 'Sculpted ceramic chassis with edge-to-edge sensory display.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
    ],
    specs: ['Quantum Silicon 3nm', '50MP Camera', '6.7" OLED 120Hz', '36hr Battery', '5G'],
    isNew: true,
  },
  {
    name: 'Velocity Run Sneakers',
    brand: 'Nexus',
    category: 'fashion',
    price: 220,
    description: 'Cloud-cushion technology meets street-ready design.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    ],
    specs: ['Cloud Cushion Sole', 'Breathable Mesh', 'Sizes 6-14', 'Cloud White', 'Vegan'],
    isNew: false,
  },
  {
    name: 'Heritage Tote Bag',
    brand: 'Aero',
    category: 'fashion',
    price: 1000,
    description: 'Full-grain vegetable-tanned leather tote.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ],
    specs: ['Full-Grain Leather', 'Brass Hardware', '3 Pockets', 'Saddle Brown', 'Handcrafted'],
    isNew: false,
  },
  {
    name: 'Artisan Leather Oxford',
    brand: 'Quantum',
    category: 'fashion',
    price: 1245,
    description: 'Hand-stitched Goodyear welt. Italian calfskin upper.',
    image: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
    ],
    specs: ['Italian Calfskin', 'Goodyear Welt', 'Size 42 EU', 'Cognac Brown', 'Made in Italy'],
    isNew: false,
  },
  {
    name: 'Pulse Fit Band',
    brand: 'Nexus',
    category: 'wearables',
    price: 199,
    description: 'Advanced health tracking with 50+ workout modes.',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
    ],
    specs: ['Heart Rate Monitor', 'Sleep Tracking', '14-day Battery', '50+ Workouts', 'IP68'],
    isNew: true,
  },
  {
    name: 'Cashmere Overcoat',
    brand: 'Aero',
    category: 'fashion',
    price: 1250,
    description: '100% Grade-A Mongolian cashmere. Relaxed silhouette.',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    ],
    specs: ['100% Cashmere', 'Size L', 'Camel Color', 'Dry Clean Only', 'Made in Italy'],
    isNew: false,
  },
  {
    name: 'ProBook Studio 16"',
    brand: 'Quantum',
    category: 'electronics',
    price: 3499,
    description: 'Professional workstation for creative professionals.',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
    ],
    specs: ['Intel Core i9', '32GB RAM', '1TB SSD', '16" 4K Display', 'RTX 4070'],
    isNew: false,
  },
  {
    name: 'NoiseFree Buds',
    brand: 'Nexus',
    category: 'audio',
    price: 179,
    description: 'True wireless earbuds with hybrid ANC.',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    ],
    specs: ['Hybrid ANC', '8hr Playtime', '32hr Case', 'IPX4', 'Wireless Charging'],
    isNew: true,
  },
  {
    name: 'Smart Vision Glass',
    brand: 'Aero',
    category: 'wearables',
    price: 899,
    description: 'AR glasses with voice assistant. 30° field of view.',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
    ],
    specs: ['AR Display 30° FOV', 'Voice Assistant', '8hr Battery', 'UV400', 'Titanium Frame'],
    isNew: false,
  },
  {
    name: 'Minimal Desk Speaker',
    brand: 'Quantum',
    category: 'audio',
    price: 349,
    description: 'Minimalist 360° sound. Aerospace aluminum with fabric grille.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    ],
    specs: ['360° Sound', '40W Output', 'WiFi + Bluetooth', 'AUX Input', 'Aluminum + Fabric'],
    isNew: false,
  },
]

async function main() {
  console.log('🌱 Seeding products...')

  // Clear existing products
  await prisma.product.deleteMany()

  // Insert all products
  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log(`✅ ${products.length} products seeded successfully!`)
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
