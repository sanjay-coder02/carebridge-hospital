package com.hospital.management.api;

public record DoctorRequest(
        String name,
        String specialization,
        String phone,
        String email,
        String location,
        String description
) {
}