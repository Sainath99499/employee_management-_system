import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/employees',
  withCredentials: true,
});

export const getAttendance = (employeeId) =>
  api.get(`/${employeeId}/attendance`);

export const markAttendance = (employeeId, status) =>
  api.post(`/${employeeId}/attendance`, { status });
