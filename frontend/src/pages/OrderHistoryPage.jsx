import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Mock Order Data ───────────────────────────────────
const MOCK_ORDERS = [
  {
    id: 'LX-84920',
    date: 'October 24, 2024',
    status: 'shipped',
    total: 1450,
    estimatedDelivery: 'Tomorrow, by 8:00 PM',
    items: [
      { id: 4,  name: 'Aura Over-Ear Pro',     brand: 'Quantum', price: 450,  qty: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80' },
      { id: 9,  name: 'Heritage Tote Bag',      brand: 'Aero',    price: 1000, qty: 1, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&q=80' },
    ]
  },
  {
    id: 'LX-71044',
    date: 'September 12, 2024',
    status: 'delivered',
    total: 220,
    deliveredOn: 'Sep 15',
    items: [
      { id: 8, name: 'Velocity Run Sneakers', brand: 'Nexus', price: 220, qty: 1, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' },
    ]
  },
  {
    id: 'LX-55231',
    date: 'August 3, 2024',
    status: 'delivered',
    total: 3499,
    deliveredOn: 'Aug 7',
    items: [
      { id: 13, name: 'ProBook Studio 16"', brand: 'Quantum', price: 3499, qty: 1, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&q=80' },
    ]
  },
  {
    id: 'LX-44102',
    date: 'July 18, 2024',
    status: 'delivered',
    total: 648,
    deliveredOn: 'Jul 22',
    items: [
      { id: 6,  name: 'Chrono Series 4',   brand: 'Aero',    price: 450, qty: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80' },
      { id: 14, name: 'NoiseFree Buds',    brand: 'Nexus',   price: 179, qty: 1, image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200&q=80' },
    ]
  },
]

const STATUS_CONFIG = {
  processing: { label: 'Processing',  color: 'bg-yellow-100 text-yellow-700' },
  shipped:    { label: 'In Transit',  color: 'bg-blue-100 text-blue-700' },
  delivered:  { label: 'Delivered',   color: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Cancelled',   color: 'bg-red-100 text-red-700' },
}

const TABS = ['All Orders', 'Processing', 'Shipped', 'Delivered']

// ── Tracking Steps ────────────────────────────────────
function TrackingBar({ status }) {
  const steps = ['Confirmed', 'Shipped', 'Delivery']
  const activeStep = status === 'processing' ? 0 : status === 'shipped' ? 1 : 2

  return (
    <div className="flex items-center gap-0 my-4">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          {/* Circle */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
            ${i <= activeStep ? 'bg-[#2B3FE7]' : 'bg-gray-100'}`}>
            {i < activeStep ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : i === activeStep ? (
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            )}
          </div>

          {/* Line */}
          {i < steps.length - 1 && (
            <div className={`flex-1 h-[2px] ${i < activeStep ? 'bg-[#2B3FE7]' : 'bg-gray-100'}`} />
          )}
        </div>
      ))}

      {/* Labels */}
      <div className="absolute" style={{ display: 'none' }} />
    </div>
  )
}

// ── Order Card ────────────────────────────────────────
function OrderCard({ order }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const status = STATUS_CONFIG[order.status]

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-all">

      {/* Header */}
      <div className="p-5 flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Order #{order.id}
          </p>
          <p className="text-sm font-semibold text-gray-900">
            Placed {order.date}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-gray-900">
            ₹{order.total.toLocaleString()}.00
          </p>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Tracking — only for shipped */}
      {order.status === 'shipped' && (
        <div className="px-5 pb-2">
          <div className="relative">
            <TrackingBar status={order.status} />
            <div className="flex justify-between mt-1">
              {['Confirmed', 'Shipped', 'Delivery'].map((s, i) => (
                <p key={i} className={`text-[10px] font-semibold
                  ${i === 1 ? 'text-[#2B3FE7]' : 'text-gray-400'}`}>
                  {s}
                </p>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Estimated Delivery: <span className="font-bold text-gray-900">{order.estimatedDelivery}</span>
          </p>
        </div>
      )}

      {/* Delivered date */}
      {order.status === 'delivered' && (
        <div className="px-5 pb-2">
          <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            Delivered on {order.deliveredOn}
          </p>
        </div>
      )}

      {/* Items Preview */}
      <div className="px-5 pb-4">
        <div className="flex gap-3 flex-wrap">
          {order.items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 flex-1 min-w-[200px] cursor-pointer group"
              onClick={() => navigate(`/products/${item.id}`)}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.image} alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#2B3FE7] transition-colors">
                  {item.name}
                </p>
                <p className="text-xs text-gray-400">{item.brand} · Qty: {item.qty}</p>
                <p className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString()}.00</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-50 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {order.status === 'delivered' && (
            <>
              <button className="text-xs text-gray-500 hover:text-[#2B3FE7] transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Return Item
              </button>
              <button className="text-xs text-[#2B3FE7] hover:underline font-semibold flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Write Review
              </button>
            </>
          )}
          {order.status === 'shipped' && (
            <button className="text-xs text-gray-500 hover:text-[#2B3FE7] transition-colors">
              View Receipt
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {order.status === 'delivered' && (
            <button
              onClick={() => {
                order.items.forEach(item => navigate(`/products/${item.id}`))
              }}
              className="px-4 py-2 bg-gray-900 text-white text-xs font-bold
                tracking-wider uppercase rounded-full hover:bg-[#2B3FE7] transition-all"
            >
              Buy Again
            </button>
          )}
          {order.status === 'shipped' && (
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

// ── Main Page ─────────────────────────────────────────
export default function OrderHistoryPage() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All Orders')

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <p className="text-5xl">🔐</p>
        <p className="text-2xl font-black text-gray-900">Please Sign In</p>
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

  // Filter orders by tab
  const filtered = MOCK_ORDERS.filter(order => {
    if (activeTab === 'All Orders') return true
    if (activeTab === 'Processing') return order.status === 'processing'
    if (activeTab === 'Shipped') return order.status === 'shipped'
    if (activeTab === 'Delivered') return order.status === 'delivered'
    return true
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-10">

          {/* ── Left Sidebar ── */}
          <aside className="hidden md:block w-56 flex-shrink-0">

            {/* User Info */}
            <div className="flex items-center gap-3 mb-8">
              <img src={user.avatar} alt={user.name}
                className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-gray-400">Luxe Member since {user.memberSince}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1">
              {[
                { label: 'Profile Overview',  path: '/account/profile',  icon: '👤' },
                { label: 'Order History',      path: '/account/orders',   icon: '📦', active: true },
                { label: 'Saved Addresses',    path: '/account/profile',  icon: '📍' },
                { label: 'Payment Methods',    path: '/account/profile',  icon: '💳' },
                { label: 'Account Settings',   path: '/account/profile',  icon: '⚙️' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
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

            {/* Need Help */}
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
          <div className="flex-1">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Order History</h1>
              <p className="text-gray-400 text-sm">
                Review your past purchases, track active shipments, and manage returns.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider
                    transition-all
                    ${activeTab === tab
                      ? 'bg-[#2B3FE7] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {tab}
                  {tab !== 'All Orders' && (
                    <span className="ml-1 opacity-60">
                      ({MOCK_ORDERS.filter(o =>
                        o.status === tab.toLowerCase()
                      ).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Orders */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-gray-900 font-bold text-lg mb-2">No orders found</p>
                <p className="text-gray-400 text-sm mb-6">
                  You have no {activeTab.toLowerCase()} orders yet.
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-8 py-3 bg-[#2B3FE7] text-white rounded-full font-bold
                    text-sm tracking-widest uppercase hover:bg-blue-700 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}

            {/* View Older */}
            {activeTab === 'All Orders' && (
              <div className="mt-8 text-center">
                <button className="px-6 py-3 border border-gray-200 text-gray-500
                  text-sm font-bold rounded-full hover:border-gray-400 transition-all">
                  View Older Orders
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}