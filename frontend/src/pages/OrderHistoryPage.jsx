import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'

// ── Status config ──────────────────────────────────────
const STATUS_CONFIG = {
  PROCESSING: { label: 'Processing',  color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400' },
  SHIPPED:    { label: 'In Transit',  color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500'  },
  DELIVERED:  { label: 'Delivered',   color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED:  { label: 'Cancelled',   color: 'bg-red-100 text-red-700',       dot: 'bg-red-500'   },
}

const TABS = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

// ── Tracking Progress Bar ──────────────────────────────
function TrackingBar({ status }) {
  const steps     = ['Confirmed', 'Shipped', 'Delivered']
  const activeIdx = status === 'PROCESSING' ? 0 : status === 'SHIPPED' ? 1 : 2

  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white
            transition-colors duration-300
            ${i <= activeIdx ? 'bg-[#2B3FE7]' : 'bg-gray-100'}`}>
            {i < activeIdx ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : i === activeIdx ? (
              <div className="w-2 h-2 rounded-full bg-white" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            )}
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-[2px] transition-colors duration-300
              ${i < activeIdx ? 'bg-[#2B3FE7]' : 'bg-gray-100'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Order Card ─────────────────────────────────────────
function OrderCard({ order, onCancel }) {
  const navigate    = useNavigate()
  const [open, setOpen] = useState(false)
  const status      = STATUS_CONFIG[order.status] || STATUS_CONFIG.PROCESSING
  const date        = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden
      hover:border-gray-200 hover:shadow-sm transition-all duration-200">

      {/* Header */}
      <div className="p-5 flex items-start justify-between">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
            Order #{order.id}
          </p>
          <p className="text-sm font-semibold text-gray-900">Placed {date}</p>
          {order.payment?.razorpayPaymentId && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              Payment ID: {order.payment.razorpayPaymentId}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-gray-900">
            ₹{order.total.toLocaleString()}.00
          </p>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1
            rounded-full mt-1 ${status.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>
      </div>

      {/* Tracking bar (only processing & shipped) */}
      {(order.status === 'PROCESSING' || order.status === 'SHIPPED') && (
        <div className="px-5 pb-3">
          <TrackingBar status={order.status} />
          <div className="flex justify-between mt-1">
            {['Confirmed', 'Shipped', 'Delivered'].map((s, i) => (
              <p key={i} className={`text-[10px] font-semibold
                ${i === (order.status === 'PROCESSING' ? 0 : 1) ? 'text-[#2B3FE7]' : 'text-gray-400'}`}>
                {s}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Delivered badge */}
      {order.status === 'DELIVERED' && (
        <div className="px-5 pb-2">
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0
                00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0
                001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Delivered successfully
          </span>
        </div>
      )}

      {/* Items */}
      <div className="px-5 pb-4">
        <div className="flex flex-col gap-3">
          {(open ? order.items : order.items.slice(0, 2)).map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate(`/products/${item.productId}`)}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0
                ring-1 ring-gray-100 group-hover:ring-[#2B3FE7] transition-all">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate
                  group-hover:text-[#2B3FE7] transition-colors">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-400">
                  {item.product.brand} · Qty: {item.quantity}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  ₹{item.price.toLocaleString()}.00
                </p>
              </div>
            </div>
          ))}

          {order.items.length > 2 && (
            <button
              onClick={() => setOpen(o => !o)}
              className="text-xs text-[#2B3FE7] font-bold hover:underline self-start"
            >
              {open
                ? '↑ Show less'
                : `+ ${order.items.length - 2} more item${order.items.length - 2 > 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="border-t border-gray-50 px-5 py-3 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-4">
          {order.status === 'DELIVERED' && (
            <button className="text-xs text-gray-500 hover:text-[#2B3FE7] transition-colors
              flex items-center gap-1 font-medium">
              ↩ Return Item
            </button>
          )}
          {order.status === 'PROCESSING' && (
            <button 
              onClick={() => onCancel(order.id)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
            >
              Cancel Order
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {order.status === 'DELIVERED' && (
            <button
              onClick={() => navigate('/products')}
              className="px-4 py-2 bg-gray-900 text-white text-xs font-bold
                tracking-wider uppercase rounded-full hover:bg-[#2B3FE7] transition-all"
            >
              Buy Again
            </button>
          )}
          {order.status === 'SHIPPED' && (
            <button className="px-4 py-2 bg-[#2B3FE7] text-white text-xs font-bold
              tracking-wider uppercase rounded-full hover:bg-blue-700 transition-all">
              Track Package
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Skeleton loader ────────────────────────────────────
function OrderSkeleton() {
  return (
    <div className="border border-gray-100 rounded-2xl p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-36 bg-gray-100 rounded" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-5 w-20 bg-gray-100 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>
      </div>
      {[1, 2].map(i => (
        <div key={i} className="flex gap-3 mb-3">
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 w-3/4 bg-gray-100 rounded" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────
export default function OrderHistoryPage() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [orders,    setOrders]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    if (!isLoggedIn) return
    fetchOrders()
  }, [isLoggedIn])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await orderService.getMyOrders()
      if (res.success) {
        setOrders(res.data)
      } else {
        setError(res.message || 'Failed to load orders')
      }
    } catch (e) {
      setError('Error fetching orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    
    try {
      const res = await orderService.cancelOrder(orderId)
      if (res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o))
      } else {
        alert(res.message || 'Failed to cancel order')
      }
    } catch (e) {
      alert('Error cancelling order')
    }
  }

  // ── Not logged in ──────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-[#2B3FE7]" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25
              0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0
              00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Please Sign In</h1>
        <p className="text-gray-400 text-sm">Login to view your order history</p>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-4 bg-[#2B3FE7] text-white rounded-full font-bold
            text-sm tracking-widest uppercase hover:bg-blue-700 transition-all"
        >
          Sign In
        </button>
      </div>
    )
  }

  // ── Filter ─────────────────────────────────────────
  const filtered = orders.filter(order => {
    if (activeTab === 'All') return true
    return order.status === activeTab.toUpperCase()
  })

  const countFor = (tab) => {
    if (tab === 'All') return orders.length
    return orders.filter(o => o.status === tab.toUpperCase()).length
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-10">

          {/* ── Sidebar ── */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="flex items-center gap-3 mb-8">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2B3FE7&color=fff`}
                alt={user.name}
                className="w-12 h-12 rounded-full ring-2 ring-blue-100"
              />
              <div>
                <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-gray-400">Luxe Member since {user.memberSince}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {[
                { label: 'Profile Overview', path: '/account/profile', state: { activeTab: 'profile'   }, icon: '👤' },
                { label: 'Order History',    path: '/account/orders',  state: null,                       icon: '📦', active: true },
                { label: 'Saved Addresses',  path: '/account/profile', state: { activeTab: 'addresses' }, icon: '📍' },
                { label: 'Account Settings', path: '/account/profile', state: { activeTab: 'settings'  }, icon: '⚙️' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path, item.state ? { state: item.state } : {})}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                    transition-all text-left
                    ${item.active
                      ? 'bg-[#2B3FE7] text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
              <p className="text-sm font-bold text-gray-900 mb-1">Need Assistance?</p>
              <p className="text-xs text-gray-400 mb-3">
                Our digital concierge is available 24/7 for tailored support.
              </p>
              <button className="text-xs text-[#2B3FE7] font-bold hover:underline">
                Contact Specialist →
              </button>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Order History</h1>
                <p className="text-gray-400 text-sm">
                  Review your past purchases, track active shipments, and manage returns.
                </p>
              </div>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500
                  border border-gray-200 rounded-full hover:border-gray-400 transition-all
                  disabled:opacity-50"
              >
                <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0
                    0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider
                    transition-all flex items-center gap-1.5
                    ${activeTab === tab
                      ? 'bg-[#2B3FE7] text-white shadow-md shadow-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {tab}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full
                    ${activeTab === tab ? 'bg-white/20' : 'bg-gray-200'}`}>
                    {countFor(tab)}
                  </span>
                </button>
              ))}
            </div>

            {/* Error state */}
            {error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-900 font-bold mb-2">Something went wrong</p>
                <p className="text-gray-400 text-sm mb-6">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="px-6 py-3 bg-[#2B3FE7] text-white rounded-full font-bold
                    text-sm tracking-widest uppercase hover:bg-blue-700 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && !error && (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => <OrderSkeleton key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-5xl mb-4">📦</p>
                <p className="text-gray-900 font-bold text-lg">No orders found</p>
                <p className="text-gray-400 text-sm mt-1 mb-6">
                  {activeTab === 'All'
                    ? "You haven't placed any orders yet."
                    : `You have no ${activeTab.toLowerCase()} orders.`}
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-8 py-3 bg-[#2B3FE7] text-white text-xs font-bold tracking-widest uppercase rounded-full hover:shadow-lg transition-all"
                >
                  Start Shopping
                </button>
              </div>
            )}

            {/* Order list */}
            {!loading && !error && filtered.length > 0 && (
              <div className="flex flex-col gap-4">
                {filtered.map(order => (
                  <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}