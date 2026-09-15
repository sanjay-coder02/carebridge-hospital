
package com.hospital.management.controller;

import com.hospital.management.model.MedicalRecord;
import com.hospital.management.repository.MedicalRecordRepository;
import com.hospital.management.repository.PatientRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class MedicalRecordController {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;

    public MedicalRecordController(
            MedicalRecordRepository medicalRecordRepository,
            PatientRepository patientRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping("/medical-records")
    public String medicalRecords(Model model) {
        model.addAttribute(
                "medicalRecords",
                medicalRecordRepository.findAll()
        );

        return "medical-records";
    }

    @GetMapping("/medical-records/new")
    public String showMedicalRecordForm(Model model) {
        model.addAttribute(
                "medicalRecord",
                new MedicalRecord()
        );

        model.addAttribute(
                "patients",
                patientRepository.findAll()
        );

        return "medical-record-form";
    }

    @PostMapping("/medical-records")
    public String saveMedicalRecord(MedicalRecord medicalRecord) {
        medicalRecordRepository.save(medicalRecord);

        return "redirect:/medical-records";
    }

    @GetMapping("/medical-records/delete/{id}")
    public String deleteMedicalRecord(@PathVariable Long id) {
        medicalRecordRepository.deleteById(id);

        return "redirect:/medical-records";
    }
}