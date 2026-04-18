import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Heart } from 'lucide-react'

// ── Data ──────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 1,
    name: 'Accessories',
    tag: 'Shop Now',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
  },
  {
    id: 2,
    name: 'Wearables',
    tag: 'Explore',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  },
  {
    id: 3,
    name: 'Audio',
    tag: 'Explore',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
  },
]

const FEATURED = [
  {
    id: 1,
    name: 'Obsidian Ceramic Vase',
    category: 'Home Decor',
    price: '$145.00',
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80',
  },
  {
    id: 2,
    name: 'Aura Over-Ear Headphones',
    category: 'Audio',
    price: '$399.00',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  },
  {
    id: 3,
    name: 'Velocity Run Sneakers',
    category: 'Footwear',
    price: '$220.00',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  },
  {
    id: 4,
    name: 'Chrono Series 4',
    category: 'Wearables',
    price: '$450.00',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  },
]

// ── Components ────────────────────────────────────────

function Marquee() {
  const items = ['NEW ARRIVALS', '✦', 'HIGH FASHION', '✦', 'ELECTRONICS', '✦', 'COLLECTIONS', '✦', 'EDITORIAL', '✦']
  return (
    <div className="overflow-hidden bg-[#0d0d1a] py-4 border-y border-white/5">
      <div className="flex animate-marquee whitespace-nowrap gap-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-12 items-center">
            {items.map((item, idx) => (
              <span key={idx} className="text-[10px] font-bold tracking-[0.3em] text-white/30">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden bg-[#0a0a0f]">
      {/* Background with subtle parallax feel */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop"
          alt="Luxury Background"
          className="w-full h-full object-cover opacity-50 scale-105 transition-transform duration-[10s] hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-3xl animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-[1px] bg-blue-600"></span>
            <span className="text-blue-500 text-xs font-black tracking-[0.4em] uppercase">Limited Edition 2026</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-white leading-tight mb-8">
            Curated for the <br /> 
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Modern Aesthete</span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light">
            A seamless convergence of high-fashion editorial design and cutting-edge personal electronics.
          </p>
          <div className="flex flex-wrap gap-5">
            <button 
              onClick={() => navigate('/products')}
              className="px-10 py-4 bg-blue-600 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-full hover:bg-blue-700 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-1"
            >
              Shop Collection
            </button>
            <button className="px-10 py-4 border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-full hover:bg-white hover:text-black transition-all">
              The Editorial
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className="py-24 bg-white px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[700px]">
          {/* Main Large Card */}
          <Link to="/products?category=accessories" className="md:col-span-7 relative group overflow-hidden rounded-3xl bg-gray-100">
            <img src={CATEGORIES[0].image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-10 left-10 text-white">
              <h3 className="text-4xl font-bold mb-2">{CATEGORIES[0].name}</h3>
              <div className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase">
                {CATEGORIES[0].tag} <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* Side Stack */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {CATEGORIES.slice(1).map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.name.toLowerCase()}`} className="flex-1 relative group overflow-hidden rounded-3xl bg-gray-100">
                <img src={cat.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-xs tracking-widest uppercase opacity-70">{cat.tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  return (
    <div className="group relative">
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#f7f7f7] relative mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" 
        />
        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button className="p-3 bg-white rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
            <Heart size={18} />
          </button>
          <button className="p-3 bg-white rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-1">{product.category}</p>
        <h4 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h4>
        <p className="text-sm font-medium text-gray-500">{product.price}</p>
      </div>
    </div>
  )
}

// ── Main HomePage ─────────────────────────────────────
export default function HomePage() {
  return (
    <main className="bg-white">
      <Hero />
      <Marquee />
      <Categories />
      
      {/* Featured Section */}
      <section className="py-24 px-8 bg-[#fcfcfc]">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-blue-600 text-xs font-black tracking-[0.3em] uppercase mb-2 block">Curated</span>
              <h2 className="text-4xl font-bold text-gray-900">Featured Selections</h2>
            </div>
            <Link to="/products" className="pb-1 border-b-2 border-gray-900 text-sm font-bold hover:text-blue-600 hover:border-blue-600 transition-all">
              View All Products
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Luxury CTA Banner */}
      <section className="py-32 px-8 bg-[#0a0a0f] text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-5xl font-serif text-white mb-6">Elevate your everyday.</h2>
          <p className="text-white/40 text-lg mb-10 font-light">Join our newsletter for exclusive early access to limited edition drops and editorial stories.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="Email Address" className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:border-blue-600 transition-colors" />
            <button className="bg-white text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Subscribe</button>
          </div>
        </div>
      </section>
    </main>
  )
}