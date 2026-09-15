
package com.hospital.management.controller;

import com.hospital.management.api.PatientRequest;
import com.hospital.management.model.Patient;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.MedicalRecordRepository;
import com.hospital.management.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientRestController {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public PatientRestController(
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository,
            MedicalRecordRepository medicalRecordRepository) {

        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalRecordRepository = medicalRecordRepository;
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable Long id) {

        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(
            @RequestBody PatientRequest request) {

        Patient patient = patientRepository
                .findByPhone(request.phone())
                .orElseGet(Patient::new);

        patient.setName(request.name());
        patient.setAge(request.age());
        patient.setGender(request.gender());
        patient.setPhone(request.phone());
        patient.setEmail(request.email());
        patient.setLocation(request.location());
        patient.setBloodGroup(request.bloodGroup());

        Patient savedPatient = patientRepository.save(patient);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedPatient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @RequestBody PatientRequest request) {

        return patientRepository.findById(id)
                .map(patient -> {
                    patient.setName(request.name());
                    patient.setAge(request.age());
                    patient.setGender(request.gender());
                    patient.setPhone(request.phone());
                    patient.setEmail(request.email());
                    patient.setLocation(request.location());
                    patient.setBloodGroup(request.bloodGroup());

                    return ResponseEntity.ok(
                            patientRepository.save(patient)
                    );
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(
            @PathVariable Long id) {

        if (!patientRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        boolean hasAppointments =
                !appointmentRepository
                        .findByPatientId(id)
                        .isEmpty();

        boolean hasMedicalRecords =
                medicalRecordRepository
                        .existsByAppointmentPatientId(id);

        if (hasAppointments || hasMedicalRecords) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            "Patient cannot be deleted because "
                            + "they have existing appointments "
                            + "or medical records."
                    );
        }

        patientRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}