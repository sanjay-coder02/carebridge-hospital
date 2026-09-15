package com.hospital.management.repository;

import com.hospital.management.model.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByStatus(String status);

    List<Appointment> findByPatientIdAndStatus(
            Long patientId,
            String status
    );

    List<Appointment> findByPatientPhone(String phone);
}