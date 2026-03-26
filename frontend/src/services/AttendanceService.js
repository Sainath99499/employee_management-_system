import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/employees`,
  withCredentials: true,
});

export const getAttendance = (employeeId) =>
  api.get(`/${employeeId}/attendance`);

export const markAttendance = (employeeId, status) =>
  api.post(`/${employeeId}/attendance`, { status });
