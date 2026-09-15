
package com.hospital.management.repository;

import com.hospital.management.model.Patient;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientRepository
        extends JpaRepository<Patient, Long> {

    Optional<Patient> findByPhone(String phone);

    List<Patient> findAllByPhone(String phone);
}