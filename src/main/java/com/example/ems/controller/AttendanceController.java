package com.example.ems.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import com.example.ems.model.Attendance;
import com.example.ems.model.Employee;
import com.example.ems.service.AttendanceService;
import com.example.ems.service.CurrentUserService;
import com.example.ems.service.EmployeeService;

@Controller
public class AttendanceController {

	@Autowired
	private AttendanceService attendanceService;

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private CurrentUserService currentUserService;

	@GetMapping("/employees/{id}/attendance")
	public String viewAttendance(@PathVariable("id") long id,
			@RequestParam(required = false) String start,
			@RequestParam(required = false) String end,
			Model model,
			Authentication authentication) {
		if (!isAdmin(authentication) && !currentUserService.canAccessEmployee(authentication.getName(), id)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}
		Employee employee = employeeService.getEmployeeById(id);
		List<Attendance> records;
		if (start != null && end != null) {
			LocalDate startDate = LocalDate.parse(start);
			LocalDate endDate = LocalDate.parse(end);
			records = attendanceService.getAttendanceForEmployeeBetween(employee, startDate, endDate);
		} else {
			records = attendanceService.getAttendanceForEmployee(employee);
		}
		model.addAttribute("employee", employee);
		model.addAttribute("attendanceRecords", records);
		return "attendance";
	}

	@PostMapping("/employees/{id}/attendance")
	public String markAttendance(@PathVariable("id") long id,
			@RequestParam String status,
			Authentication authentication) {
		if (!isAdmin(authentication) && !currentUserService.canAccessEmployee(authentication.getName(), id)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN);
		}
		Employee employee = employeeService.getEmployeeById(id);
		attendanceService.markAttendance(employee, LocalDate.now(), status);
		return "redirect:/employees/" + id + "/attendance";
	}

	private boolean isAdmin(Authentication authentication) {
		if (authentication == null) return false;
		for (GrantedAuthority a : authentication.getAuthorities()) {
			if ("ROLE_ADMIN".equals(a.getAuthority())) {
				return true;
			}
		}
		return false;
	}
}

