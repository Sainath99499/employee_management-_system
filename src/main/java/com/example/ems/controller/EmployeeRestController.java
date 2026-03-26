package com.example.ems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ems.model.Employee;
import com.example.ems.service.EmployeeService;

@CrossOrigin("*") // Allow requests from React or other frontends
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeRestController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public Page<Employee> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return employeeService.findPaginated(pageable);
    }

    @GetMapping("/search")
    public List<Employee> searchEmployees(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) Double maxSalary) {
        return employeeService.searchWithFilters(name, department, minSalary, maxSalary);
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        employeeService.saveEmployee(employee);
        return new ResponseEntity<>(employee, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable("id") long employeeId) {
        Employee employee = employeeService.getEmployeeById(employeeId);
        return ResponseEntity.ok(employee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable("id") long id, @RequestBody Employee employeeDetails) {
        Employee updateEmployee = employeeService.getEmployeeById(id);

        updateEmployee.setFirstName(employeeDetails.getFirstName());
        updateEmployee.setLastName(employeeDetails.getLastName());
        updateEmployee.setEmail(employeeDetails.getEmail());
        updateEmployee.setPhone(employeeDetails.getPhone());
        updateEmployee.setAddress(employeeDetails.getAddress());
        updateEmployee.setDepartment(employeeDetails.getDepartment());
        updateEmployee.setJoiningDate(employeeDetails.getJoiningDate());
        updateEmployee.setProfileImage(employeeDetails.getProfileImage());
        updateEmployee.setSalary(employeeDetails.getSalary());

        employeeService.saveEmployee(updateEmployee);
        return ResponseEntity.ok(updateEmployee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable("id") long employeeId) {
        employeeService.deleteEmployeeById(employeeId);
        return ResponseEntity.ok("Employee deleted successfully!");
    }
}
