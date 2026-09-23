import client from './client';

export const userApi = {
  getAll: (params) => client.get('/users', { params }),
  getById: (id) => client.get(`/users/${id}`),
  update: (id, data) => client.put(`/users/${id}`, data),
  delete: (id) => client.delete(`/users/${id}`),
};