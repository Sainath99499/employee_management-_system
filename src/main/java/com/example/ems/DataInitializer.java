package com.example.ems;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.ems.model.AppRole;
import com.example.ems.model.AppUser;
import com.example.ems.repository.AppUserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user exists
        if (!appUserRepository.existsByUsername("admin")) {
            AppUser adminUser = new AppUser();
            adminUser.setUsername("admin");
            adminUser.setPasswordHash(passwordEncoder.encode("admin123"));
            adminUser.setRole(AppRole.ADMIN);
            appUserRepository.save(adminUser);
            System.out.println("Default admin user created: admin / admin123");
        }
    }
}
