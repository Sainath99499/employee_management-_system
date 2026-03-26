package com.example.ems.service;

import com.example.ems.model.AppUser;

public interface UserService {
	AppUser registerUser(String username, String rawPassword, String role);
}

