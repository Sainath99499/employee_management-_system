package com.example.ems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ems.service.UserService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthRestController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String confirmPassword) {
        
        if (password == null || !password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        try {
            userService.registerEmployeeUser(username, password);
            return ResponseEntity.ok().body("User registered successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Registration failed");
        }
    }
}
