package com.example.ems.service;

import com.example.ems.model.AppUser;

public interface UserService {
	AppUser registerEmployeeUser(String username, String rawPassword);
}

