package com.hospital.management.controller;

import com.hospital.management.api.AppointmentRequest;
import com.hospital.management.api.CancelAppointmentRequest;
import com.hospital.management.api.CompletionRequest;
import com.hospital.management.api.DiagnosisRequest;
import com.hospital.management.model.Appointment;
import com.hospital.management.model.Doctor;
import com.hospital.management.model.Patient;
import com.hospital.management.model.MedicalRecord;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.MedicalRecordRepository;

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
@RequestMapping("/api/appointments")
public class AppointmentRestController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    public AppointmentRestController(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            MedicalRecordRepository medicalRecordRepository) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.medicalRecordRepository = medicalRecordRepository;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(
            @PathVariable Long id) {

        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(
            @RequestBody AppointmentRequest request) {

        if (request.patientId() == null
                || request.doctorId() == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Patient ID and Doctor ID are required."
                    );
        }

        Patient patient = patientRepository
                .findById(request.patientId())
                .orElse(null);

        if (patient == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Patient not found.");
        }

        Doctor doctor = doctorRepository
                .findById(request.doctorId())
                .orElse(null);

        if (doctor == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Doctor not found.");
        }

        Appointment appointment = new Appointment();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        appointment.setAppointmentDate(
                request.appointmentDate()
        );

        appointment.setAppointmentTime(
                request.appointmentTime()
        );

        appointment.setReason(
                request.reason()
        );

        appointment.setDiagnosis(
                request.diagnosis()
        );

        appointment.setStatus("PENDING");

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedAppointment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentRequest request) {

        Appointment appointment = appointmentRepository
                .findById(id)
                .orElse(null);

        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        Patient patient = patientRepository
                .findById(request.patientId())
                .orElse(null);

        if (patient == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Patient not found.");
        }

        Doctor doctor = doctorRepository
                .findById(request.doctorId())
                .orElse(null);

        if (doctor == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Doctor not found.");
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        appointment.setAppointmentDate(
                request.appointmentDate()
        );

        appointment.setAppointmentTime(
                request.appointmentTime()
        );

        appointment.setReason(
                request.reason()
        );

        appointment.setDiagnosis(
                request.diagnosis()
        );

        return ResponseEntity.ok(
                appointmentRepository.save(appointment)
        );
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmAppointment(
            @PathVariable Long id) {

        Appointment appointment = appointmentRepository
                .findById(id)
                .orElse(null);

        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        if ("CANCELLED".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "A cancelled appointment cannot "
                            + "be confirmed."
                    );
        }

        if ("COMPLETED".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "A completed consultation cannot "
                            + "be confirmed again."
                    );
        }

        appointment.setStatus("CONFIRMED");

        return ResponseEntity.ok(
                appointmentRepository.save(appointment)
        );
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(
            @PathVariable Long id,
            @RequestBody CompletionRequest request) {

        Appointment appointment = appointmentRepository
                .findById(id)
                .orElse(null);

        if (appointment == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Appointment not found.");
        }

        if (request == null
                || request.diagnosis() == null
                || request.diagnosis().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Diagnosis is required.");
        }

        if ("CANCELLED".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "A cancelled appointment cannot "
                            + "be marked as completed."
                    );
        }

        if ("COMPLETED".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "This consultation is already completed."
                    );
        }

        if (!"CONFIRMED".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Only confirmed appointments can "
                            + "be marked as completed."
                    );
        }

        appointment.setDiagnosis(
                request.diagnosis().trim()
        );

        appointment.setStatus("COMPLETED");

        return ResponseEntity.ok(
                appointmentRepository.save(appointment)
        );
    }

    @PutMapping("/{id}/diagnosis")
    public ResponseEntity<?> updateDiagnosis(
            @PathVariable Long id,
            @RequestBody DiagnosisRequest request) {

        Appointment appointment = appointmentRepository
                .findById(id)
                .orElse(null);

        if (appointment == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Appointment not found.");
        }

        if (!"COMPLETED".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Diagnosis can only be edited for "
                            + "completed consultations."
                    );
        }

        if (request == null
                || request.diagnosis() == null
                || request.diagnosis().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Diagnosis is required.");
        }

        String updatedDiagnosis =
                request.diagnosis().trim();

        appointment.setDiagnosis(updatedDiagnosis);

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        MedicalRecord medicalRecord =
                medicalRecordRepository
                        .findByAppointmentId(id)
                        .orElse(null);

        if (medicalRecord != null) {
            medicalRecord.setDiagnosis(updatedDiagnosis);
            medicalRecordRepository.save(medicalRecord);
        }

        return ResponseEntity.ok(savedAppointment);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable Long id) {

        Appointment appointment = appointmentRepository
                .findById(id)
                .orElse(null);

        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        if ("COMPLETED".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "A completed consultation cannot "
                            + "be cancelled."
                    );
        }

        appointment.setStatus("CANCELLED");

        return ResponseEntity.ok(
                appointmentRepository.save(appointment)
        );
    }

    @PostMapping("/{id}/cancel-public")
    public ResponseEntity<?> cancelAppointmentPublic(
            @PathVariable Long id,
            @RequestBody CancelAppointmentRequest request) {

        if (request.phone() == null
                || request.phone().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Phone number is required.");
        }

        Appointment appointment = appointmentRepository
                .findById(id)
                .orElse(null);

        if (appointment == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Appointment not found.");
        }

        if (appointment.getPatient() == null) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "Patient information is unavailable."
                    );
        }

        String registeredPhone =
                appointment.getPatient().getPhone();

        if (registeredPhone == null
                || !registeredPhone.trim().equals(
                        request.phone().trim())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "The phone number does not match "
                            + "the appointment."
                    );
        }

        if ("CANCELLED".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "This appointment is already cancelled."
                    );
        }

        if ("COMPLETED".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "A completed consultation cannot "
                            + "be cancelled."
                    );
        }

        appointment.setStatus("CANCELLED");

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        return ResponseEntity.ok(savedAppointment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(
            @PathVariable Long id) {

        if (!appointmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        appointmentRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}