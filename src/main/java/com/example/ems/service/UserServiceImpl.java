package com.example.ems.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.ems.model.AppRole;
import com.example.ems.model.AppUser;
import com.example.ems.repository.AppUserRepository;

@Service
public class UserServiceImpl implements UserService {
	private final AppUserRepository appUserRepository;
	private final PasswordEncoder passwordEncoder;

	public UserServiceImpl(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
		this.appUserRepository = appUserRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public AppUser registerEmployeeUser(String username, String rawPassword) {
		String normalized = username == null ? null : username.trim().toLowerCase();
		if (normalized == null || normalized.isBlank()) {
			throw new IllegalArgumentException("Username is required");
		}
		if (rawPassword == null || rawPassword.isBlank()) {
			throw new IllegalArgumentException("Password is required");
		}
		if (appUserRepository.existsByUsername(normalized)) {
			throw new IllegalArgumentException("Username already exists");
		}

		AppUser user = new AppUser();
		user.setUsername(normalized);
		user.setPasswordHash(passwordEncoder.encode(rawPassword));
		user.setRole(AppRole.EMPLOYEE);
		return appUserRepository.save(user);
	}
}

