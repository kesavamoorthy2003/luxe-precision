import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

// ── Same Product Data ─────────────────────────────────
const ALL_PRODUCTS = [
  { id: 1,  name: 'Spectre Pro 16"',        brand: 'Quantum', category: 'electronics', price: 2499, 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
    ],
    isNew: true, description: 'Ultra-thin aerospace aluminum chassis with M-Series architecture. Engineered for those who demand desktop-class performance in a portable form.', 
    specs: ['M-Series Processor', '16GB RAM', '512GB SSD', '16" Retina Display', '18hr Battery'] },

  { id: 2,  name: 'Obsidian Studio',         brand: 'Nexus',   category: 'electronics', price: 3150,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
    ],
    isNew: false, description: 'Matte black finish with vapor chamber cooling. Intel Core 9 powerhouse built for creators and professionals who refuse to compromise.',
    specs: ['Intel Core 9', '32GB RAM', '1TB SSD', '15.6" OLED', 'Thunderbolt 4'] },

  { id: 3,  name: 'Zephyr 14 Lightweight',  brand: 'Aero',    category: 'electronics', price: 1899,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    ],
    isNew: false, description: 'The ultimate travel companion. Weighing just 2.1 lbs with a stunning 14" display and all-day battery life.',
    specs: ['Ryzen 9', '16GB RAM', '512GB SSD', '14" IPS', '20hr Battery'] },

  { id: 4,  name: 'Aura Over-Ear Pro',      brand: 'Quantum', category: 'audio',       price: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80',
    ],
    isNew: true, description: 'Studio-grade sound with adaptive noise cancellation. 40mm planar drivers deliver audiophile precision in a refined over-ear design.',
    specs: ['40mm Planar Drivers', 'ANC Technology', '30hr Battery', 'Bluetooth 5.3', 'Hi-Res Audio'] },

  { id: 5,  name: 'Sonic Precision X',      brand: 'Nexus',   category: 'audio',       price: 299,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    ],
    isNew: false, description: 'Precision-tuned audio with deep bass response. Foldable design for the on-the-go audiophile.',
    specs: ['50mm Drivers', 'Hybrid ANC', '25hr Battery', 'Bluetooth 5.0', 'Foldable Design'] },

  { id: 6,  name: 'Chrono Series 4',        brand: 'Aero',    category: 'wearables',   price: 450,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
    ],
    isNew: true, description: 'Precision timepiece meets smart technology. Sapphire crystal display with health monitoring and 7-day battery life.',
    specs: ['Sapphire Crystal', 'Health Monitor', '7-day Battery', 'GPS', '5ATM Water Resistant'] },

  { id: 7,  name: 'Aether Pro Max',         brand: 'Quantum', category: 'electronics', price: 1499,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
    ],
    isNew: true, description: 'Engineered for absolute precision. Sculpted ceramic chassis with edge-to-edge sensory display and the revolutionary Quantum Silicon processor.',
    specs: ['Quantum Silicon 3nm', '50MP Pro Camera', '6.7" OLED 120Hz', '36hr Battery', '5G + WiFi 7'] },

  { id: 8,  name: 'Velocity Run Sneakers',  brand: 'Nexus',   category: 'fashion',     price: 220,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    ],
    isNew: false, description: 'Cloud-cushion technology meets street-ready design. Engineered for the modern athlete who refuses to sacrifice style.',
    specs: ['Cloud Cushion Sole', 'Breathable Mesh', 'Sizes 6-14', 'Colorway: Cloud White', 'Vegan Materials'] },

  { id: 9,  name: 'Heritage Tote Bag',      brand: 'Aero',    category: 'fashion',     price: 1000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ],
    isNew: false, description: 'Full-grain vegetable-tanned leather. A timeless tote that develops a unique patina over years of use.',
    specs: ['Full-Grain Leather', 'Brass Hardware', 'Interior Pockets x3', 'Saddle Brown', 'Handcrafted'] },

  { id: 10, name: 'Artisan Leather Oxford', brand: 'Quantum', category: 'fashion',     price: 1245,
    image: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80',
    ],
    isNew: false, description: 'Hand-stitched Goodyear welt construction. Italian calfskin upper with a leather sole that improves with every step.',
    specs: ['Italian Calfskin', 'Goodyear Welt', 'Size: 42 EU', 'Cognac Brown', 'Handcrafted in Italy'] },

  { id: 11, name: 'Pulse Fit Band',         brand: 'Nexus',   category: 'wearables',   price: 199,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
    ],
    isNew: true, description: 'Advanced health tracking in a sleek band format. Monitor heart rate, sleep, stress, and 50+ workout modes.',
    specs: ['Heart Rate Monitor', 'Sleep Tracking', '14-day Battery', '50+ Workouts', 'IP68 Waterproof'] },

  { id: 12, name: 'Cashmere Overcoat',      brand: 'Aero',    category: 'fashion',     price: 1250,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    ],
    isNew: false, description: '100% Grade-A Mongolian cashmere. Tailored in a relaxed silhouette for effortless sophistication.',
    specs: ['100% Cashmere', 'Size: L', 'Camel Color', 'Dry Clean Only', 'Made in Italy'] },

  { id: 13, name: 'ProBook Studio 16"',     brand: 'Quantum', category: 'electronics', price: 3499,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
    ],
    isNew: false, description: 'Professional-grade workstation. 32GB RAM, 1TB SSD, and a stunning silver chassis built for creative professionals.',
    specs: ['Intel Core i9', '32GB RAM', '1TB SSD', '16" 4K Display', 'NVIDIA RTX 4070'] },

  { id: 14, name: 'NoiseFree Buds',         brand: 'Nexus',   category: 'audio',       price: 179,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    ],
    isNew: true, description: 'True wireless earbuds with hybrid active noise cancellation. 8hr playtime with 32hr charging case.',
    specs: ['Hybrid ANC', '8hr Playtime', '32hr Case', 'IPX4 Rating', 'Wireless Charging'] },

  { id: 15, name: 'Smart Vision Glass',     brand: 'Aero',    category: 'wearables',   price: 899,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
    ],
    isNew: false, description: 'Augmented reality glasses with voice assistant integration. See the world differently with a 30° field of view.',
    specs: ['AR Display 30° FOV', 'Voice Assistant', '8hr Battery', 'UV400 Lenses', 'Titanium Frame'] },

  { id: 16, name: 'Minimal Desk Speaker',   brand: 'Quantum', category: 'audio',       price: 349,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
    ],
    isNew: false, description: 'Minimalist desktop speaker with room-filling 360° sound. Crafted from aerospace aluminum with a fabric grille.',
    specs: ['360° Sound', '40W Output', 'WiFi + Bluetooth', 'AUX Input', 'Aluminum + Fabric'] },
]

