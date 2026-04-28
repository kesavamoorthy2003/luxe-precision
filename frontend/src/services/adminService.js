import api from './api'

export const adminService = {
  getStats:     async () => (await api.get('/admin/stats')).data,
  getOrders:    async () => (await api.get('/admin/orders')).data,
  getCustomers: async () => (await api.get('/admin/customers')).data,
  getProducts:  async () => (await api.get('/admin/products')).data,

  // Products CRUD
  createProduct: async (data) => (await api.post('/admin/products', data)).data,
  updateProduct: async (id, data) => (await api.patch(`/admin/products/${id}`, data)).data,
  deleteProduct: async (id) => (await api.delete(`/admin/products/${id}`)).data,

  // Orders
  updateOrderStatus: async (id, status) => (await api.patch(`/admin/orders/${id}/status`, { status })).data,

  // Customers
  createCustomer:     async (data) => (await api.post('/admin/customers', data)).data,
  updateCustomer:     async (id, data) => (await api.patch(`/admin/customers/${id}`, data)).data,
  updateCustomerRole: async (id, role) => (await api.patch(`/admin/customers/${id}/role`, { role })).data,
  deleteCustomer:     async (id) => (await api.delete(`/admin/customers/${id}`)).data,
}
