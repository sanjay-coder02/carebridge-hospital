package com.hospital.management.controller;

import com.hospital.management.api.MedicalRecordRequest;
import com.hospital.management.model.Appointment;
import com.hospital.management.model.MedicalRecord;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordRestController {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    public MedicalRecordRestController(
            MedicalRecordRepository medicalRecordRepository,
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository) {

        this.medicalRecordRepository = medicalRecordRepository;
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(
            @PathVariable Long id) {

        return medicalRecordRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public ResponseEntity<?> createMedicalRecord(
            @RequestBody MedicalRecordRequest request) {

        if (request.appointmentId() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Appointment ID is required.");
        }

        Appointment appointment = appointmentRepository
                .findById(request.appointmentId())
                .orElse(null);

        if (appointment == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Appointment not found.");
        }

        if (!"COMPLETED".equalsIgnoreCase(
                appointment.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "A medical report can only be generated "
                            + "for a completed consultation."
                    );
        }

        if (medicalRecordRepository
                .findByAppointmentId(request.appointmentId())
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "A medical report already exists "
                            + "for this consultation."
                    );
        }

        MedicalRecord medicalRecord =
                new MedicalRecord();

        medicalRecord.setAppointment(appointment);
        medicalRecord.setDiagnosis(request.diagnosis());
        medicalRecord.setTreatment(request.treatment());
        medicalRecord.setNotes(request.notes());

        MedicalRecord savedRecord =
                medicalRecordRepository.save(medicalRecord);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedRecord);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicalRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecordRequest request) {

        MedicalRecord medicalRecord =
                medicalRecordRepository
                        .findById(id)
                        .orElse(null);

        if (medicalRecord == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.diagnosis() != null) {
            medicalRecord.setDiagnosis(
                    request.diagnosis()
            );
        }

        if (request.treatment() != null) {
            medicalRecord.setTreatment(
                    request.treatment()
            );
        }

        if (request.notes() != null) {
            medicalRecord.setNotes(
                    request.notes()
            );
        }

        return ResponseEntity.ok(
                medicalRecordRepository.save(
                        medicalRecord
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(
            @PathVariable Long id) {

        if (!medicalRecordRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        medicalRecordRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{phone}")
    public ResponseEntity<?> getPatientConsultationHistory(
            @PathVariable String phone) {

        if (phone == null || phone.trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Phone number is required.");
        }

        List<Patient> patients =
                patientRepository.findAllByPhone(
                        phone.trim()
                );

        if (patients.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "No patient found with this "
                            + "registered phone number."
                    );
        }

        Patient primaryPatient = patients.get(0);

        List<Map<String, Object>> consultations =
                new ArrayList<>();

        for (Patient patient : patients) {

            List<Appointment> appointments =
                    appointmentRepository
                            .findByPatientIdAndStatus(
                                    patient.getId(),
                                    "COMPLETED"
                            );

            for (Appointment appointment : appointments) {

                Map<String, Object> consultation =
                        new HashMap<>();

                consultation.put(
                        "appointmentId",
                        appointment.getId()
                );

                consultation.put(
                        "patientId",
                        patient.getId()
                );

                consultation.put(
                        "patientName",
                        patient.getName()
                );

                consultation.put(
                        "doctor",
                        appointment.getDoctor()
                );

                consultation.put(
                        "appointmentDate",
                        appointment.getAppointmentDate()
                );

                consultation.put(
                        "appointmentTime",
                        appointment.getAppointmentTime()
                );

                consultation.put(
                        "reason",
                        appointment.getReason()
                );

                consultation.put(
                        "status",
                        appointment.getStatus()
                );

                MedicalRecord medicalRecord =
                        medicalRecordRepository
                                .findByAppointmentId(
                                        appointment.getId()
                                )
                                .orElse(null);

                consultation.put(
                        "reportGenerated",
                        medicalRecord != null
                );

                consultation.put(
                        "medicalRecord",
                        medicalRecord
                );

                consultations.add(consultation);
            }
        }

        Map<String, Object> response =
                new HashMap<>();

        response.put("patient", primaryPatient);
        response.put(
                "matchingPatients",
                patients
        );
        response.put(
                "consultations",
                consultations
        );

        return ResponseEntity.ok(response);
    }
}