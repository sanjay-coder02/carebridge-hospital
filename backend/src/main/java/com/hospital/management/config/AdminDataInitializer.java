
package com.hospital.management.config;

import com.hospital.management.model.Admin;
import com.hospital.management.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataInitializer {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CommandLineRunner createDefaultAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            @Value("${carebridge.admin.username:admin}")
            String username,
            @Value("${carebridge.admin.password:admin123}")
            String password) {

        return args -> {

            if (adminRepository.count() == 0) {

                Admin admin = new Admin();

                admin.setUsername(username);
                admin.setPassword(
                        passwordEncoder.encode(password)
                );

                adminRepository.save(admin);
            }
        };
    }
}