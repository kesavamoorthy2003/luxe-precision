import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <p className="text-6xl">🛒</p>
        <p className="text-2xl font-black text-gray-900">Your Bag is Empty</p>
        <p className="text-gray-400 text-sm">Add some items to get started</p>
        <button
          onClick={() => navigate('/products')}
          className="px-8 py-4 bg-[#2B3FE7] text-white rounded-full font-bold 
            text-sm tracking-widest uppercase hover:bg-blue-700 transition-all"
        >
          Shop Now
        </button>
      </div>
    )
  }

  const shipping = cartTotal > 500 ? 0 : 50
  const tax = Math.round(cartTotal * 0.05)
  const total = cartTotal + shipping + tax

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-[#0d0d1a] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#2B3FE7] text-xs font-bold tracking-[0.3em] uppercase mb-2">
            Luxe Precision
          </p>
          <h1 className="text-4xl font-black text-white">Your Bag</h1>
          <p className="text-white/40 text-sm mt-2">
            {cartItems.reduce((s, i) => s + i.quantity, 0)} items curated for you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {cartItems.map(item => {
              const product = item.product || item;
              const linkId = item.productId || item.id;
              
              return (
              <div key={item.id}
                className="flex gap-5 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-all">

                {/* Image */}
                <div
                  className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/products/${linkId}`)}
                >
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-[10px] text-[#2B3FE7] font-bold tracking-widest uppercase mb-1">
                    {product.brand} · {product.category}
                  </p>
                  <p className="font-bold text-gray-900 text-sm mb-1">{product.name}</p>
                  <p className="text-[#2B3FE7] font-black">
                    ${(product.price || 0).toLocaleString()}.00
                  </p>
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-col items-end justify-between">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500
                        hover:bg-gray-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500
                        hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              <p className="font-black text-gray-900 text-lg mb-6">Order Summary</p>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Gift card or promo code"
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2.5
                    text-sm outline-none focus:border-[#2B3FE7] transition-colors bg-white"
                />
                <button className="px-4 py-2.5 bg-gray-900 text-white text-xs 
                  font-bold rounded-full hover:bg-[#2B3FE7] transition-colors">
                  Apply
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">${cartTotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                    {shipping === 0 ? 'FREE' : `$${shipping}.00`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">✓ Free shipping applied!</p>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Tax</span>
                  <span className="font-semibold">${tax}.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-[#2B3FE7] text-lg">
                    ${total.toLocaleString()}.00
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-[#2B3FE7] text-white font-bold text-sm
                  tracking-widest uppercase rounded-full hover:bg-blue-700
                  transition-all hover:shadow-[0_0_30px_rgba(43,63,231,0.4)]"
              >
                Proceed to Checkout →
              </button>

              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                🔒 Secure Encrypted Checkout
              </p>

              {/* Continue Shopping */}
              <button
                onClick={() => navigate('/products')}
                className="w-full py-3 mt-3 border border-gray-200 text-gray-600 
                  text-xs font-bold tracking-widest uppercase rounded-full
                  hover:border-gray-400 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}