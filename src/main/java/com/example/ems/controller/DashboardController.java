package com.example.ems.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.ems.model.Employee;
import com.example.ems.repository.EmployeeRepository;

@Controller
public class DashboardController {

	@Autowired
	private EmployeeRepository employeeRepository;

	@GetMapping("/dashboard")
	public String dashboard(Model model) {
		List<Employee> employees = employeeRepository.findAll();
		long totalEmployees = employees.size();

		Map<String, Long> employeesPerDept = employees.stream()
				.collect(Collectors.groupingBy(
						e -> e.getDepartment() != null ? e.getDepartment() : "Unassigned",
						Collectors.counting()));

		Double averageSalary = employees.stream()
				.filter(e -> e.getSalary() != null)
				.map(e -> e.getSalary().doubleValue())
				.collect(Collectors.averagingDouble(Double::doubleValue));

		model.addAttribute("totalEmployees", totalEmployees);
		model.addAttribute("employeesPerDept", employeesPerDept);
		model.addAttribute("averageSalary", averageSalary.isNaN() ? 0 : averageSalary);

		return "dashboard";
	}
}

