package com.example.ems.security;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.ems.model.AppRole;
import com.example.ems.model.AppUser;
import com.example.ems.repository.AppUserRepository;

@Component
public class DataInitializer implements CommandLineRunner {
	private final AppUserRepository appUserRepository;
	private final PasswordEncoder passwordEncoder;

	public DataInitializer(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
		this.appUserRepository = appUserRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) {
		appUserRepository.findByUsername("admin").ifPresentOrElse(
				user -> {
					if (user.getRole() != AppRole.ADMIN) {
						user.setRole(AppRole.ADMIN);
						appUserRepository.save(user);
						System.out.println("DEBUG: Forced 'admin' user to ADMIN role.");
					}
				},
				() -> {
					AppUser admin = new AppUser("admin", passwordEncoder.encode("admin123"), AppRole.ADMIN);
					appUserRepository.save(admin);
					System.out.println("DEBUG: Created default 'admin' user with ADMIN role.");
				});
	}
}

