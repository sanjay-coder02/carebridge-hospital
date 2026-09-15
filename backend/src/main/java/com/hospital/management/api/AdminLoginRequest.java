package com.hospital.management.api;

public record AdminLoginRequest(
        String username,
        String password
) {
}