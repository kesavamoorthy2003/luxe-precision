import { useEffect, useState, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Heart, Truck, RefreshCw, ShieldCheck, ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { productService } from '../services/productService'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

// ── Constants ──────────────────────────────────────────
const CATEGORIES = [
  { id: 1, name: 'Accessories', tag: 'Shop Now', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80' },
  { id: 2, name: 'Wearables', tag: 'Explore', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
  { id: 3, name: 'Audio', tag: 'Explore', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80' },
]

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80',
]

const getImageSrc = (image, index = 0) => {
  if (image && image.startsWith('http')) return image
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
}

// ── Animation Variants ─────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
}
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

// ── Sub-components ─────────────────────────────────────


function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop" alt="Luxury Background" className="w-full h-full object-cover opacity-50 scale-105 transition-transform duration-[10s] hover:scale-100" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial="hidden" animate="show" variants={staggerContainer} className="max-w-3xl">
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <span className="w-12 h-[1px] bg-blue-600"></span>
            <span className="text-blue-500 text-xs font-black tracking-[0.4em] uppercase">Limited Edition 2026</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-serif text-white leading-tight mb-8">
            Curated for the <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Modern Aesthete</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-white/50 text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light">
            A seamless convergence of high-fashion editorial design and cutting-edge personal electronics.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-5">
            <button onClick={() => navigate('/products')} className="px-10 py-4 bg-blue-600 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-full hover:bg-blue-700 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-1">
              Shop Collection
            </button>
            <Link to="/products" className="px-10 py-4 border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase rounded-full hover:bg-white hover:text-black transition-all">
              The Editorial
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function TrustBadges() {
  const badges = [
    { icon: Truck, title: "Free Express Shipping", desc: "On all orders over $200" },
    { icon: RefreshCw, title: "30-Day Easy Returns", desc: "No questions asked" },
    { icon: ShieldCheck, title: "Secure SSL Checkout", desc: "Encrypted & Safe Payments" }
  ]
  return (
    <div className="bg-white border-b border-gray-100 py-8 px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {badges.map((badge, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center px-4 pt-4 md:pt-0">
              <badge.icon className="w-8 h-8 text-blue-600 mb-3" strokeWidth={1.5} />
              <h4 className="text-sm font-bold text-gray-900 mb-1">{badge.title}</h4>
              <p className="text-xs text-gray-500">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}



function ProductCard({ product, index }) {
  const navigate = useNavigate()
  const { toggleWishlist, isWished } = useWishlist()
  const { addToCart } = useCart()

  const wished = isWished(product.id)
  const imageSrc = getImageSrc(product.image, index)

  const handleWishlistToggle = useCallback(async (e) => {
    e.stopPropagation()
    await toggleWishlist(product.id)
  }, [product.id, toggleWishlist])

  const handleAddToCart = useCallback(async (e) => {
    e.stopPropagation()
    await addToCart(product, 1)
  }, [product, addToCart])

  return (
    <motion.div variants={fadeUp} className="group relative cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#f7f7f7] relative mb-4">
        <img src={imageSrc} alt={product.name} loading="lazy" onError={(e) => e.currentTarget.src = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button onClick={handleWishlistToggle} aria-label="Toggle wishlist" className={`p-3 rounded-full shadow-lg transition-colors ${wished ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-gray-800 hover:bg-blue-600 hover:text-white'}`}>
            <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
          </button>
          <button onClick={handleAddToCart} aria-label="Add to cart" className="p-3 bg-white rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-1">{product.category?.name ?? product.category ?? 'Uncategorized'}</p>
        <h4 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h4>
        <p className="text-sm font-medium text-gray-500">${Number(product.price ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
      </div>
    </motion.div>
  )
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-2xl bg-gray-200 mb-4" />
      <div className="h-2 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  )
}

function BrandStory() {
  return (
    <section className="py-32 px-8 bg-[#fafafa] overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full md:w-1/2">
            <div className="relative aspect-[3/4] md:aspect-square overflow-hidden rounded-[2rem]">
              <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800" alt="Brand Story" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full md:w-1/2">
            <span className="text-blue-600 text-xs font-black tracking-[0.3em] uppercase mb-4 block">Our Philosophy</span>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8 leading-tight">Precision and <br/><span className="italic font-light">Style Combined.</span></h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
              We believe that the tools you use every day should be as meticulously crafted as the clothes you wear. Luxe Precision bridges the gap between high-end fashion aesthetics and uncompromising technological performance.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-gray-900 hover:text-blue-600 transition-colors pb-2 border-b-2 border-gray-900 hover:border-blue-600">
              Discover The Brand <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TrendingNow() {
  const trends = [
    { title: "Minimalist Tech", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600" },
    { title: "Summer Essentials", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600" },
    { title: "The Dark Mode", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600" }
  ];

  return (
    <section className="py-24 px-8 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-xs font-black tracking-[0.3em] uppercase mb-2 block">Curated</span>
          <h2 className="text-4xl font-bold text-gray-900">Trending Now</h2>
        </div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trends.map((trend, idx) => (
            <motion.div variants={fadeUp} key={idx} className="relative group overflow-hidden rounded-2xl aspect-square md:aspect-[4/5] cursor-pointer">
              <Link to="/products" className="block w-full h-full">
                <img src={trend.image} alt={trend.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <h3 className="text-2xl font-serif mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{trend.title}</h3>
                  <span className="text-xs tracking-widest uppercase border border-white/40 px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500">Explore</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}



// ── Main HomePage ──────────────────────────────────────
export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchFeatured = async () => {
      try {
        const res = await productService.getFeaturedProducts()
        if (mounted && res.success) {
          setFeatured(res.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchFeatured()

    const handleScroll = () => setShowScrollTop(window.scrollY > 800)
    window.addEventListener('scroll', handleScroll)
    return () => {
      mounted = false
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <main className="bg-white">
      <Hero />
      <TrustBadges />
      <BrandStory />
      
      {/* ── Featured Selections ── */}
      <section className="py-24 px-8 bg-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-blue-600 text-xs font-black tracking-[0.3em] uppercase mb-2 block">Exclusive</span>
              <h2 className="text-4xl font-bold text-gray-900">Featured Products</h2>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <TrendingNow />
      

      {/* ── Luxury CTA Banner ── */}
      <section className="py-32 px-8 bg-[#0a0a0f] text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-5xl font-serif text-white mb-6">Elevate your everyday.</h2>
          <p className="text-white/40 text-lg mb-10 font-light">
            Join our newsletter for exclusive early access to limited edition drops and editorial stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input type="email" placeholder="Email Address" className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-blue-600 transition-colors" />
            <button className="bg-white text-black px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} onClick={scrollToTop} className="fixed bottom-8 right-8 z-50 p-4 bg-gray-900 text-white rounded-full shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all">
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  )
}