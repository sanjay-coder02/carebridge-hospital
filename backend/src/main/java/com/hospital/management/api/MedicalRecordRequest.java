// backend/src/main/java/com/hospital/management/api/MedicalRecordRequest.java

package com.hospital.management.api;

public record MedicalRecordRequest(
        Long appointmentId,
        String diagnosis,
        String treatment,
        String notes
) {
}