// backend/src/main/java/com/hospital/management/api/AppointmentRequest.java

package com.hospital.management.api;

public record AppointmentRequest(

        Long patientId,

        Long doctorId,

        String appointmentDate,

        String appointmentTime,

        String reason,

        String diagnosis

) {

}