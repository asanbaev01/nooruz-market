import client from './client';

export const favoriteApi = {
  getAll: () => client.get('/favorites'),
  toggle: (productId) => client.post(`/favorites/${productId}`),
  remove: (productId) => client.delete(`/favorites/${productId}`),
};