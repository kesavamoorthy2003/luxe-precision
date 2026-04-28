import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#0d0d1a] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#2B3FE7] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Luxe Precision
          </p>
          <h1 className="text-4xl font-black text-white">Your Wishlist</h1>
          <p className="text-white/40 text-sm mt-2">
            {wishlistItems.length} curated {wishlistItems.length === 1 ? 'piece' : 'pieces'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B3FE7]"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-4xl mb-4">❤️</p>
            <p className="text-gray-900 font-bold text-lg mb-2">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm">Save your favorite items here</p>
            <button
              onClick={() => navigate('/products')}
              className="mt-6 px-8 py-3 rounded-full bg-[#2B3FE7] text-white text-xs font-bold tracking-widest uppercase hover:shadow-lg transition-all"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product = item.product
              return (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square mb-3" onClick={() => navigate(`/products/${product.id}`)}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromWishlist(product.id) }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90
                        backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                    >
                      <svg className="w-4 h-4 text-red-500 fill-red-500"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-[#2B3FE7] font-bold tracking-[0.2em] uppercase mb-1">
                    {product.brand} · {product.category}
                  </p>
                  <p className="text-gray-900 font-semibold text-sm mb-1 group-hover:text-[#2B3FE7] transition-colors leading-snug">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-gray-900 font-bold">${product.price?.toLocaleString()}.00</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(product, 1) }}
                      className="text-xs font-bold text-[#2B3FE7] hover:underline uppercase"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
