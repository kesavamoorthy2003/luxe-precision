import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MOCK_ADDRESSES = [
  {
    id: 1,
    label: 'Home',
    name: 'Kesav Moorthy',
    address: '42, Anna Nagar 2nd Street',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Office',
    name: 'Kesav Moorthy',
    address: '15, OMR Tech Park, Floor 3',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600119',
    phone: '+91 98765 43210',
    isDefault: false,
  },
]

const MOCK_CARDS = [
  { id: 1, type: 'Visa',       last4: '4242', expiry: '12/26', isDefault: true },
  { id: 2, type: 'Mastercard', last4: '5353', expiry: '08/25', isDefault: false },
]

const SIDEBAR_ITEMS = [
  { label: 'Profile Overview',  key: 'profile',   icon: '👤' },
  { label: 'Order History',     key: 'orders',    icon: '📦' },
  { label: 'Saved Addresses',   key: 'addresses', icon: '📍' },
  { label: 'Payment Methods',   key: 'payments',  icon: '💳' },
  { label: 'Account Settings',  key: 'settings',  icon: '⚙️' },
]

// ── Profile Overview Tab ──────────────────────────────
function ProfileOverview({ user }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: '+91 98765 43210',
  })

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-900">Profile Overview</h2>
        <button
          onClick={() => setEditing(!editing)}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase
            transition-all ${editing
              ? 'bg-green-500 text-white'
              : 'border border-gray-200 text-gray-600 hover:border-[#2B3FE7] hover:text-[#2B3FE7]'}`}
        >
          {editing ? '✓ Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="flex items-center gap-6 mb-10 p-6 bg-gray-50 rounded-2xl">
        <div className="relative">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
          {editing && (
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#2B3FE7] text-white rounded-full text-xs flex items-center justify-center border-2 border-white">
              ✏️
            </button>
          )}
        </div>
        <div>
          <p className="text-xl font-black text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
          <p className="text-xs text-[#2B3FE7] font-semibold mt-1">
            Luxe Member since {user.memberSince}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Full Name',     key: 'name',  type: 'text' },
          { label: 'Email Address', key: 'email', type: 'email' },
          { label: 'Phone Number',  key: 'phone', type: 'tel' },
        ].map(field => (
          <div key={field.key}>
            <label className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2 block">
              {field.label}
            </label>
            <input
              type={field.type}
              value={form[field.key]}
              onChange={e => setForm({ ...form, [field.key]: e.target.value })}
              disabled={!editing}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all
                ${editing
                  ? 'border-gray-200 focus:border-[#2B3FE7] bg-white'
                  : 'border-transparent bg-gray-50 text-gray-600 cursor-default'}`}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-10">
        {[
          { label: 'Total Orders',    value: '4' },
          { label: 'Total Spent',     value: '₹5,817' },
          { label: 'Wishlist Items',  value: '7' },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-50 rounded-2xl p-5 text-center hover:bg-gray-100 transition-colors">
            <p className="text-2xl font-black text-[#2B3FE7] mb-1">{stat.value}</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Addresses Tab (FIXED & FUNCTIONAL) ───────────────────
function AddressesTab() {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ label: 'Home', name: '', address: '', city: '', state: 'Tamil Nadu', pincode: '', phone: '' });

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to remove this address?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleEdit = (addr) => {
    setFormData(addr);
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(a => a.id === editingId ? { ...formData, id: editingId } : a));
    } else {
      setAddresses([...addresses, { ...formData, id: Date.now(), isDefault: false }]);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ label: 'Home', name: '', address: '', city: '', state: 'Tamil Nadu', pincode: '', phone: '' });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-900">Saved Addresses</h2>
        {!showForm && (
          <button 
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="px-5 py-2.5 bg-[#2B3FE7] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-blue-700 transition-all"
          >
            + Add New
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
          <h3 className="font-bold mb-6 text-gray-800 uppercase text-[10px] tracking-widest">
            {editingId ? 'Update Address' : 'Add New Address'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Full Name" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input placeholder="Phone" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm bg-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <input placeholder="Address" className="md:col-span-2 p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm bg-white" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
            <input placeholder="City" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm bg-white" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
            <input placeholder="Pincode" className="p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 text-sm bg-white" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} required />
          </div>
          <div className="mt-6 flex gap-2">
            <button type="submit" className="px-6 py-3 bg-[#2B3FE7] text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-200 text-gray-400 rounded-full text-[10px] font-bold uppercase tracking-widest">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className={`border-2 rounded-2xl p-6 transition-all ${addr.isDefault ? 'border-[#2B3FE7] bg-blue-50/30' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-white border border-gray-100 text-gray-400 px-3 py-1 rounded-full uppercase tracking-tighter">{addr.label}</span>
                  {addr.isDefault && <span className="text-[10px] font-bold bg-[#2B3FE7] text-white px-3 py-1 rounded-full uppercase tracking-tighter">Default</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(addr)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-[#2B3FE7] rounded-lg hover:bg-[#2B3FE7] hover:text-white transition-all shadow-sm">
                    <span className="text-xs">✏️</span>
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <span className="text-xs">🗑️</span>
                  </button>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-900">{addr.name}</p>
              <p className="text-sm text-gray-500 mt-1">{addr.address}</p>
              <p className="text-sm text-gray-500">{addr.city}, {addr.state} — {addr.pincode}</p>
              <p className="text-sm text-gray-800 font-medium mt-2">📞 {addr.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Payment Methods Tab ───────────────────────────────
function PaymentsTab() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-900">Payment Methods</h2>
        <button className="px-5 py-2.5 bg-[#2B3FE7] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-blue-700 transition-all">
          + Add Card
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_CARDS.map(card => (
          <div key={card.id} className={`border-2 rounded-2xl p-5 flex items-center justify-between ${card.isDefault ? 'border-[#2B3FE7] bg-blue-50/30' : 'border-gray-100'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black ${card.type === 'Visa' ? 'bg-blue-600' : 'bg-orange-500'}`}>
                {card.type === 'Visa' ? 'VISA' : 'MC'}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{card.type} •••• {card.last4}</p>
                <p className="text-xs text-gray-400">Expires {card.expiry}</p>
              </div>
              {card.isDefault && <span className="text-[10px] font-bold bg-[#2B3FE7] text-white px-2 py-0.5 rounded-full">DEFAULT</span>}
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs text-[#2B3FE7] font-bold uppercase tracking-tighter">Edit</button>
              <button className="text-xs text-red-400 font-bold uppercase tracking-tighter">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-xs font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span>🔒</span> Secure Payments via Razorpay
        </p>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Your payment data is encrypted and handled according to PCI-DSS standards. Backend connectivity will enable real-time card tokenization.
        </p>
      </div>
    </div>
  )
}

// ── Settings Tab ──────────────────────────────────────
function SettingsTab({ logout }) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState({ orders: true, promotions: false, newsletter: true })

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-gray-900 mb-8">Account Settings</h2>

      <div className="mb-12">
        <h3 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-[0.2em]">Change Password</h3>
        <div className="flex flex-col gap-4 max-w-md">
          {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
            <input key={label} type="password" placeholder={label} className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2B3FE7] transition-colors bg-white" />
          ))}
          <button className="px-8 py-3.5 bg-[#2B3FE7] text-white rounded-full text-xs font-bold tracking-widest uppercase hover:bg-blue-700 transition-all w-fit">
            Update Password
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-xs font-bold text-gray-900 mb-6 uppercase tracking-[0.2em]">Email Notifications</h3>
        <div className="flex flex-col gap-3">
          {[
            { key: 'orders', label: 'Order Updates', sub: 'Status changes and delivery tracking' },
            { key: 'promotions', label: 'Marketing', sub: 'Personalized offers and seasonal deals' },
            { key: 'newsletter', label: 'Newsletter', sub: 'Weekly style guides and new drops' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-bold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
              <button
                onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                className={`w-12 h-6 rounded-full transition-all relative ${notifications[item.key] ? 'bg-[#2B3FE7]' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[item.key] ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-red-100 rounded-[32px] p-8 bg-red-50/30">
        <h3 className="text-xs font-bold text-red-500 mb-4 uppercase tracking-widest">Danger Zone</h3>
        <p className="text-xs text-gray-500 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={() => { logout(); navigate('/') }} className="px-8 py-3 border border-red-200 text-red-500 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all">
            Sign Out
          </button>
          <button className="px-8 py-3 bg-white border border-red-200 text-red-500 rounded-full text-[10px] font-black tracking-widest uppercase hover:bg-red-600 hover:text-white transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────
export default function UserProfilePage() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white p-6">
        <p className="text-6xl mb-2">🔒</p>
        <h2 className="text-3xl font-black text-gray-900">Member Access Only</h2>
        <p className="text-gray-400 text-sm max-w-xs text-center leading-relaxed">Please sign in to access your dashboard, manage orders, and update your preferences.</p>
        <button onClick={() => navigate('/login')} className="px-12 py-5 bg-[#2B3FE7] text-white rounded-full font-black text-xs tracking-[0.2em] uppercase hover:shadow-2xl hover:shadow-blue-100 transition-all">Authenticate Now</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-16">

          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="flex items-center gap-4 mb-10 px-2">
              <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full ring-4 ring-gray-50 shadow-sm" />
              <div>
                <p className="font-black text-gray-900 text-base leading-tight">{user.name}</p>
                <p className="text-[10px] text-[#2B3FE7] font-black uppercase tracking-widest mt-1">Luxe Member</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5">
              {SIDEBAR_ITEMS.map(item => (
                <button
                  key={item.key}
                  onClick={() => {
                    if (item.key === 'orders') navigate('/account/orders')
                    else setActiveTab(item.key)
                  }}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm transition-all text-left
                    ${activeTab === item.key && item.key !== 'orders'
                      ? 'bg-[#2B3FE7] text-white font-bold shadow-xl shadow-blue-100 translate-x-2'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <span className="text-lg opacity-80">{item.icon}</span>
                  <span className="uppercase tracking-widest text-[10px] font-black">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="flex-1 max-w-3xl">
            {activeTab === 'profile'   && <ProfileOverview user={user} />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'payments'  && <PaymentsTab />}
            {activeTab === 'settings'  && <SettingsTab logout={logout} />}
          </div>

        </div>
      </div>
    </div>
  )
}