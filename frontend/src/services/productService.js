import api from './api';

export const productService = {
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all' && filters.category !== 'new-arrivals') {
      params.append('category', filters.category);
    }
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    // backend currently doesn't process minPrice/maxPrice but we pass them
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    
    // We can handle new-arrivals by sorting or custom query if backend supports it.
    // If backend doesn't support brands filter yet, we will filter it in frontend or pass as comma separated.
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getFeaturedProducts: async () => {
    const response = await api.get('/products?sort=newest&limit=4');
    return response.data;
  }
};

export default productService;
