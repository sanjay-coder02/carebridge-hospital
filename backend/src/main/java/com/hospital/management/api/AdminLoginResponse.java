package com.hospital.management.api;

public record AdminLoginResponse(
        boolean success,
        String message
) {
}