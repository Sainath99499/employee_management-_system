import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

export const login = (username, password) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return api.post('/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const logout = () => api.post('/logout');

export const getCurrentUser = () => api.get('/api/v1/me');

export const register = (username, password, confirmPassword) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('confirmPassword', confirmPassword);
  return api.post('/register', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};
