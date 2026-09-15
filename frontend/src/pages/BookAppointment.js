// frontend/src/pages/BookAppointment.js

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../services/doctorservice";
import { createPatient } from "../services/patientService";
import { createAppointment } from "../services/appointmentService";
import "./BookAppointment.css";

function BookAppointment() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        location: "",
        bloodGroup: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: ""
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function loadDoctors() {
            try {
                const data = await getDoctors();

                setDoctors(data);
            } catch (err) {
                setError(
                    "Unable to load doctors. Please try again later."
                );
            } finally {
                setLoadingDoctors(false);
            }
        }

        loadDoctors();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            const patient = await createPatient({
                name: formData.name,
                age: Number(formData.age),
                gender: formData.gender,
                phone: formData.phone,
                email: formData.email,
                location: formData.location,
                bloodGroup: formData.bloodGroup
            });

            const appointment = await createAppointment({
                patientId: patient.id,
                doctorId: Number(formData.doctorId),
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                reason: formData.reason
            });

            const selectedDoctor = doctors.find(
                (doctor) =>
                    doctor.id === Number(formData.doctorId)
            );

            const confirmationData = {
                appointmentId: appointment.id,
                patientName: patient.name,
                doctorName:
                    selectedDoctor?.name ||
                    "Selected doctor",
                date: appointment.appointmentDate,
                time: appointment.appointmentTime,
                status: appointment.status || "PENDING"
            };

            sessionStorage.setItem(
                "carebridgeLastAppointment",
                JSON.stringify(confirmationData)
            );

            navigate(
                "/appointments/confirmation",
                {
                    state: {
                        appointment: confirmationData
                    }
                }
            );
        } catch (err) {
            setError(
                err.message ||
                "Unable to book the appointment. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="book-appointment-page">
            <section className="book-appointment-header">
                <Container>
                    <div className="book-appointment-header-content">
                        <span>
                            CAREBRIDGE APPOINTMENTS
                        </span>

                        <h1>
                            Book an Appointment
                        </h1>

                        <p>
                            Provide your details and choose
                            a doctor for your consultation.
                        </p>
                    </div>
                </Container>
            </section>

            <section className="book-appointment-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={9} xl={8}>
                            <div className="appointment-form-card">
                                {error && (
                                    <Alert variant="danger">
                                        {error}
                                    </Alert>
                                )}

                                <Form
                                    onSubmit={handleSubmit}
                                >
                                    <div className="appointment-form-section">
                                        <h2>
                                            Patient Details
                                        </h2>

                                        <Row className="g-3">
                                            <Col md={6}>
                                                <Form.Group
                                                    controlId="patientName"
                                                >
                                                    <Form.Label>
                                                        Full Name
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={
                                                            formData.name
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Enter your full name"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={3}>
                                                <Form.Group
                                                    controlId="patientAge"
                                                >
                                                    <Form.Label>
                                                        Age
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="number"
                                                        name="age"
                                                        value={
                                                            formData.age
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        min="1"
                                                        max="120"
                                                        placeholder="Age"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={3}>
                                                <Form.Group
                                                    controlId="patientGender"
                                                >
                                                    <Form.Label>
                                                        Gender
                                                    </Form.Label>

                                                    <Form.Select
                                                        name="gender"
                                                        value={
                                                            formData.gender
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Select
                                                        </option>

                                                        <option value="Male">
                                                            Male
                                                        </option>

                                                        <option value="Female">
                                                            Female
                                                        </option>

                                                        <option value="Other">
                                                            Other
                                                        </option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group
                                                    controlId="patientPhone"
                                                >
                                                    <Form.Label>
                                                        Phone Number
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="tel"
                                                        name="phone"
                                                        value={
                                                            formData.phone
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Enter phone number"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group
                                                    controlId="patientEmail"
                                                >
                                                    <Form.Label>
                                                        Email
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={
                                                            formData.email
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Enter email address"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group
                                                    controlId="patientLocation"
                                                >
                                                    <Form.Label>
                                                        Location
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="text"
                                                        name="location"
                                                        value={
                                                            formData.location
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="City / Location"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group
                                                    controlId="patientBloodGroup"
                                                >
                                                    <Form.Label>
                                                        Blood Group
                                                    </Form.Label>

                                                    <Form.Select
                                                        name="bloodGroup"
                                                        value={
                                                            formData.bloodGroup
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Select blood group
                                                        </option>

                                                        <option value="A+">
                                                            A+
                                                        </option>

                                                        <option value="A-">
                                                            A-
                                                        </option>

                                                        <option value="B+">
                                                            B+
                                                        </option>

                                                        <option value="B-">
                                                            B-
                                                        </option>

                                                        <option value="AB+">
                                                            AB+
                                                        </option>

                                                        <option value="AB-">
                                                            AB-
                                                        </option>

                                                        <option value="O+">
                                                            O+
                                                        </option>

                                                        <option value="O-">
                                                            O-
                                                        </option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="appointment-form-section">
                                        <h2>
                                            Appointment Details
                                        </h2>

                                        <Row className="g-3">
                                            <Col md={12}>
                                                <Form.Group
                                                    controlId="appointmentDoctor"
                                                >
                                                    <Form.Label>
                                                        Choose Doctor
                                                    </Form.Label>

                                                    <Form.Select
                                                        name="doctorId"
                                                        value={
                                                            formData.doctorId
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        disabled={
                                                            loadingDoctors
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            {loadingDoctors
                                                                ? "Loading doctors..."
                                                                : "Select a doctor"}
                                                        </option>

                                                        {doctors.map(
                                                            (doctor) => (
                                                                <option
                                                                    key={
                                                                        doctor.id
                                                                    }
                                                                    value={
                                                                        doctor.id
                                                                    }
                                                                >
                                                                    {
                                                                        doctor.name
                                                                    }{" "}
                                                                    —{" "}
                                                                    {
                                                                        doctor.specialization
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group
                                                    controlId="appointmentDate"
                                                >
                                                    <Form.Label>
                                                        Appointment Date
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="date"
                                                        name="appointmentDate"
                                                        value={
                                                            formData.appointmentDate
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group
                                                    controlId="appointmentTime"
                                                >
                                                    <Form.Label>
                                                        Appointment Time
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="time"
                                                        name="appointmentTime"
                                                        value={
                                                            formData.appointmentTime
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>

                                            <Col md={12}>
                                                <Form.Group
                                                    controlId="appointmentReason"
                                                >
                                                    <Form.Label>
                                                        Reason for Visit
                                                    </Form.Label>

                                                    <Form.Control
                                                        as="textarea"
                                                        rows={4}
                                                        name="reason"
                                                        value={
                                                            formData.reason
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        placeholder="Briefly describe the reason for your visit"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="appointment-submit-button"
                                        disabled={
                                            submitting ||
                                            loadingDoctors
                                        }
                                    >
                                        {submitting
                                            ? "Submitting..."
                                            : "Request Appointment"}
                                    </Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    );
}

export default BookAppointment;