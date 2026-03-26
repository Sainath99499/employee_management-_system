package com.example.ems.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.example.ems.model.Attendance;
import com.example.ems.model.Employee;
import com.example.ems.service.AttendanceService;
import com.example.ems.service.CurrentUserService;
import com.example.ems.service.EmployeeService;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/employees/{id}/attendance")
public class AttendanceRestController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private CurrentUserService currentUserService;

    @GetMapping
    public ResponseEntity<List<Attendance>> getAttendance(
            @PathVariable long id,
            Authentication authentication) {
        if (!isAdmin(authentication) && !currentUserService.canAccessEmployee(authentication.getName(), id)) {
            return ResponseEntity.status(403).build();
        }
        Employee employee = employeeService.getEmployeeById(id);
        List<Attendance> records = attendanceService.getAttendanceForEmployee(employee);
        return ResponseEntity.ok(records);
    }

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(
            @PathVariable long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        if (!isAdmin(authentication) && !currentUserService.canAccessEmployee(authentication.getName(), id)) {
            return ResponseEntity.status(403).build();
        }
        Employee employee = employeeService.getEmployeeById(id);
        String status = body.get("status");
        Attendance record = attendanceService.markAttendance(employee, LocalDate.now(), status);
        return ResponseEntity.ok(record);
    }

    private boolean isAdmin(Authentication authentication) {
        if (authentication == null) return false;
        for (GrantedAuthority a : authentication.getAuthorities()) {
            if ("ROLE_ADMIN".equals(a.getAuthority())) return true;
        }
        return false;
    }
}
