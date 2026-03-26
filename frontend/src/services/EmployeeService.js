import axios from 'axios';

const BASE = 'http://localhost:8080/api/v1/employees';

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,   // send JSESSIONID cookie
});

export const listEmployees = () => api.get('');

export const getEmployeesPaginated = (page = 0, size = 10) =>
  api.get('', { params: { page, size } });

export const searchEmployees = (name, department, minSalary, maxSalary) =>
  api.get('/search', { params: { name, department, minSalary, maxSalary } });

export const createEmployee = (employee) => api.post('', employee);

export const getEmployee = (employeeId) => api.get(`/${employeeId}`);

export const updateEmployee = (employeeId, employee) => api.put(`/${employeeId}`, employee);

export const deleteEmployee = (employeeId) => api.delete(`/${employeeId}`);
