package com.example.ems;

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
    public void run(String... args) throws Exception {
        if (!appUserRepository.existsByUsername("admin")) {
            AppUser adminUser = new AppUser();
            adminUser.setUsername("admin");
            adminUser.setPasswordHash(passwordEncoder.encode("admin123"));
            adminUser.setRole(AppRole.ADMIN);
            appUserRepository.save(adminUser);
            System.out.println("Default admin user created: admin / admin123");
        } else {
            // Ensure existing admin user has ADMIN role
            appUserRepository.findByUsername("admin").ifPresent(user -> {
                if (user.getRole() != AppRole.ADMIN) {
                    user.setRole(AppRole.ADMIN);
                    appUserRepository.save(user);
                    System.out.println("Updated existing admin user to have ADMIN role.");
                }
            });
        }
    }
}
