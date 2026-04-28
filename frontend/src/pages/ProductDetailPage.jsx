import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { productService } from '../services/productService'

export default function ProductDetailPage() {
  const { addToCart } = useCart()
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [activeImg, setActiveImg] = useState(0)
  const [quantity, setQuantity]   = useState(1)
  const [added, setAdded]         = useState(false)
  const [related, setRelated]     = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await productService.getProductById(id)
        if (response.success && response.data) {
          setProduct(response.data)
          // Fetch related products
          const relatedResponse = await productService.getAllProducts({ category: response.data.category })
          if (relatedResponse.success) {
            setRelated(relatedResponse.data.filter(p => p.id !== response.data.id).slice(0, 4))
          }
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Error fetching product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B3FE7]"></div>
      </div>
    )
  }

  // Product not found
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">😕</p>
        <p className="text-xl font-bold text-gray-900">{error || 'Product not found'}</p>
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
                src={product.images && product.images.length > 0 ? product.images[activeImg] : product.image}
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
            {product.images && product.images.length > 0 && (
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
            )}
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
              ${product.price?.toLocaleString()}.00
            </p>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed mb-8 text-sm">
              {product.description}
            </p>

            {/* Specs */}
            {product.specs && product.specs.length > 0 && (
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
            )}

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
                    ${((product.price || 0) * quantity).toLocaleString()}.00
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
                onClick={() => navigate('/checkout', {
                  state: {
                    buyNowItem: {
                      productId: product.id,
                      name:      product.name,
                      brand:     product.brand,
                      price:     product.price,
                      image:     product.image,
                      quantity,
                    }
                  }
                })}
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
                  <p className="font-bold text-gray-900">${p.price?.toLocaleString()}.00</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}