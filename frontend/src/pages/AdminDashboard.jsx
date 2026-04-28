import { useState, useEffect } from 'react'
import { adminService } from '../services/adminService'
import { DollarSign, ShoppingCart, Users, Package, Menu, LayoutDashboard, ClipboardList } from 'lucide-react'

import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import AdminCustomers from './admin/AdminCustomers'

const NAV = [
  { key: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { key: 'orders',     label: 'Orders',     icon: ClipboardList },
  { key: 'customers',  label: 'Customers',  icon: Users },
  { key: 'products',   label: 'Products',   icon: Package },
]

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase">{label}</p>
        <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [s, o, c, p] = await Promise.all([
        adminService.getStats(),
        adminService.getOrders(),
        adminService.getCustomers(),
        adminService.getProducts(),
      ])
      if (s.success) setStats(s.data)
      if (o.success) setOrders(o.data)
      if (c.success) setCustomers(c.data)
      if (p.success) setProducts(p.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    const initLoad = async () => {
      setLoading(true)
      await loadData()
      setLoading(false)
    }
    initLoad()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const statCards = [
    { icon: DollarSign, label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, color: 'bg-blue-600' },
    { icon: ShoppingCart, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'bg-emerald-500' },
    { icon: Users, label: 'Total Customers', value: stats?.totalCustomers || 0, color: 'bg-violet-500' },
    { icon: Package, label: 'Active Products', value: stats?.activeProducts || 0, color: 'bg-amber-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f1117] text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-black">LP</div>
          <span className="font-black tracking-wider text-sm">LUXE PRECISION</span>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          {NAV.map(n => (
            <button key={n.key} onClick={() => { setPage(n.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${page === n.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <n.icon size={18} />
              {n.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-xl" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-black text-gray-900 capitalize">{page}</h1>
          </div>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>

        <div className="p-6 lg:p-8 space-y-8">
          {/* Dashboard View */}
          {page === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((s, i) => <StatCard key={i} {...s} />)}
              </div>
              <AdminOrders orders={orders.slice(0, 10)} onRefresh={loadData} />
            </>
          )}

          {/* Orders View */}
          {page === 'orders' && <AdminOrders orders={orders} onRefresh={loadData} />}

          {/* Customers View */}
          {page === 'customers' && <AdminCustomers customers={customers} onRefresh={loadData} />}

          {/* Products View */}
          {page === 'products' && <AdminProducts products={products} onRefresh={loadData} />}
        </div>
      </main>
    </div>
  )
}
