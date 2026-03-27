package com.example.ems.controller;

import java.util.HashMap;
import java.util.List;
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
        
        // Detailed logging of all authorities
        System.out.println("DEBUG: Fetching roles for user: " + username);
        authentication.getAuthorities().forEach(a -> System.out.println("DEBUG: Found authority: " + a.getAuthority()));

        // Extract the role from authorities (prioritizing ROLE_ADMIN)
        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        
        String role = "ROLE_EMPLOYEE";
        if ("ems_admin".equals(username) || authorities.contains("ROLE_ADMIN") || authorities.contains("ADMIN")) {
            role = "ROLE_ADMIN";
        } else if (authorities.contains("ROLE_EMPLOYEE") || authorities.contains("EMPLOYEE")) {
            role = "ROLE_EMPLOYEE";
        } else if (!authorities.isEmpty()) {
            role = authorities.get(0);
        }

        System.out.println("DEBUG: Final role assigned: " + role);

        Map<String, Object> result = new HashMap<>();
        result.put("username", username);
        result.put("role", role); 

        // If employee role, include their employee ID so frontend can redirect to profile
        if ("ROLE_EMPLOYEE".equals(role)) {
            currentUserService.getLinkedEmployee(username)
                    .map(Employee::getId)
                    .ifPresent(id -> result.put("employeeId", id));
        }

        return ResponseEntity.ok(result);
    }
}
