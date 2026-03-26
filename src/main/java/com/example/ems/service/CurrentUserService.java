package com.example.ems.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.ems.model.AppUser;
import com.example.ems.model.Employee;
import com.example.ems.repository.AppUserRepository;

@Service
public class CurrentUserService {
	private final AppUserRepository appUserRepository;

	public CurrentUserService(AppUserRepository appUserRepository) {
		this.appUserRepository = appUserRepository;
	}

	public Optional<Employee> getLinkedEmployee(String username) {
		return appUserRepository.findByUsername(username).map(AppUser::getEmployee);
	}

	public boolean canAccessEmployee(String username, long employeeId) {
		return getLinkedEmployee(username)
				.map(e -> e != null && e.getId() == employeeId)
				.orElse(false);
	}
}

