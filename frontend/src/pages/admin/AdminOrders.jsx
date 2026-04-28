import { useState } from 'react'
import { ChevronRight, X } from 'lucide-react'
import { adminService } from '../../services/adminService'
import { STATUS_COLORS } from './AdminUI'

const STATUSES = ['PROCESSING','SHIPPED','DELIVERED','CANCELLED']

export default function AdminOrders({ orders, onRefresh }) {
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null) // order id being edited

  const handleStatus = async (id, status) => {
    try { await adminService.updateOrderStatus(id, status); setEditing(null); onRefresh() }
    catch(e) { console.error(e) }
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">All Orders</h3>
          <span className="text-xs text-gray-400">{orders.length} orders</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(o=>(
                <tr key={o.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono text-xs font-bold">#{o.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 text-sm">{o.user?.name||'—'}</p>
                    <p className="text-xs text-gray-400">{o.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 font-bold">₹{o.total?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[o.paymentStatus]||'bg-gray-100 text-gray-500'}`}>{o.paymentStatus}</span>
                  </td>
                  <td className="px-6 py-4">
                    {editing===o.id ? (
                      <select defaultValue={o.status} onChange={e=>handleStatus(o.id,e.target.value)} onBlur={()=>setEditing(null)} autoFocus
                        className="text-xs border border-blue-300 rounded-lg px-2 py-1 outline-none bg-white">
                        {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <button onClick={()=>setEditing(o.id)} className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer hover:ring-2 ring-blue-300 transition-all ${STATUS_COLORS[o.status]||'bg-gray-100 text-gray-500'}`}>
                        {o.status}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                  <td className="px-6 py-4 cursor-pointer" onClick={()=>setSelected(o)}><ChevronRight size={16} className="text-gray-300"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Order #{selected.id}</h3>
              <button onClick={()=>setSelected(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-400 text-xs mb-1">Customer</p><p className="font-bold">{selected.user?.name}</p></div>
                <div><p className="text-gray-400 text-xs mb-1">Email</p><p className="font-bold">{selected.user?.email}</p></div>
                <div><p className="text-gray-400 text-xs mb-1">Phone</p><p className="font-bold">{selected.user?.phone||'—'}</p></div>
                <div><p className="text-gray-400 text-xs mb-1">Payment</p><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[selected.paymentStatus]}`}>{selected.paymentStatus}</span></div>
              </div>
              <div className="border-t pt-4">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Items</p>
                {selected.items?.map(item=>(
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <img src={item.product?.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-400">{item.quantity} × ₹{item.price?.toLocaleString()}</p>
                    </div>
                    <p className="text-sm font-bold">₹{(item.quantity*item.price)?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-black text-lg text-blue-600">₹{selected.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
