package com.example.ems.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.ems.model.Employee;
import com.example.ems.repository.EmployeeRepository;

@Service
public class EmployeeServiceImpl implements EmployeeService {

	@Autowired
	private EmployeeRepository employeeRepository;

	@Override
	public List<Employee> getAllEmployees() {
		return employeeRepository.findAll();
	}

	@Override
	public void saveEmployee(Employee employee) {
		this.employeeRepository.save(employee);
	}

	@Override
	public Employee getEmployeeById(long id) {
		Optional<Employee> optional = employeeRepository.findById(id);
		Employee employee = null;
		if (optional.isPresent()) {
			employee = optional.get();
		} else {
			throw new RuntimeException(" Employee not found for id :: " + id);
		}
		return employee;
	}

	@Override
	public void deleteEmployeeById(long id) {
		this.employeeRepository.deleteById(id);
	}

	@Override
	public List<Employee> searchEmployees(String keyword) {
		if (keyword != null && !keyword.isEmpty()) {
			return employeeRepository.search(keyword);
		}
		return employeeRepository.findAll();
	}

	@Override
	public List<Employee> searchWithFilters(String name, String department, Double minSalary, Double maxSalary) {
		if ((name == null || name.isEmpty()) &&
				(department == null || department.isEmpty()) &&
				minSalary == null && maxSalary == null) {
			return employeeRepository.findAll();
		}
		return employeeRepository.advancedSearch(
				name,
				(department == null || department.isEmpty()) ? null : department,
				minSalary != null ? java.math.BigDecimal.valueOf(minSalary) : null,
				maxSalary != null ? java.math.BigDecimal.valueOf(maxSalary) : null);
	}

	@Override
	public Page<Employee> findPaginated(Pageable pageable) {
		return employeeRepository.findAll(pageable);
	}
}
