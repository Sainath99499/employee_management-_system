import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/dashboard`,
  withCredentials: true,
});

export const getDashboardStats = () => api.get('');