export default function ProductDetailPage() {
  const { addToCart } = useCart()
  const { id } = useParams()
  const navigate = useNavigate()
  const product = ALL_PRODUCTS.find(p => p.id === Number(id))

  const [activeImg, setActiveImg] = useState(0)
  const [quantity, setQuantity]   = useState(1)
  const [added, setAdded]         = useState(false)

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">😕</p>
        <p className="text-xl font-bold text-gray-900">Product not found</p>
        <button onClick={() => navigate('/products')}
          className="px-6 py-3 bg-[#2B3FE7] text-white rounded-full text-sm font-bold">
          Back to Products
        </button>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // Related products — same category, exclude current
  const related = ALL_PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#2B3FE7] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#2B3FE7] transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`}
            className="hover:text-[#2B3FE7] transition-colors capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-600">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* ── Left: Image Gallery ── */}
          <div className="flex flex-col gap-4">

            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-[#2B3FE7] text-white
                  text-xs font-bold px-3 py-1 rounded-full tracking-wider">
                  NEW
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all
                    ${activeImg === i
                      ? 'border-[#2B3FE7] shadow-lg shadow-blue-100'
                      : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div className="flex flex-col">

            {/* Brand + Category */}
            <p className="text-xs text-[#2B3FE7] font-bold tracking-[0.25em] uppercase mb-3">
              {product.brand} · {product.category}
            </p>

            {/* Name */}
            <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4"
              style={{ fontFamily: "'Georgia', serif" }}>
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-3xl font-black text-[#2B3FE7] mb-6">
              ${product.price.toLocaleString()}.00
            </p>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed mb-8 text-sm">
              {product.description}
            </p>

            {/* Specs */}
            <div className="mb-8">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-3">
                Key Specs
              </p>
              <div className="flex flex-wrap gap-2">
                {product.specs.map((spec, i) => (
                  <span key={i}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-100 
                      rounded-full text-xs text-gray-600 font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-3">
                Quantity
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500
                      hover:bg-gray-50 transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500
                      hover:bg-gray-50 transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  Total: <span className="text-gray-900 font-bold">
                    ${(product.price * quantity).toLocaleString()}.00
                  </span>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-full font-bold text-sm tracking-widest
                  uppercase transition-all duration-300
                  ${added
                    ? 'bg-green-500 text-white'
                    : 'bg-[#2B3FE7] text-white hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(43,63,231,0.4)]'}`}
              >
                {added ? '✓ Added to Bag' : 'Add to Bag'}
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 border-2 border-gray-900 text-gray-900 
                  rounded-full font-bold text-sm tracking-widest uppercase
                  hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <svg className="w-5 h-5 text-[#2B3FE7] flex-shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <div>
                <p className="text-xs font-bold text-gray-900">Complimentary Next-Day Delivery</p>
                <p className="text-xs text-gray-400 mt-0.5">Free shipping on all orders</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="bg-gray-50 py-16 mt-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs text-[#2B3FE7] font-bold tracking-[0.3em] uppercase mb-2">
                  You May Also Like
                </p>
                <h2 className="text-2xl font-black text-gray-900">Related Products</h2>
              </div>
              <Link to={`/products?category=${product.category}`}
                className="text-sm text-gray-500 hover:text-[#2B3FE7] transition-colors underline underline-offset-4">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => (
                <div
                  key={p.id}
                  className="group cursor-pointer"
                  onClick={() => { navigate(`/products/${p.id}`); window.scrollTo(0, 0) }}
                >
                  <div className="relative overflow-hidden rounded-xl bg-white aspect-square mb-3">
                    <img src={p.image} alt={p.name}
                      className="w-full h-full object-cover transition-transform 
                        duration-500 group-hover:scale-105" />
                    {p.isNew && (
                      <span className="absolute top-3 left-3 bg-[#2B3FE7] text-white
                        text-[10px] font-bold px-2 py-1 rounded-full">NEW</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#2B3FE7] font-bold tracking-widest uppercase mb-1">
                    {p.brand}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mb-1 
                    group-hover:text-[#2B3FE7] transition-colors">
                    {p.name}
                  </p>
                  <p className="font-bold text-gray-900">${p.price.toLocaleString()}.00</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}