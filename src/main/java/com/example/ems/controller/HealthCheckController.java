package com.example.ems.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthCheckController {

    @GetMapping("/")
    public Map<String, String> healthCheck() {
        return Map.of(
            "status", "UP",
            "message", "Employee Management System Backend is running!",
            "version", "1.1.0"
        );
    }
}
