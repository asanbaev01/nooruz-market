import client from './client';

export const orderApi = {
  create: (data) => client.post('/orders', data),
  getMy: (params) => client.get('/orders/my', { params }),
  getById: (id) => client.get(`/orders/${id}`),
  cancel: (id) => client.put(`/orders/${id}/cancel`),
  /* ✅ Админ үчүн */
  getAll: (params) => client.get('/orders', { params }),
  updateStatus: (id, status) => client.put(`/orders/${id}/status`, { status }),
  delete: (id) => client.delete(`/orders/${id}`),
};