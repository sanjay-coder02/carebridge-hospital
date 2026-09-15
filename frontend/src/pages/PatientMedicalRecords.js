// frontend/src/pages/PatientMedicalRecords.js

import { useRef, useState } from "react";
import {
    Alert,
    Button,
    Col,
    Container,
    Form,
    Row
} from "react-bootstrap";
import "./PatientMedicalRecords.css";

const API_URL =
    `${process.env.REACT_APP_API_URL || "http://localhost:8082/api"}/medical-records/patient`;

function PatientMedicalRecords() {
    const [phone, setPhone] = useState("");
    const [patient, setPatient] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] =
        useState("");

    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const resultsRef = useRef(null);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setPatient(null);
        setConsultations([]);
        setSelectedAppointmentId("");
        setSearched(false);
        setLoading(true);

        try {
            const trimmedPhone = phone.trim();

            if (!trimmedPhone) {
                throw new Error(
                    "Please enter your registered mobile number."
                );
            }

            const response = await fetch(
                `${API_URL}/${encodeURIComponent(trimmedPhone)}`
            );

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(
                    responseText ||
                    "Unable to retrieve medical records."
                );
            }

            const data = JSON.parse(responseText);

            setPatient(data.patient || null);
            setConsultations(data.consultations || []);
            setSearched(true);

            setTimeout(() => {
                resultsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 100);
        } catch (recordsError) {
            setError(
                recordsError.message ||
                "Unable to retrieve medical records."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleClear() {
        setPhone("");
        setPatient(null);
        setConsultations([]);
        setSelectedAppointmentId("");
        setError("");
        setSearched(false);
    }

    function handleConsultationChange(event) {
        setSelectedAppointmentId(event.target.value);
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "Date unavailable";
        }

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    }

    const selectedConsultation =
        consultations.find(
            (consultation) =>
                String(consultation.appointmentId) ===
                String(selectedAppointmentId)
        ) || null;

    const selectedReport =
        selectedConsultation?.medicalRecord || null;

    return (
        <main className="patient-records-page">
            <section className="patient-records-header">
                <Container>
                    <div className="patient-records-header-content">
                        <span>
                            CAREBRIDGE PATIENT SERVICES
                        </span>

                        <h1>
                            Medical Records
                        </h1>

                        <p>
                            Securely access your completed
                            consultation history and medical reports.
                        </p>
                    </div>
                </Container>
            </section>

            <section className="patient-records-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col
                            xs={12}
                            md={10}
                            lg={8}
                            xl={7}
                        >
                            <div className="patient-records-card">
                                <div className="patient-records-card-heading">
                                    <div className="patient-records-icon">
                                        +
                                    </div>

                                    <div>
                                        <span>
                                            SECURE RECORD ACCESS
                                        </span>

                                        <h2>
                                            View Your Medical Records
                                        </h2>
                                    </div>
                                </div>

                                <p className="patient-records-description">
                                    Enter your registered mobile
                                    number to view your completed
                                    consultations and available
                                    medical reports.
                                </p>

                                {error && (
                                    <Alert
                                        variant="danger"
                                        className="patient-records-alert"
                                    >
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group
                                        controlId="patientPhone"
                                        className="mb-3"
                                    >
                                        <Form.Label>
                                            Registered Mobile Number
                                        </Form.Label>

                                        <Form.Control
                                            type="tel"
                                            value={phone}
                                            onChange={(event) =>
                                                setPhone(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter your registered mobile number"
                                            required
                                        />
                                    </Form.Group>

                                    <div className="patient-records-form-actions">
                                        <Button
                                            type="submit"
                                            className="patient-records-submit-button"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Finding Records..."
                                                : "Find My Records"}
                                        </Button>

                                        {(searched || error) && (
                                            <Button
                                                type="button"
                                                className="patient-records-clear-button"
                                                onClick={handleClear}
                                                disabled={loading}
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>

                    {searched && patient && (
                        <Row className="justify-content-center">
                            <Col
                                xs={12}
                                lg={10}
                                xl={9}
                            >
                                <div
                                    ref={resultsRef}
                                    className="patient-records-results"
                                >
                                    <div className="patient-report-header">
                                        <div>
                                            <span>
                                                CAREBRIDGE HOSPITAL
                                            </span>

                                            <h2>
                                                Patient Medical Records
                                            </h2>
                                        </div>

                                        <div className="patient-report-count">
                                            {consultations.length}
                                        </div>
                                    </div>

                                    <div className="patient-information">
                                        <div>
                                            <span>
                                                Patient Name
                                            </span>

                                            <strong>
                                                {patient.name}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Patient ID
                                            </span>

                                            <strong>
                                                #{patient.id}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Mobile Number
                                            </span>

                                            <strong>
                                                {patient.phone}
                                            </strong>
                                        </div>
                                    </div>

                                    {consultations.length === 0 ? (
                                        <div className="patient-records-empty">
                                            <h3>
                                                No Completed Consultations
                                            </h3>

                                            <p>
                                                There are currently
                                                no completed
                                                consultations
                                                available for this
                                                mobile number.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="patient-consultation-selector">
                                                <Form.Group
                                                    controlId="consultationDate"
                                                >
                                                    <Form.Label>
                                                        Select Consultation Date
                                                    </Form.Label>

                                                    <Form.Select
                                                        value={
                                                            selectedAppointmentId
                                                        }
                                                        onChange={
                                                            handleConsultationChange
                                                        }
                                                    >
                                                        <option value="">
                                                            Select a consultation date
                                                        </option>

                                                        {consultations.map(
                                                            (
                                                                consultation
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        consultation.appointmentId
                                                                    }
                                                                    value={
                                                                        consultation.appointmentId
                                                                    }
                                                                >
                                                                    {formatDate(
                                                                        consultation.appointmentDate
                                                                    )}
                                                                    {" — "}
                                                                    Appointment #
                                                                    {
                                                                        consultation.appointmentId
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>

                                            {!selectedConsultation && (
                                                <div className="patient-records-empty">
                                                    <h3>
                                                        Select a Consultation
                                                    </h3>

                                                    <p>
                                                        Choose a
                                                        consultation
                                                        date above to
                                                        view its
                                                        medical report.
                                                    </p>
                                                </div>
                                            )}

                                            {selectedConsultation &&
                                                !selectedConsultation.reportGenerated && (
                                                    <div className="patient-report-processing">
                                                        <div className="patient-report-processing-icon">
                                                            ...
                                                        </div>

                                                        <h3>
                                                            Medical Report Under Process
                                                        </h3>

                                                        <p>
                                                            Your
                                                            consultation
                                                            has been
                                                            completed.
                                                            Your medical
                                                            report is
                                                            currently
                                                            being
                                                            prepared by
                                                            the hospital
                                                            administration.
                                                        </p>

                                                        <div className="patient-consultation-summary">
                                                            <div>
                                                                <span>
                                                                    Appointment
                                                                </span>

                                                                <strong>
                                                                    #
                                                                    {
                                                                        selectedConsultation.appointmentId
                                                                    }
                                                                </strong>
                                                            </div>

                                                            <div>
                                                                <span>
                                                                    Doctor
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        selectedConsultation
                                                                            .doctor
                                                                            ?.name
                                                                    }
                                                                </strong>
                                                            </div>

                                                            <div>
                                                                <span>
                                                                    Consultation
                                                                    Date
                                                                </span>

                                                                <strong>
                                                                    {formatDate(
                                                                        selectedConsultation.appointmentDate
                                                                    )}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            {selectedConsultation &&
                                                selectedConsultation.reportGenerated &&
                                                selectedReport && (
                                                    <article className="patient-record-item">
                                                        <div className="patient-record-item-header">
                                                            <div>
                                                                <span>
                                                                    MEDICAL REPORT
                                                                </span>

                                                                <h3>
                                                                    Consultation
                                                                    Report
                                                                </h3>
                                                            </div>

                                                            <div className="patient-record-date">
                                                                <span>
                                                                    Consultation
                                                                    Date
                                                                </span>

                                                                <strong>
                                                                    {formatDate(
                                                                        selectedConsultation.appointmentDate
                                                                    )}
                                                                </strong>
                                                            </div>
                                                        </div>

                                                        <div className="patient-report-details">
                                                            <div className="patient-report-detail">
                                                                <span>
                                                                    Patient
                                                                </span>

                                                                <strong>
                                                                    {selectedConsultation.patientName ||
                                                                        patient.name}
                                                                </strong>
                                                            </div>

                                                            <div className="patient-report-detail">
                                                                <span>
                                                                    Appointment
                                                                    ID
                                                                </span>

                                                                <strong>
                                                                    #
                                                                    {
                                                                        selectedConsultation.appointmentId
                                                                    }
                                                                </strong>
                                                            </div>

                                                            <div className="patient-report-detail">
                                                                <span>
                                                                    Doctor
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        selectedConsultation
                                                                            .doctor
                                                                            ?.name
                                                                    }
                                                                </strong>

                                                                <p>
                                                                    {
                                                                        selectedConsultation
                                                                            .doctor
                                                                            ?.specialization
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="patient-report-detail">
                                                                <span>
                                                                    Reason for
                                                                    Consultation
                                                                </span>

                                                                <p>
                                                                    {selectedConsultation.reason ||
                                                                        "Not available"}
                                                                </p>
                                                            </div>

                                                            <div className="patient-report-detail">
                                                                <span>
                                                                    Diagnosis
                                                                </span>

                                                                <p>
                                                                    {selectedReport.diagnosis ||
                                                                        "Not available"}
                                                                </p>
                                                            </div>

                                                            <div className="patient-report-detail">
                                                                <span>
                                                                    Treatment
                                                                </span>

                                                                <p>
                                                                    {selectedReport.treatment ||
                                                                        "Not available"}
                                                                </p>
                                                            </div>

                                                            <div className="patient-report-detail">
                                                                <span>
                                                                    Clinical
                                                                    Notes
                                                                </span>

                                                                <p>
                                                                    {selectedReport.notes ||
                                                                        "No additional notes available."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </article>
                                                )}
                                        </>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    )}
                </Container>
            </section>
        </main>
    );
}

export default PatientMedicalRecords;