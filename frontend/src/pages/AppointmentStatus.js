// frontend/src/pages/AppointmentStatus.js

import { useState } from "react";
import {
    Alert,
    Button,
    Col,
    Container,
    Form,
    Row
} from "react-bootstrap";
import "./AppointmentStatus.css";

const API_URL =
    `${process.env.REACT_APP_API_URL || "http://localhost:8082/api"}/appointments`;

function AppointmentStatus() {
    const [appointmentId, setAppointmentId] =
        useState("");

    const [phone, setPhone] = useState("");

    const [appointment, setAppointment] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    function normalizePhone(value) {
        return value.replace(/\D/g, "");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setAppointment(null);
        setLoading(true);

        try {
            const id = Number(appointmentId);

            if (!Number.isInteger(id) || id <= 0) {
                throw new Error(
                    "Please enter a valid appointment ID."
                );
            }

            const enteredPhone =
                normalizePhone(phone);

            if (!enteredPhone) {
                throw new Error(
                    "Please enter your registered phone number."
                );
            }

            const response = await fetch(
                `${API_URL}/${id}`
            );

            const responseText =
                await response.text();

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(
                        "Appointment not found."
                    );
                }

                throw new Error(
                    responseText ||
                    "Unable to check appointment status."
                );
            }

            const data =
                JSON.parse(responseText);

            const appointmentPhone =
                normalizePhone(
                    data.patient?.phone || ""
                );

            if (
                !appointmentPhone ||
                appointmentPhone !== enteredPhone
            ) {
                throw new Error(
                    "The phone number does not match this appointment."
                );
            }

            setAppointment(data);
        } catch (statusError) {
            setError(
                statusError.message ||
                "Unable to check appointment status."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleClear() {
        setAppointmentId("");
        setPhone("");
        setAppointment(null);
        setError("");
    }

    const status =
        appointment?.status || "PENDING";

    const statusClass =
        status.toLowerCase();

    return (
        <main className="appointment-status-page">
            <section className="appointment-status-header">
                <Container>
                    <div className="appointment-status-header-content">
                        <span>
                            CAREBRIDGE APPOINTMENTS
                        </span>

                        <h1>
                            Check Appointment Status
                        </h1>

                        <p>
                            Check the latest status of your
                            appointment using your appointment
                            details.
                        </p>
                    </div>
                </Container>
            </section>

            <section className="appointment-status-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col
                            xs={12}
                            md={10}
                            lg={8}
                            xl={7}
                        >
                            <div className="appointment-status-card">
                                <div className="status-card-heading">
                                    <div className="status-card-icon">
                                        ✓
                                    </div>

                                    <div>
                                        <span>
                                            APPOINTMENT TRACKING
                                        </span>

                                        <h2>
                                            View Appointment Status
                                        </h2>
                                    </div>
                                </div>

                                <p className="status-card-description">
                                    Enter the appointment ID
                                    provided after booking and
                                    the phone number registered
                                    with the appointment.
                                </p>

                                {error && (
                                    <Alert
                                        variant="danger"
                                        className="status-alert"
                                    >
                                        {error}
                                    </Alert>
                                )}

                                <Form
                                    onSubmit={
                                        handleSubmit
                                    }
                                >
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group
                                                controlId="appointmentStatusId"
                                            >
                                                <Form.Label>
                                                    Appointment ID
                                                </Form.Label>

                                                <Form.Control
                                                    type="number"
                                                    min="1"
                                                    value={
                                                        appointmentId
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setAppointmentId(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Enter appointment ID"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group
                                                controlId="appointmentStatusPhone"
                                            >
                                                <Form.Label>
                                                    Registered Phone Number
                                                </Form.Label>

                                                <Form.Control
                                                    type="tel"
                                                    value={
                                                        phone
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setPhone(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Enter phone number"
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="status-form-actions">
                                        <Button
                                            type="submit"
                                            className="status-check-button"
                                            disabled={
                                                loading
                                            }
                                        >
                                            {loading
                                                ? "Checking..."
                                                : "Check Status"}
                                        </Button>

                                        <Button
                                            type="button"
                                            className="status-clear-button"
                                            onClick={
                                                handleClear
                                            }
                                            disabled={
                                                loading
                                            }
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>

                    {appointment && (
                        <Row className="justify-content-center">
                            <Col
                                xs={12}
                                md={10}
                                lg={8}
                                xl={7}
                            >
                                <div className="appointment-status-result">
                                    <div className="status-result-heading">
                                        <div>
                                            <span>
                                                APPOINTMENT DETAILS
                                            </span>

                                            <h2>
                                                Appointment #
                                                {
                                                    appointment.id
                                                }
                                            </h2>
                                        </div>

                                        <span
                                            className={`appointment-status-badge ${statusClass}`}
                                        >
                                            {status}
                                        </span>
                                    </div>

                                    <div className="status-details">
                                        <div className="status-detail">
                                            <span>
                                                Patient Name
                                            </span>

                                            <strong>
                                                {appointment
                                                    .patient
                                                    ?.name ||
                                                    "Not available"}
                                            </strong>
                                        </div>

                                        <div className="status-detail">
                                            <span>
                                                Doctor
                                            </span>

                                            <strong>
                                                {appointment
                                                    .doctor
                                                    ?.name ||
                                                    "Not available"}
                                            </strong>
                                        </div>

                                        <div className="status-detail">
                                            <span>
                                                Specialization
                                            </span>

                                            <strong>
                                                {appointment
                                                    .doctor
                                                    ?.specialization ||
                                                    "Not available"}
                                            </strong>
                                        </div>

                                        <div className="status-detail">
                                            <span>
                                                Appointment Date
                                            </span>

                                            <strong>
                                                {appointment.appointmentDate ||
                                                    "Not available"}
                                            </strong>
                                        </div>

                                        <div className="status-detail">
                                            <span>
                                                Appointment Time
                                            </span>

                                            <strong>
                                                {appointment.appointmentTime ||
                                                    "Not available"}
                                            </strong>
                                        </div>

                                        <div className="status-detail">
                                            <span>
                                                Reason for Visit
                                            </span>

                                            <strong>
                                                {appointment.reason ||
                                                    "Not available"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div
                                        className={`status-message ${statusClass}`}
                                    >
                                        {status ===
                                            "PENDING" && (
                                            <p>
                                                Your appointment
                                                request is waiting
                                                for hospital
                                                confirmation.
                                            </p>
                                        )}

                                        {status ===
                                            "CONFIRMED" && (
                                            <p>
                                                Your appointment has
                                                been confirmed.
                                                Please arrive on
                                                time for your
                                                consultation.
                                            </p>
                                        )}

                                        {status ===
                                            "CANCELLED" && (
                                            <p>
                                                This appointment has
                                                been cancelled.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    )}
                </Container>
            </section>
        </main>
    );
}

export default AppointmentStatus;