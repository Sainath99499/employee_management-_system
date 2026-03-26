package com.example.ems.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.example.ems.model.Employee;
import com.example.ems.service.CurrentUserService;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/v1/me")
public class MeRestController {

    @Autowired
    private CurrentUserService currentUserService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_EMPLOYEE");

        Map<String, Object> result = new HashMap<>();
        result.put("username", username);
        result.put("role", role); // e.g. ROLE_ADMIN or ROLE_EMPLOYEE

        // If employee role, include their employee ID so frontend can redirect to profile
        if ("ROLE_EMPLOYEE".equals(role)) {
            currentUserService.getLinkedEmployee(username)
                    .map(Employee::getId)
                    .ifPresent(id -> result.put("employeeId", id));
        }

        return ResponseEntity.ok(result);
    }
}
