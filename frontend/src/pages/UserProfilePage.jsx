import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import { User, Package, MapPin, CreditCard, Settings as SettingsIcon, Shield, Key, Wallet, ShieldCheck, Plus, Smartphone, QrCode, ChevronDown, CheckCircle2, Circle, Banknote, Trash2, Star, Pencil } from 'lucide-react'

// --- Profile Overview Tab ---
function ProfileOverview({ user, onUpdate, onAvatarUpload }) {
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleSave = () => {
    if (editing && onUpdate) onUpdate(form)
    setEditing(!editing)
  }

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      await onAvatarUpload(formData)
    } catch (err) {
      alert('Avatar upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=2B3FE7&color=fff`

  return (
    <div className="animate-in fade-in duration-500 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-white">Profile Overview</h2>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${
            editing ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'border border-white/20 text-gray-300 hover:border-[#2B3FE7] hover:text-[#2B3FE7]'
          }`}
        >
          {editing ? '✓ Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="flex items-center gap-6 mb-10 p-6 bg-white/5 border border-white/10 rounded-2xl">
        {/* Clickable avatar */}
        <div className="relative cursor-pointer group" onClick={handleAvatarClick} title="Change profile picture">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <img src={avatarUrl} alt="profile" className="w-20 h-20 rounded-full object-cover shadow-[0_0_15px_rgba(43,63,231,0.5)]" />
          <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-all ${uploading ? 'bg-black/60' : 'bg-black/0 group-hover:bg-black/50'}`}>
            {uploading
              ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
            }
          </div>
        </div>
        <div>
          <p className="text-xl font-black text-white">{user?.name || 'Luxe User'}</p>
          <p className="text-sm text-gray-300">{user?.email}</p>
          <p className="text-xs text-[#2B3FE7] font-semibold mt-1">Luxe Member since {user?.memberSince || '2024'}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Click avatar to change photo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Full Name', key: 'name', type: 'text' },
          { label: 'Email Address', key: 'email', type: 'email' },
          { label: 'Phone Number', key: 'phone', type: 'tel' },
        ].map(field => (
          <div key={field.key}>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">{field.label}</label>
            <input
              type={field.type}
              value={form[field.key]}
              onChange={e => setForm({ ...form, [field.key]: e.target.value })}
              disabled={!editing}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all ${
                editing ? 'border-white/30 focus:border-[#2B3FE7] bg-white/10 text-white' : 'border-transparent bg-white/5 text-gray-400'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}


// ── Status config (mirrors OrderHistoryPage) ─────────
const ORDER_STATUS = {
  PROCESSING: { label: 'Processing',  color: 'bg-amber-500/20 text-amber-400' },
  SHIPPED:    { label: 'In Transit',  color: 'bg-blue-500/20 text-blue-400'   },
  DELIVERED:  { label: 'Delivered',   color: 'bg-emerald-500/20 text-emerald-400' },
  CANCELLED:  { label: 'Cancelled',   color: 'bg-red-500/20 text-red-400'     },
}

function OrdersTab({ onViewAll }) {
  const navigate = useNavigate()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await API.get('/payment/orders')
        if (!cancelled && res.data.success) {
          setOrders(res.data.data)
        }
      } catch (e) {
        if (!cancelled) setError('Failed to load orders.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchOrders()
    return () => { cancelled = true }
  }, [])

  const recent = orders.slice(0, 2)

  return (
    <div className="animate-in fade-in duration-500 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.1)]">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-white">Order History</h2>
        {orders.length > 0 && (
          <button
            onClick={onViewAll}
            className="text-xs font-bold tracking-widest uppercase text-[#2B3FE7]
              hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            View All →
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-2/3 bg-white/10 rounded" />
                <div className="h-3 w-1/2 bg-white/10 rounded" />
                <div className="h-3 w-1/3 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Package className="w-12 h-12 text-white/20 mb-3" />
          <p className="text-red-400 font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="w-16 h-16 text-white/20 mb-4" />
          <p className="text-gray-300 font-medium">No orders yet.</p>
          <p className="text-gray-500 text-sm mt-2">When you place an order, it will appear here.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 px-6 py-2.5 rounded-full bg-[#2B3FE7] text-white text-xs font-bold
              tracking-widest uppercase hover:shadow-[0_0_20px_rgba(43,63,231,0.5)] transition-all"
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* Order Cards */}
      {!loading && !error && recent.length > 0 && (
        <div className="flex flex-col gap-4">
          {recent.map(order => {
            const status = ORDER_STATUS[order.status] || ORDER_STATUS.PROCESSING
            const date   = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })

            return (
              <div key={order.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10
                  hover:border-white/20 transition-all"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
                      Order #{order.id}
                    </p>
                    <p className="text-xs text-gray-400">{date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-black">₹{order.total.toLocaleString()}.00</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Items (first 2 max) */}
                <div className="flex flex-col gap-3">
                  {order.items.slice(0, 2).map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => navigate(`/products/${item.productId}`)}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5
                        ring-1 ring-white/10 group-hover:ring-[#2B3FE7] transition-all flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate
                          group-hover:text-[#2B3FE7] transition-colors">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.product.brand} · Qty {item.quantity} · ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-500 pl-1">
                      +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {/* Footer link */}
          <button
            onClick={onViewAll}
            className="w-full py-3 rounded-2xl border border-white/10 text-xs font-bold
              text-gray-400 tracking-widest uppercase hover:border-[#2B3FE7] hover:text-[#2B3FE7]
              transition-all"
          >
            View All Orders ({orders.length})
          </button>
        </div>
      )}
    </div>
  )
}


function AddressesTab() {
  const [addresses, setAddresses]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [saving, setSaving]           = useState(false)
  const [formError, setFormError]     = useState('')
  const [successMsg, setSuccessMsg]   = useState('')
  const [editingId, setEditingId]     = useState(null)  // null = Add mode, number = Edit mode
  const emptyForm = { label: 'Home', name: '', address: '', apartment: '', city: '', state: '', pincode: '', phone: '' }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { fetchAddresses() }, [])

  const fetchAddresses = async () => {
    try {
      const res = await API.get('/addresses')
      if (res.data.success) setAddresses(res.data.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  // Open form pre-filled with existing address data
  const handleEditClick = (addr) => {
    setEditingId(addr.id)
    setForm({ label: addr.label, name: addr.name, address: addr.address, apartment: addr.apartment || '', city: addr.city, state: addr.state, pincode: addr.pincode, phone: addr.phone })
    setShowForm(true)
    setFormError('')
    setSuccessMsg('')
  }

  // Cancel — reset to Add mode
  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
  }

  // Add new address
  const handleAdd = async () => {
    if (!form.name || !form.address || !form.city || !form.state || !form.pincode || !form.phone) {
      setFormError('Please fill all required fields.')
      return
    }
    setSaving(true); setFormError('')
    try {
      const res = await API.post('/addresses', form)
      if (res.data.success) {
        setAddresses(prev => [...prev, res.data.data])
        setShowForm(false); setForm(emptyForm)
        setSuccessMsg('Address saved successfully.')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch (e) { setFormError(e.response?.data?.message || 'Failed to save address.') }
    finally { setSaving(false) }
  }

  // Update existing address
  const handleUpdate = async () => {
    if (!form.name || !form.address || !form.city || !form.state || !form.pincode || !form.phone) {
      setFormError('Please fill all required fields.')
      return
    }
    setSaving(true); setFormError('')
    try {
      const res = await API.put(`/addresses/${editingId}`, form)
      if (res.data.success) {
        setAddresses(prev => prev.map(a => a.id === editingId ? res.data.data : a))
        setShowForm(false); setEditingId(null); setForm(emptyForm)
        setSuccessMsg('Address updated successfully.')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch (e) { setFormError(e.response?.data?.message || 'Failed to update address.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/addresses/${id}`)
      setAddresses(prev => prev.filter(a => a.id !== id))
      if (editingId === id) handleCancel()
    } catch (e) { console.error(e) }
  }

  const handleSetDefault = async (id) => {
    try {
      await API.patch(`/addresses/${id}/default`)
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
    } catch (e) { console.error(e) }
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#2B3FE7] transition-colors placeholder-gray-600"
  const labelCls = "text-xs font-bold tracking-widest uppercase text-gray-400 mb-1.5 block"

  return (
    <div className="animate-in fade-in duration-500 space-y-4">
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white">Shipping Locations</h2>
          <button onClick={() => { if (showForm) { handleCancel() } else { setShowForm(true); setEditingId(null); setForm(emptyForm) } }}
            className="px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all bg-[#2B3FE7] text-white hover:shadow-[0_0_20px_rgba(43,63,231,0.6)]">
            {showForm ? '✕ Cancel' : '+ Add New'}
          </button>
        </div>

        {/* Success message */}
        {successMsg && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
            ✓ {successMsg}
          </div>
        )}

        {/* Add / Edit Address Form */}
        {showForm && (
          <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-[#2B3FE7]/30">
            <p className="text-white font-bold mb-5">{editingId ? 'Edit Address' : 'New Address'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Label selector */}
              <div className="md:col-span-2 flex gap-3">
                {['Home', 'Work', 'Other'].map(l => (
                  <button key={l} onClick={() => setForm({ ...form, label: l })}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${form.label === l ? 'bg-[#2B3FE7] text-white border-[#2B3FE7]' : 'border-white/20 text-gray-400 hover:border-white/40'}`}>
                    {l}
                  </button>
                ))}
              </div>

              {/* Full Name */}
              <div>
                <label className={labelCls}>Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name" className={inputCls} />
              </div>

              {/* Phone */}
              <div>
                <label className={labelCls}>Phone *</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone" className={inputCls} />
              </div>

              {/* Street Address */}
              <div className="md:col-span-2">
                <label className={labelCls}>Street Address *</label>
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Street Address" className={inputCls} />
              </div>

              {/* Apartment */}
              <div className="md:col-span-2">
                <label className={labelCls}>Apartment / Suite (optional)</label>
                <input type="text" value={form.apartment} onChange={e => setForm({ ...form, apartment: e.target.value })}
                  placeholder="Apt, Suite, Floor…" className={inputCls} />
              </div>

              {/* City */}
              <div>
                <label className={labelCls}>City *</label>
                <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="City" className={inputCls} />
              </div>

              {/* State */}
              <div>
                <label className={labelCls}>State *</label>
                <input type="text" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                  placeholder="State" className={inputCls} />
              </div>

              {/* Pincode */}
              <div>
                <label className={labelCls}>Pincode *</label>
                <input type="text" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })}
                  placeholder="Pincode" className={inputCls} />
              </div>

            </div>
            {formError && <p className="text-red-400 text-xs mb-4">{formError}</p>}
            <button onClick={editingId ? handleUpdate : handleAdd} disabled={saving}
              className="px-8 py-3 rounded-xl bg-[#2B3FE7] text-white text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(43,63,231,0.5)] transition-all disabled:opacity-60">
              {saving ? (editingId ? 'Updating…' : 'Saving…') : (editingId ? 'Update Address' : 'Save Address')}
            </button>
          </div>
        )}

        {/* Address List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-[#2B3FE7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <MapPin className="w-14 h-14 text-white/20 mb-4" />
            <p className="text-gray-300 font-medium">No addresses saved yet.</p>
            <p className="text-gray-500 text-sm mt-1">Click "+ Add New" to save your first address.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className={`p-5 rounded-2xl border transition-colors flex items-start gap-4 ${addr.isDefault ? 'bg-[#2B3FE7]/10 border-[#2B3FE7]/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                <MapPin className="w-5 h-5 text-[#2B3FE7] flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-bold">{addr.label}</h3>
                    {addr.isDefault && <span className="text-[10px] bg-[#2B3FE7] text-white px-2 py-0.5 rounded-full font-bold tracking-wide">DEFAULT</span>}
                  </div>
                  <p className="text-gray-300 text-sm font-medium">{addr.name} · {addr.phone}</p>
                  <p className="text-gray-400 text-sm mt-0.5">{addr.address}{addr.apartment ? `, ${addr.apartment}` : ''}, {addr.city}, {addr.state} – {addr.pincode}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr.id)} title="Set as default"
                      className="p-2 rounded-lg text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors">
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleEditClick(addr)} title="Edit address"
                    className={`p-2 rounded-lg transition-colors ${
                      editingId === addr.id
                        ? 'text-[#2B3FE7] bg-[#2B3FE7]/10'
                        : 'text-gray-500 hover:text-[#2B3FE7] hover:bg-[#2B3FE7]/10'
                    }`}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} title="Delete"
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


function PaymentsTab() {
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay')
  const [upiId, setUpiId] = useState('')

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl pb-24 relative mx-auto">
      {/* Header section with Security Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-white">Payment Options</h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold tracking-widest uppercase mt-4 sm:mt-0">
          <ShieldCheck className="w-4 h-4" />
          100% Secure Checkout
        </div>
      </div>

      <div className="space-y-4">

        {/* Luxe Wallet (Powered by Razorpay) */}
        <div className={`rounded-2xl backdrop-blur-xl bg-white/5 border transition-all ${selectedMethod === 'wallet' ? 'border-[#2B3FE7] shadow-[0_0_20px_rgba(43,63,231,0.15)]' : 'border-white/10 hover:border-white/20'}`}>
          <div 
            onClick={() => setSelectedMethod('wallet')}
            className="p-6 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
               {selectedMethod === 'wallet' ? <CheckCircle2 className="w-6 h-6 text-[#2B3FE7]" /> : <Circle className="w-6 h-6 text-gray-500" />}
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#02042B] to-[#2B3FE7] flex items-center justify-center p-2 shadow-md">
                    <Wallet className="w-5 h-5 text-white" />
                 </div>
                 <div>
                   <p className="text-white font-bold text-base tracking-wide">Luxe Wallet</p>
                   <p className="text-[#2B3FE7] text-xs font-bold tracking-widest uppercase mt-0.5">Powered by Razorpay</p>
                 </div>
               </div>
            </div>
            {selectedMethod !== 'wallet' && <p className="text-white font-black">₹4,500.00</p>}
          </div>

          {selectedMethod === 'wallet' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 sm:ml-14">
               <div className="p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Available Balance</p>
                    <p className="text-white text-3xl font-black tracking-tight">₹4,500.00</p>
                  </div>
                  <button className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all bg-[#2B3FE7] text-white hover:shadow-[0_0_20px_rgba(43,63,231,0.6)]">
                    Pay ₹12,499
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* UPI Section */}
        <div className={`rounded-2xl backdrop-blur-xl bg-white/5 border transition-all ${selectedMethod === 'upi' ? 'border-[#2B3FE7] shadow-[0_0_20px_rgba(43,63,231,0.15)]' : 'border-white/10 hover:border-white/20'}`}>
          <div 
            onClick={() => setSelectedMethod('upi')}
            className="p-6 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
               {selectedMethod === 'upi' ? <CheckCircle2 className="w-6 h-6 text-[#2B3FE7]" /> : <Circle className="w-6 h-6 text-gray-500" />}
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-inner border border-white/10">
                    <Smartphone className="w-5 h-5 text-white" />
                 </div>
                 <p className="text-white font-bold text-base tracking-wide">Other UPI Apps</p>
               </div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${selectedMethod === 'upi' ? 'text-[#2B3FE7] rotate-180' : 'text-gray-500'}`} />
          </div>

          {selectedMethod === 'upi' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 sm:ml-14">
               <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4">Choose an app</p>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {/* GPay */}
                  <div 
                     onClick={() => setSelectedUpiApp('gpay')}
                     className={`p-4 rounded-xl backdrop-blur-xl border transition-all flex items-center gap-3 cursor-pointer ${selectedUpiApp === 'gpay' ? 'border-[#2B3FE7] bg-[#2B3FE7]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                  >
                     {selectedUpiApp === 'gpay' ? <div className="w-4 h-4 rounded-full border-[4px] border-[#2B3FE7] bg-white"></div> : <div className="w-4 h-4 rounded-full border border-gray-500"></div>}
                     <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-blue-600 shadow-md">G</div>
                     <span className="text-sm font-bold text-white">GPay</span>
                  </div>

                  {/* PhonePe */}
                  <div 
                     onClick={() => setSelectedUpiApp('phonepe')}
                     className={`p-4 rounded-xl backdrop-blur-xl border transition-all flex items-center gap-3 cursor-pointer ${selectedUpiApp === 'phonepe' ? 'border-[#2B3FE7] bg-[#2B3FE7]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                  >
                     {selectedUpiApp === 'phonepe' ? <div className="w-4 h-4 rounded-full border-[4px] border-[#2B3FE7] bg-white"></div> : <div className="w-4 h-4 rounded-full border border-gray-500"></div>}
                     <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black text-white shadow-md">पे</div>
                     <span className="text-sm font-bold text-white">PhonePe</span>
                  </div>

                  {/* Paytm */}
                  <div 
                     onClick={() => setSelectedUpiApp('paytm')}
                     className={`p-4 rounded-xl backdrop-blur-xl border transition-all flex items-center gap-3 cursor-pointer ${selectedUpiApp === 'paytm' ? 'border-[#2B3FE7] bg-[#2B3FE7]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                  >
                     {selectedUpiApp === 'paytm' ? <div className="w-4 h-4 rounded-full border-[4px] border-[#2B3FE7] bg-white"></div> : <div className="w-4 h-4 rounded-full border border-gray-500"></div>}
                     <div className="w-6 h-6 rounded-full bg-[#002970] flex items-center justify-center text-[8px] font-black text-white shadow-md">Paytm</div>
                     <span className="text-sm font-bold text-white">Paytm</span>
                  </div>
               </div>

               <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-4">Or Enter UPI ID</p>
               <div className="flex gap-3">
                 <input 
                   type="text" 
                   placeholder="user@okaxis" 
                   value={upiId}
                   onChange={(e) => setUpiId(e.target.value)}
                   className="flex-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#2B3FE7] transition-colors"
                 />
                 <button className="px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all border border-[#2B3FE7] text-[#2B3FE7] hover:bg-[#2B3FE7] hover:text-white hover:shadow-[0_0_15px_rgba(43,63,231,0.4)]">
                    Verify
                 </button>
               </div>
            </div>
          )}
        </div>

        {/* Credit/Debit Cards */}
        <div className={`rounded-2xl backdrop-blur-xl bg-white/5 border transition-all ${selectedMethod === 'card' ? 'border-[#2B3FE7] shadow-[0_0_20px_rgba(43,63,231,0.15)]' : 'border-white/10 hover:border-white/20'}`}>
          <div 
            onClick={() => setSelectedMethod('card')}
            className="p-6 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
               {selectedMethod === 'card' ? <CheckCircle2 className="w-6 h-6 text-[#2B3FE7]" /> : <Circle className="w-6 h-6 text-gray-500" />}
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shadow-inner border border-white/10">
                    <CreditCard className="w-5 h-5 text-white" />
                 </div>
                 <p className="text-white font-bold text-base tracking-wide">Credit / Debit / ATM Card</p>
               </div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${selectedMethod === 'card' ? 'text-[#2B3FE7] rotate-180' : 'text-gray-500'}`} />
          </div>

          {selectedMethod === 'card' && (
            <div className="px-6 pb-6 pt-2 border-t border-white/5 sm:ml-14">
               <div className="space-y-3 mb-6">
                 {/* Saved Card */}
                 <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:border-[#2B3FE7]/50 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="w-4 h-4 rounded-full border border-gray-500"></div>
                     <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center border border-gray-600">
                        <span className="text-white font-black text-[10px] italic">VISA</span>
                     </div>
                     <p className="text-white font-mono text-sm tracking-widest">**** 4242</p>
                   </div>
                   <input type="password" placeholder="CVV" className="w-16 bg-white/10 border border-white/10 rounded px-2 py-1 text-white text-center text-sm outline-none focus:border-[#2B3FE7] transition-colors" />
                 </div>
               </div>
               
               <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-dashed border-white/20 text-xs font-bold uppercase tracking-widest text-[#2B3FE7] hover:border-[#2B3FE7] hover:bg-[#2B3FE7]/10 transition-all">
                 <Plus className="w-4 h-4" /> Add New Card
               </button>
            </div>
          )}
        </div>

        {/* Cash on Delivery */}
        <div className={`rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 opacity-60 cursor-not-allowed`}>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Circle className="w-6 h-6 text-gray-600" />
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shadow-inner border border-white/5">
                    <Banknote className="w-5 h-5 text-gray-500" />
                 </div>
                 <div>
                   <p className="text-gray-400 font-bold text-base tracking-wide">Cash on Delivery</p>
                   <p className="text-red-400/80 text-xs mt-0.5 font-semibold">Not available for this order</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 backdrop-blur-2xl bg-[#0a0a0a]/80 border-t border-white/10 z-50 flex justify-end items-center">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
             <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">Total Amount</p>
             <p className="text-white text-2xl font-black">₹12,499.00</p>
          </div>
          <button className="w-full sm:w-auto px-12 py-4 rounded-full text-sm font-black tracking-widest uppercase transition-all bg-[#2B3FE7] text-white shadow-[0_0_30px_rgba(43,63,231,0.4)] hover:shadow-[0_0_40px_rgba(43,63,231,0.6)] hover:bg-blue-600">
             PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  )
}
function SettingsTab() {
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })

  const handleChangePassword = async () => {
    setPwMsg({ type: '', text: '' })
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'Please fill all password fields.' }); return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' }); return
    }
    setPwLoading(true)
    try {
      const res = await API.post('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      if (res.data.success) {
        setPwMsg({ type: 'success', text: '✓ Password changed successfully.' })
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } catch (e) {
      setPwMsg({ type: 'error', text: e.response?.data?.message || 'Failed to change password.' })
    } finally {
      setPwLoading(false)
    }
  }

  const PwField = ({ label, k, placeholder }) => (
    <div>
      <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">{label}</label>
      <input
        type="password" placeholder={placeholder || '••••••••'}
        value={pwForm[k]}
        onChange={e => { setPwForm(p => ({ ...p, [k]: e.target.value })); setPwMsg({ type: '', text: '' }) }}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#2B3FE7] transition-colors"
      />
    </div>
  )

  return (
    <div className="animate-in fade-in duration-500 space-y-4">
      {/* Change Password Card */}
      <div className="backdrop-blur-2xl bg-black/40 border border-white/20 rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3 mb-8">
          <Key className="w-7 h-7 text-[#2B3FE7]" />
          <h2 className="text-2xl font-black text-white">Change Password</h2>
        </div>
        <div className="max-w-md space-y-4">
          <PwField label="Current Password" k="currentPassword" />
          <PwField label="New Password" k="newPassword" placeholder="Min. 6 characters" />
          <PwField label="Confirm New Password" k="confirmPassword" />

          {pwMsg.text && (
            <div className={`px-4 py-3 rounded-xl text-sm font-medium ${pwMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              {pwMsg.text}
            </div>
          )}

          <button onClick={handleChangePassword} disabled={pwLoading}
            className="w-full py-3.5 rounded-xl bg-[#2B3FE7] text-white text-xs font-black tracking-widest uppercase hover:shadow-[0_0_20px_rgba(43,63,231,0.5)] transition-all disabled:opacity-60 mt-2">
            {pwLoading ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* 2FA Card */}
      <div className="backdrop-blur-2xl bg-black/40 border border-white/20 rounded-3xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-7 h-7 text-[#2B3FE7]" />
          <h2 className="text-xl font-black text-white">Security Settings</h2>
        </div>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SettingsIcon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-white font-bold text-sm">Two-Factor Authentication</p>
              <p className="text-gray-400 text-xs mt-0.5">Add an extra layer of security</p>
            </div>
          </div>
          <div className="w-10 h-5 bg-gray-600 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UserProfilePage() {
  const { user, logout, updateProfile, uploadAvatar, isLoggedIn } = useAuth();
  const navigate  = useNavigate()
  const location  = useLocation()
  const [activeTab, setActiveTab] = useState('profile')

  // Honour incoming tab request from sidebar links on other pages
  useEffect(() => {
    const requested = location.state?.activeTab
    const valid     = ['profile', 'orders', 'addresses', 'payments', 'settings']
    if (requested && valid.includes(requested)) {
      setActiveTab(requested)
      // Clear the state so a manual back-navigation doesn't re-trigger
      window.history.replaceState({}, '')
    }
  }, []) // run once on mount

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-6">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-12 rounded-3xl text-center shadow-[0_0_40px_rgba(43,63,231,0.2)]">
          <p className="text-6xl mb-4">🔒</p>
          <h2 className="text-3xl font-black text-white">Member Access Only</h2>
          <p className="text-gray-400 mt-2 mb-8">Please authenticate to view your profile</p>
          <button onClick={() => navigate('/login')} className="px-12 py-5 bg-[#2B3FE7] text-white rounded-full font-black text-xs tracking-widest uppercase hover:shadow-[0_0_20px_rgba(43,63,231,0.6)] transition-all">Authenticate Now</button>
        </div>
      </div>
    )
  }

  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2B3FE7&color=fff`;

  const tabs = [
    { id: 'profile', label: 'Profile Overview', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Account Settings', icon: SettingsIcon },
  ]

  const handleUpdateProfile = async (updatedData) => {
    try {
      await updateProfile(updatedData);
      console.log("Profile updated successfully in DB");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save changes. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background glowing orbs for the glassmorphism effect */}
      <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-[#2B3FE7]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.2)] sticky top-24">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                <img src={avatarUrl} alt="profile" className="w-14 h-14 rounded-full ring-2 ring-[#2B3FE7] shadow-[0_0_15px_rgba(43,63,231,0.5)]" />
                <div>
                  <p className="font-black text-white text-base leading-tight">{user?.name || 'Luxe User'}</p>
                  <p className="text-[10px] text-[#2B3FE7] font-black uppercase tracking-widest mt-1">Luxe Member</p>
                </div>
              </div>
              
              <nav className="flex flex-col gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(43,63,231,0.4)] border border-white/20' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#2B3FE7]' : 'text-gray-500'}`} />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>

              <div className="mt-8 pt-8 border-t border-white/10">
                 <button 
                   onClick={logout}
                   className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors border border-transparent hover:border-red-400/20"
                 >
                   Sign Out
                 </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && <ProfileOverview user={user} onUpdate={handleUpdateProfile} onAvatarUpload={uploadAvatar} />}
            {activeTab === 'orders' && <OrdersTab onViewAll={() => navigate('/account/orders')} />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'payments' && <PaymentsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  )
}
