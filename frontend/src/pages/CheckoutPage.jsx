import { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'

const STEPS = ['Information', 'Shipping', 'Payment']

const INDIAN_STATES = [
  'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra',
  'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal',
  'Telangana', 'Punjab', 'Haryana', 'Bihar', 'Odisha',
]

// ── Inline Toast ───────────────────────────────────────
function Toast({ message, type, onClose }) {
  const colors = {
    success: 'bg-green-500',
    error:   'bg-red-500',
    info:    'bg-[#2B3FE7]',
  }
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4
      rounded-2xl text-white shadow-2xl text-sm font-semibold max-w-sm
      animate-slide-up ${colors[type] || colors.info}`}
    >
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  )
}

// ── Load Razorpay script once ──────────────────────────
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const location   = useLocation()
  const buyNowItem = location.state?.buyNowItem ?? null   // { productId, name, brand, price, image, quantity }
  const isBuyNow   = !!buyNowItem

  const [step, setStep]               = useState(0)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState(null)
  const [toast, setToast]             = useState(null)

  const [info, setInfo] = useState({
    email:      user?.email || '',
    firstName:  user?.name?.split(' ')[0] || '',
    lastName:   user?.name?.split(' ')[1] || '',
    address:    '',
    apartment:  '',
    city:       '',
    state:      'Tamil Nadu',
    pincode:    '',
    phone:      user?.phone || '',
    newsletter: false,
  })

  const [shipping, setShipping] = useState('standard')
  const [payment, setPayment]   = useState('razorpay')

  // ── Buy Now vs Cart totals ────────────────────────
  const displayItems = isBuyNow
    ? [buyNowItem]                  // single product from product page
    : cartItems                     // regular cart items

  const baseTotal    = isBuyNow
    ? buyNowItem.price * buyNowItem.quantity
    : cartTotal

  const shippingCost = baseTotal > 500 ? 0 : 50
  const tax          = Math.round(baseTotal * 0.05)
  const total        = baseTotal + shippingCost + tax

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }, [])

  // ── Razorpay Payment Handler ───────────────────────
  const handleRazorpay = async () => {
    if (!isLoggedIn) {
      showToast('Please log in to complete your purchase.', 'error')
      return navigate('/login')
    }

    setLoading(true)

    try {
      // 1. Load Razorpay JS SDK
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        showToast('Failed to load payment gateway. Check your internet connection.', 'error')
        setLoading(false)
        return
      }

      // 2. Build items payload — Buy Now uses a single item, Cart uses all items
      const cartPayload = isBuyNow
        ? [{ productId: buyNowItem.productId, quantity: buyNowItem.quantity }]
        : cartItems.map(item => ({
            productId: item.productId || item.id,
            quantity:  item.quantity,
          }))

      // 3. Create order on backend → get razorpayOrderId
      const orderRes = await orderService.createRazorpayOrder({
        cartItems:    cartPayload,
        shippingInfo: info,
        shippingCost,
        tax,
      })

      if (!orderRes.success) {
        showToast(orderRes.message || 'Failed to initiate payment.', 'error')
        setLoading(false)
        return
      }

      const { razorpayOrderId, amount, dbOrderId } = orderRes.data

      // 4. Open Razorpay modal
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SiWz05yxSDlA4e',
        amount,
        currency:    'INR',
        name:        'Luxe Precision',
        description: 'Premium Shopping Experience',
        image:       '/logo.png',
        order_id:    razorpayOrderId,
        prefill: {
          name:    `${info.firstName} ${info.lastName}`.trim(),
          email:   info.email,
          contact: info.phone,
          method:  'upi',
        },
        theme: { color: '#2B3FE7' },

        // ── Enable payment methods (use integers — more reliable in test mode) ──
        // Do NOT combine with config.display custom blocks — they conflict.
        method: {
          upi:        1,
          card:       1,
          netbanking: 1,
          wallet:     1,
          emi:        0,
          paylater:   0,
        },

        // ── Success handler ──
        handler: async (response) => {
          try {
            const verifyRes = await orderService.verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              dbOrderId,
            })

            if (verifyRes.success) {
              // Only clear cart for regular checkout — Buy Now leaves bag untouched
              if (!isBuyNow) await clearCart()
              setPlacedOrderId(dbOrderId)
              setOrderPlaced(true)
            } else {
              showToast('Payment verification failed. Please contact support.', 'error')
            }
          } catch (err) {
            console.error('Verify error:', err)
            showToast('Payment recorded but verification failed. We will resolve this shortly.', 'error')
          } finally {
            setLoading(false)
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false)
            showToast('Payment cancelled. You can retry anytime.', 'info')
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', (response) => {
        setLoading(false)
        showToast(
          `Payment failed: ${response.error?.description || 'Something went wrong. Please try again.'}`,
          'error'
        )
      })

      rzp.open()
    } catch (err) {
      console.error('Payment error:', err)
      showToast(err?.response?.data?.message || 'Payment failed. Please try again.', 'error')
      setLoading(false)
    }
  }

  // ── COD Handler ───────────────────────────────────
  const handleCOD = async () => {
    setLoading(true)
    try {
      if (!isBuyNow) await clearCart()   // only clear cart in normal checkout
      setOrderPlaced(true)
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Order Success Screen ───────────────────────────
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center
          ring-8 ring-green-100 animate-bounce-once">
          <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-gray-900">Order Confirmed!</h1>
        <p className="text-gray-400 text-center max-w-sm leading-relaxed">
          Thank you for your purchase. Your order has been placed successfully.
          You'll receive a confirmation email shortly.
        </p>
        {placedOrderId && (
          <div className="bg-gray-50 rounded-2xl px-8 py-4 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
            <p className="text-lg font-black text-gray-900">#{placedOrderId}</p>
          </div>
        )}
        <div className="bg-gray-50 rounded-2xl p-6 w-full max-w-sm text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order Total</p>
          <p className="text-3xl font-black text-[#2B3FE7]">₹{total.toLocaleString()}.00</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-[#2B3FE7] text-white rounded-full font-bold
              text-sm tracking-widest uppercase hover:bg-blue-700 transition-all"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/account/orders')}
            className="px-8 py-3 border border-gray-200 text-gray-700 rounded-full
              font-bold text-sm tracking-widest uppercase hover:border-gray-400 transition-all"
          >
            View Orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Bar */}
      <div className="border-b border-gray-100 py-4 px-6 flex items-center justify-between">
        <span
          onClick={() => navigate('/')}
          className="text-[#2B3FE7] font-extrabold text-xl tracking-tight cursor-pointer"
        >
          LUXE PRECISION
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          🔒 Secure Checkout
        </span>
      </div>

      {/* Step Indicator */}
      <div className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`text-xs font-bold tracking-wider
                ${i === step ? 'text-[#2B3FE7]' : i < step ? 'text-gray-400' : 'text-gray-300'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <span className="text-gray-200 mx-1">›</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── Left: Form ── */}
          <div>

            {/* Step 0: Information */}
            {step === 0 && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-6">Contact Information</h2>

                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={info.email}
                    onChange={e => setInfo({ ...info, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                      outline-none focus:border-[#2B3FE7] transition-colors"
                  />

                  <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={info.newsletter}
                      onChange={e => setInfo({ ...info, newsletter: e.target.checked })}
                      className="accent-[#2B3FE7]"
                    />
                    Email me with news and offers
                  </label>

                  <h2 className="text-xl font-black text-gray-900 mt-4 mb-2">Shipping Address</h2>

                  <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                    outline-none focus:border-[#2B3FE7] bg-white">
                    <option>India</option>
                  </select>

                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="First Name" value={info.firstName}
                      onChange={e => setInfo({ ...info, firstName: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2B3FE7]" />
                    <input placeholder="Last Name" value={info.lastName}
                      onChange={e => setInfo({ ...info, lastName: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2B3FE7]" />
                  </div>

                  <input placeholder="Address" value={info.address}
                    onChange={e => setInfo({ ...info, address: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2B3FE7]" />

                  <input placeholder="Apartment, suite, etc. (optional)" value={info.apartment}
                    onChange={e => setInfo({ ...info, apartment: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2B3FE7]" />

                  <div className="grid grid-cols-3 gap-4">
                    <input placeholder="City" value={info.city}
                      onChange={e => setInfo({ ...info, city: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2B3FE7]" />
                    <select value={info.state}
                      onChange={e => setInfo({ ...info, state: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2B3FE7] bg-white">
                      {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <input placeholder="PIN Code" value={info.pincode}
                      onChange={e => setInfo({ ...info, pincode: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2B3FE7]" />
                  </div>

                  <input placeholder="Phone" value={info.phone}
                    onChange={e => setInfo({ ...info, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2B3FE7]" />
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!info.email || !info.firstName || !info.address || !info.city || !info.pincode}
                  className="w-full mt-8 py-4 bg-[#2B3FE7] text-white font-bold text-sm
                    tracking-widest uppercase rounded-full hover:bg-blue-700 transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to Shipping →
                </button>
              </div>
            )}

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-6">Shipping Method</h2>

                <div className="flex flex-col gap-3">
                  {[
                    { id: 'standard', label: 'Standard Delivery', sub: '5-7 business days', price: 'FREE' },
                    { id: 'express',  label: 'Express Delivery',  sub: '2-3 business days', price: '₹199' },
                    { id: 'nextday',  label: 'Next Day Delivery', sub: 'Order before 2PM',  price: '₹399' },
                  ].map(opt => (
                    <label key={opt.id}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl
                        cursor-pointer transition-all
                        ${shipping === opt.id
                          ? 'border-[#2B3FE7] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => setShipping(opt.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${shipping === opt.id ? 'border-[#2B3FE7]' : 'border-gray-300'}`}>
                          {shipping === opt.id && (
                            <div className="w-2 h-2 rounded-full bg-[#2B3FE7]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                          <p className="text-xs text-gray-400">{opt.sub}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold
                        ${opt.price === 'FREE' ? 'text-green-600' : 'text-gray-900'}`}>
                        {opt.price}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-4 border border-gray-200 text-gray-600 font-bold
                      text-sm tracking-widest uppercase rounded-full hover:border-gray-400 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 bg-[#2B3FE7] text-white font-bold text-sm
                      tracking-widest uppercase rounded-full hover:bg-blue-700 transition-all"
                  >
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-6">Payment</h2>
                <p className="text-xs text-gray-400 mb-6 flex items-center gap-1">
                  🔒 All transactions are secure and encrypted
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  {[
                    { id: 'razorpay', label: 'Razorpay', sub: 'UPI, Cards, Net Banking, Wallets', icon: '💳' },
                    { id: 'cod',      label: 'Cash on Delivery', sub: 'Pay when you receive', icon: '💵' },
                  ].map(opt => (
                    <label key={opt.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl
                        cursor-pointer transition-all
                        ${payment === opt.id
                          ? 'border-[#2B3FE7] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => setPayment(opt.id)}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${payment === opt.id ? 'border-[#2B3FE7]' : 'border-gray-300'}`}>
                        {payment === opt.id && (
                          <div className="w-2 h-2 rounded-full bg-[#2B3FE7]" />
                        )}
                      </div>
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Razorpay badge */}
                {payment === 'razorpay' && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-700 font-semibold flex items-center gap-2">
                      <span>⚡</span>
                      You'll be redirected to Razorpay's secure payment page.
                      Supports UPI, Credit/Debit Cards, Net Banking & Wallets.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border border-gray-200 text-gray-600 font-bold
                      text-sm tracking-widest uppercase rounded-full hover:border-gray-400 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={payment === 'razorpay' ? handleRazorpay : handleCOD}
                    disabled={loading}
                    className="flex-1 py-4 bg-[#2B3FE7] text-white font-bold text-sm
                      tracking-widest uppercase rounded-full hover:bg-blue-700 transition-all
                      disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : `Pay ₹${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}

            {/* Back to cart */}
            <button
              onClick={() => navigate('/cart')}
              className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
            >
              ← Return to cart
            </button>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:border-l lg:border-gray-100 lg:pl-16">
            <p className="font-black text-gray-900 mb-6">Order Summary</p>

            {/* Items — Buy Now shows single product; Cart shows all items */}
            {isBuyNow && (
              <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-[10px] font-bold text-[#2B3FE7] uppercase tracking-widest">
                  ⚡ Direct Purchase — Your bag is unaffected
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
              {displayItems.map((item, idx) => {
                // Support both cart-item shape and buyNowItem shape
                const product = item.product || item
                const price   = product.price ?? item.price ?? 0
                const image   = product.image ?? item.image
                const name    = product.name  ?? item.name
                const brand   = product.brand ?? item.brand
                const key     = item.id ?? item.productId ?? idx

                return (
                  <div key={key} className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50">
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-[#2B3FE7] text-white
                        text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-400">{brand}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      ₹{(price * item.quantity).toLocaleString()}.00
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">₹{baseTotal.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className={shippingCost === 0 ? 'text-green-600 font-bold' : 'font-semibold'}>
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">GST (5%)</span>
                <span className="font-semibold">₹{tax}.00</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-black text-gray-900">Total</span>
                <span className="font-black text-[#2B3FE7] text-lg">
                  ₹{total.toLocaleString()}.00
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}