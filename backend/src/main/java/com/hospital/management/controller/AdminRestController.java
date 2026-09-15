
package com.hospital.management.controller;

import com.hospital.management.api.AdminLoginRequest;
import com.hospital.management.api.AdminLoginResponse;
import com.hospital.management.model.Admin;
import com.hospital.management.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminRestController(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(
            @RequestBody AdminLoginRequest request) {

        if (request.username() == null
                || request.username().isBlank()
                || request.password() == null
                || request.password().isBlank()) {

            return ResponseEntity.badRequest().body(
                    new AdminLoginResponse(
                            false,
                            "Username and password are required."
                    )
            );
        }

        Admin admin = adminRepository
                .findByUsername(request.username().trim())
                .orElse(null);

        if (admin == null
                || !passwordEncoder.matches(
                        request.password(),
                        admin.getPassword())) {

            return ResponseEntity.status(401).body(
                    new AdminLoginResponse(
                            false,
                            "Invalid username or password."
                    )
            );
        }

        return ResponseEntity.ok(
                new AdminLoginResponse(
                        true,
                        "Login successful."
                )
        );
    }
}
