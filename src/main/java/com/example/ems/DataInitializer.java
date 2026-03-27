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
    private final com.example.ems.repository.EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AppUserRepository appUserRepository, 
                           com.example.ems.repository.EmployeeRepository employeeRepository,
                           PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Cleanup old insecure 'admin' account if it exists
        if (appUserRepository.existsByUsername("admin")) {
            appUserRepository.findByUsername("admin").ifPresent(oldUser -> {
                appUserRepository.delete(oldUser);
                System.out.println("Cleaned up old 'admin' account.");
            });
        }

        // 2. Ensure the new secure 'ems_admin' exists
        if (!appUserRepository.existsByUsername("ems_admin")) {
            AppUser adminUser = new AppUser();
            adminUser.setUsername("ems_admin");
            adminUser.setPasswordHash(passwordEncoder.encode("Admin@EMS2026"));
            adminUser.setRole(AppRole.ADMIN);
            
            // 3. Create a test employee if none exist
            if (employeeRepository.count() == 0) {
                com.example.ems.model.Employee adminEmp = new com.example.ems.model.Employee();
                adminEmp.setFirstName("System");
                adminEmp.setLastName("Administrator");
                adminEmp.setEmail("admin@ems.com");
                adminEmp.setDepartment("IT");
                adminEmp.setSalary(java.math.BigDecimal.valueOf(99999));
                adminEmp.setPhone("123-456-7890");
                adminEmp.setJoiningDate(java.time.LocalDate.now());
                employeeRepository.save(adminEmp);
                adminUser.setEmployee(adminEmp);
                System.out.println("Sample employee created for ems_admin.");
            }
            
            appUserRepository.save(adminUser);
            System.out.println("New secure admin user created: ems_admin / Admin@EMS2026");
        } else {
            // Enforcement: Ensure ems_admin always has ADMIN role
            appUserRepository.findByUsername("ems_admin").ifPresent(user -> {
                if (user.getRole() != AppRole.ADMIN) {
                    user.setRole(AppRole.ADMIN);
                    appUserRepository.save(user);
                    System.out.println("Enforced ADMIN role for ems_admin.");
                }
            });
        }
    }
}
