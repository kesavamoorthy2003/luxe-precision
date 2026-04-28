import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { productService } from '../services/productService'
import { useWishlist } from '../context/WishlistContext'

const CATEGORIES = ['all', 'new-arrivals', 'electronics', 'audio', 'wearables', 'fashion', 'editorial', 'collections']
const BRANDS     = ['Quantum', 'Nexus', 'Aero']
const SORT_OPTIONS = [
  { label: 'Curated',     value: 'curated' },
  { label: 'Price: Low',  value: 'price-asc' },
  { label: 'Price: High', value: 'price-desc' },
  { label: 'Newest',      value: 'newest' },
]

const CATEGORY_LABELS = {
  'all':          'All Products',
  'new-arrivals': 'New Arrivals',
  'electronics':  'Electronics',
  'audio':        'Audio',
  'wearables':    'Wearables',
  'fashion':      'High Fashion',
  'editorial':    'Editorial',
  'collections':  'Collections',
}

// ── Product Card ──────────────────────────────────────
function ProductCard({ product }) {
  const { isWished, toggleWishlist } = useWishlist()
  const navigate = useNavigate()
  
  const wished = isWished(product.id)

  return (
    <div className="group cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.isNew && (
          <span className="absolute top-3 left-3 bg-[#2B3FE7] text-white text-[10px]
            font-bold px-2 py-1 rounded-full tracking-wider">
            NEW
          </span>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90
            backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
        >
          <svg className={`w-4 h-4 ${wished ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a2e]/90 backdrop-blur-sm
          py-3 text-center text-white text-xs font-bold tracking-widest uppercase
          translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          Quick View +
        </div>
      </div>

      <p className="text-[10px] text-[#2B3FE7] font-bold tracking-[0.2em] uppercase mb-1">
        {product.brand} · {product.category}
      </p>
      <p className="text-gray-900 font-semibold text-sm mb-1
        group-hover:text-[#2B3FE7] transition-colors leading-snug">
        {product.name}
      </p>
      <p className="text-gray-900 font-bold">${product.price?.toLocaleString()}.00</p>
    </div>
  )
}

// ── Filter Sidebar ────────────────────────────────────
function FilterSidebar({ filters, setFilters }) {
  return (
    <div className="w-full">

      {/* Category */}
      <div className="mb-8">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-4">
          Category
        </p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setFilters(f => ({ ...f, category: cat }))}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center
                  transition-all cursor-pointer
                  ${filters.category === cat
                    ? 'bg-[#2B3FE7] border-[#2B3FE7]'
                    : 'border-gray-300 group-hover:border-[#2B3FE7]'}`}
              >
                {filters.category === cat && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {CATEGORY_LABELS[cat] || cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="mb-8">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-4">
          Brand
        </p>
        <div className="flex flex-col gap-2">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setFilters(f => ({
                  ...f,
                  brands: f.brands.includes(brand)
                    ? f.brands.filter(b => b !== brand)
                    : [...f.brands, brand]
                }))}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center
                  transition-all cursor-pointer
                  ${filters.brands.includes(brand)
                    ? 'bg-[#2B3FE7] border-[#2B3FE7]'
                    : 'border-gray-300 group-hover:border-[#2B3FE7]'}`}
              >
                {filters.brands.includes(brand) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-4">
          Price Range
        </p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
              outline-none focus:border-[#2B3FE7] transition-colors"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm
              outline-none focus:border-[#2B3FE7] transition-colors"
          />
        </div>
      </div>

      {/* Clear */}
      <button
        onClick={() => setFilters({ category: 'all', brands: [], minPrice: '', maxPrice: '', search: '' })}
        className="w-full py-2.5 border border-gray-200 rounded-lg text-sm
          text-gray-500 hover:border-[#2B3FE7] hover:text-[#2B3FE7] transition-all"
      >
        Clear Filters
      </button>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────
export default function ProductListPage() {
  const [searchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    brands: [],
    minPrice: '',
    maxPrice: '',
    search: '',
  })
  const [sort, setSort]               = useState('curated')
  const [view, setView]               = useState('grid')
  const [mobileFilter, setMobileFilter] = useState(false)

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // URL change sync
  useEffect(() => {
    const cat = searchParams.get('category') || 'all'
    setFilters(f => ({ ...f, category: cat }))
  }, [searchParams])

  // Fetch products from API when category, search, or sort changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await productService.getAllProducts({
          category: filters.category,
          search: filters.search,
          sort: sort
        })
        if (response.success) {
          setProducts(response.data)
        } else {
          setError(response.message || 'Failed to fetch products')
        }
      } catch (err) {
        setError(err.message || 'Error loading products')
      } finally {
        setLoading(false)
      }
    }
    
    // Add small debounce for search
    const delayDebounceFn = setTimeout(() => {
      fetchProducts()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [filters.category, filters.search, sort])

  // Local filtering for brands, minPrice, maxPrice
  const filtered = useMemo(() => {
    let list = [...products]

    if (filters.brands.length)
      list = list.filter(p => filters.brands.includes(p.brand))

    if (filters.minPrice)
      list = list.filter(p => p.price >= Number(filters.minPrice))

    if (filters.maxPrice)
      list = list.filter(p => p.price <= Number(filters.maxPrice))

    return list
  }, [products, filters.brands, filters.minPrice, filters.maxPrice])

  return (
    <div className="min-h-screen bg-white">

      {/* Page Header */}
      <div className="bg-[#0d0d1a] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#2B3FE7] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Luxe Precision
          </p>
          <h1 className="text-4xl font-black text-white">
            {CATEGORY_LABELS[filters.category] || filters.category}
          </h1>
          <p className="text-white/40 text-sm mt-2">
            {filtered.length} precision-curated pieces
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8 gap-4">

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full
                text-sm outline-none focus:border-[#2B3FE7] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-full px-4 py-2.5
                outline-none focus:border-[#2B3FE7] cursor-pointer bg-white"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <div className="hidden md:flex border border-gray-200 rounded-full overflow-hidden">
              {['grid', 'list'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider
                    transition-all ${view === v
                      ? 'bg-[#2B3FE7] text-white'
                      : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {v}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileFilter(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 border
                border-gray-200 rounded-full text-sm text-gray-600"
            >
              Filters
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex gap-10">
          <aside className="hidden md:block w-56 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B3FE7]"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-32 text-center text-red-500">
                <p className="text-xl font-bold mb-2">Oops!</p>
                <p>{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-gray-900 font-bold text-lg mb-2">No products found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={view === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'}>
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilter && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilter(false)} />
          <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="font-bold text-gray-900">Filters</p>
              <button onClick={() => setMobileFilter(false)}>
                <svg className="w-5 h-5 text-gray-500" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
        </div>
      )}
    </div>
  )
}