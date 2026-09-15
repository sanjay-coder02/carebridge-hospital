package com.hospital.management.api;

public record PatientRequest(
        String name,
        int age,
        String gender,
        String phone,
        String email,
        String location,
        String bloodGroup
) {
}