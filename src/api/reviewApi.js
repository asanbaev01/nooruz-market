import client from './client';

export const reviewApi = {
  getByProduct: (productId, params) => client.get(`/reviews/product/${productId}`, { params }),
  create: (data) => client.post('/reviews', data),
  update: (id, data) => client.put(`/reviews/${id}`, data),
  delete: (id) => client.delete(`/reviews/${id}`),
};