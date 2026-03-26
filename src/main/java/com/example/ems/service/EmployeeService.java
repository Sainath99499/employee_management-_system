package com.example.ems.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.ems.model.Employee;

public interface EmployeeService {
	List<Employee> getAllEmployees();
	void saveEmployee(Employee employee);
	Employee getEmployeeById(long id);
	void deleteEmployeeById(long id);
	List<Employee> searchEmployees(String keyword);
	List<Employee> searchWithFilters(String name, String department, Double minSalary, Double maxSalary);
	Page<Employee> findPaginated(Pageable pageable);
}
