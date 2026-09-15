package com.hospital.management.api;

public record PatientRecordsRequest(
        Long appointmentId,
        String phone
) {
}