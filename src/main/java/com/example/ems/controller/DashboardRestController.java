package com.example.ems.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.ems.model.Employee;
import com.example.ems.repository.EmployeeRepository;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardRestController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public Map<String, Object> getDashboardStats() {
        List<Employee> employees = employeeRepository.findAll();

        long totalEmployees = employees.size();

        Map<String, Long> employeesPerDept = employees.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment() != null ? e.getDepartment() : "Unassigned",
                        Collectors.counting()));

        double averageSalary = employees.stream()
                .filter(e -> e.getSalary() != null)
                .mapToDouble(e -> e.getSalary().doubleValue())
                .average()
                .orElse(0.0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEmployees", totalEmployees);
        stats.put("averageSalary", averageSalary);
        stats.put("employeesPerDept", employeesPerDept);

        return stats;
    }
}
