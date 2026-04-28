import { useState } from 'react'
import { UserCircle, Trash2, Shield, ShieldAlert, Pencil, Plus } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { Modal, ConfirmDialog, InputField, SelectField } from './AdminUI'

const EMPTY_CUSTOMER = { name: '', email: '', phone: '', role: 'USER', password: '', address: '', city: '', state: '', pincode: '' }
const ROLES = [{ value: 'USER', label: 'USER' }, { value: 'ADMIN', label: 'ADMIN' }]

function CustomerForm({ initial, onSave, onCancel, saving }) {
  // If editing, extract primary address info
  const primaryAddr = initial?.addresses?.[0] || {}
  const [f, setF] = useState(initial ? { 
    ...initial, 
    password: '', 
    addressId: primaryAddr.id || '',
    address: primaryAddr.address || '', 
    city: primaryAddr.city || '', 
    state: primaryAddr.state || '', 
    pincode: primaryAddr.pincode || '' 
  } : EMPTY_CUSTOMER)

  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const isEditing = !!initial

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(f) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Full Name" value={f.name} onChange={e => set('name', e.target.value)} required />
        <InputField label="Email Address" type="email" value={f.email} onChange={e => set('email', e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField label="Phone Number" value={f.phone || ''} onChange={e => set('phone', e.target.value)} />
        <SelectField label="Role" value={f.role} onChange={e => set('role', e.target.value)} options={ROLES} />
      </div>

      {!isEditing && (
        <InputField label="Password" type="password" value={f.password} onChange={e => set('password', e.target.value)} required={!isEditing} />
      )}

      <div className="pt-2 border-t mt-4 mb-2">
        <p className="text-sm font-bold text-gray-900 mb-3">Address Information</p>
        <InputField label="Street Address" value={f.address} onChange={e => set('address', e.target.value)} />
        <div className="grid grid-cols-3 gap-4 mt-4">
          <InputField label="City" value={f.city} onChange={e => set('city', e.target.value)} />
          <InputField label="State" value={f.state} onChange={e => set('state', e.target.value)} />
          <InputField label="Pincode" value={f.pincode} onChange={e => set('pincode', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
        <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-bold">
          {saving ? 'Saving...' : 'Save Customer'}
        </button>
      </div>
    </form>
  )
}

export default function AdminCustomers({ customers, onRefresh }) {
  const [confirm, setConfirm] = useState(null) // id to delete
  const [modal, setModal] = useState(null) // 'add' | customer obj for edit
  const [saving, setSaving] = useState(false)

  const handleRoleToggle = async (id, currentRole) => {
    try {
      const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
      await adminService.updateCustomerRole(id, newRole)
      onRefresh()
    } catch (e) { console.error(e) }
  }

  const handleDelete = async () => {
    try {
      await adminService.deleteCustomer(confirm)
      setConfirm(null)
      onRefresh()
    } catch (e) { console.error(e) }
  }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal === 'add') {
        await adminService.createCustomer(data)
      } else {
        await adminService.updateCustomer(modal.id, data)
      }
      setModal(null)
      onRefresh()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">All Customers ({customers.length})</h3>
          <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700">
            <Plus size={16} /> Add Customer
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Email & Phone</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Primary Address</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map(c => {
                const primaryAddr = c.addresses?.[0]
                return (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {c.avatar ? <img src={c.avatar} className="w-8 h-8 rounded-full object-cover" /> : <UserCircle size={32} className="text-gray-300" />}
                      <span className="font-semibold text-gray-900">{c.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{c.email}</p>
                      <p className="text-xs text-gray-400">{c.phone || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {primaryAddr ? (
                        <>
                          <p className="text-gray-900 capitalize">{primaryAddr.city}, {primaryAddr.state}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">{primaryAddr.address}</p>
                        </>
                      ) : <span className="text-gray-400 italic">No Address</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${c.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {c.role || 'USER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setModal(c)} title="Edit Customer" className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleRoleToggle(c.id, c.role || 'USER')} title="Toggle Role" className={`p-2 rounded-lg ${c.role === 'ADMIN' ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-500 hover:bg-gray-100'}`}>
                          {c.role === 'ADMIN' ? <ShieldAlert size={15} /> : <Shield size={15} />}
                        </button>
                        <button onClick={() => setConfirm(c.id)} title="Delete User" className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Customer' : 'Edit Customer'} onClose={() => setModal(null)}>
          <CustomerForm initial={modal === 'add' ? null : modal} onSave={handleSave} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}

      {confirm && <ConfirmDialog message="Are you sure you want to delete this customer? All their orders and data will be lost." onConfirm={handleDelete} onCancel={() => setConfirm(null)} />}
    </>
  )
}
