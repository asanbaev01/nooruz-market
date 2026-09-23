import client from './client';

export const cartApi = {
  get: () => client.get('/cart'),
  add: (productId, quantity = 1, isWholesale = false) =>
    client.post('/cart', { productId, quantity, isWholesale }),
  update: (itemId, quantity) => client.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId) => client.delete(`/cart/${itemId}`),
  clear: () => client.delete('/cart'),
};