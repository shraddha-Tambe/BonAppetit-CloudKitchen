package com.kitchencloud.backend.config;

import com.kitchencloud.backend.model.User;
import com.kitchencloud.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@kitchencloud.com").isEmpty()) {
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@kitchencloud.com");
            admin.setPhone("0000000000");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setAddress("Admin HQ");
            admin.setRole("ADMIN");

            userRepository.save(admin);
            System.out.println("Default Admin user created: admin@kitchencloud.com / admin123");
        }

        // Ensure admin@example.com is also an admin if it exists or create it
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            User keyAdmin = new User();
            keyAdmin.setFullName("Key Admin");
            keyAdmin.setEmail("admin@example.com");
            keyAdmin.setPhone("9999999999");
            keyAdmin.setPassword(passwordEncoder.encode("admin123")); // Default password
            keyAdmin.setAddress("Admin HQ");
            keyAdmin.setRole("ADMIN");
            userRepository.save(keyAdmin);
            System.out.println("Key Admin user created: admin@example.com / admin123");
        } else {
            User existingUser = userRepository.findByEmail("admin@example.com").get();
            if (!"ADMIN".equals(existingUser.getRole())) {
                existingUser.setRole("ADMIN");
                userRepository.save(existingUser);
                System.out.println("Updated admin@example.com role to ADMIN");
            }
        }
    }
}
