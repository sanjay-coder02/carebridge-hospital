// frontend/src/pages/CancelAppointment.js

import { useState } from "react";
import {
    Alert,
    Button,
    Col,
    Container,
    Form,
    Row
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./CancelAppointment.css";

const API_URL =
    `${process.env.REACT_APP_API_URL || "http://localhost:8082/api"}/appointments`;

function CancelAppointment() {
    const [appointmentId, setAppointmentId] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess(null);
        setLoading(true);

        try {
            const id = Number(appointmentId);

            if (!Number.isInteger(id) || id <= 0) {
                throw new Error(
                    "Please enter a valid appointment ID."
                );
            }

            const response = await fetch(
                `${API_URL}/${id}/cancel-public`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        phone: phone.trim()
                    })
                }
            );

            const responseText = await response.text();

            if (!response.ok) {
                throw new Error(
                    responseText ||
                    "Unable to cancel the appointment."
                );
            }

            const appointment = JSON.parse(responseText);

            setSuccess({
                id: appointment.id,
                doctorName:
                    appointment.doctor?.name ||
                    "Selected doctor",
                date:
                    appointment.appointmentDate ||
                    "Not available",
                time:
                    appointment.appointmentTime ||
                    "Not available"
            });

            setAppointmentId("");
            setPhone("");
        } catch (cancelError) {
            setError(
                cancelError.message ||
                "Unable to cancel the appointment."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="cancel-appointment-page">
            <section className="cancel-appointment-header">
                <Container>
                    <div className="cancel-appointment-header-content">
                        <span>
                            CAREBRIDGE APPOINTMENTS
                        </span>

                        <h1>
                            Cancel Appointment
                        </h1>

                        <p>
                            Cancel your appointment securely
                            using your appointment ID and
                            registered phone number.
                        </p>
                    </div>
                </Container>
            </section>

            <section className="cancel-appointment-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col
                            xs={12}
                            md={9}
                            lg={7}
                            xl={6}
                        >
                            <div className="cancel-appointment-card">
                                {error && (
                                    <Alert
                                        variant="danger"
                                        className="cancel-alert"
                                    >
                                        {error}
                                    </Alert>
                                )}

                                {success ? (
                                    <div className="cancel-success">
                                        <div className="cancel-success-icon">
                                            ✓
                                        </div>

                                        <span className="cancel-label">
                                            CAREBRIDGE APPOINTMENTS
                                        </span>

                                        <h2>
                                            Appointment Cancelled
                                        </h2>

                                        <p>
                                            Your appointment has
                                            been cancelled
                                            successfully.
                                        </p>

                                        <div className="cancel-details">
                                            <div>
                                                <span>
                                                    Appointment ID
                                                </span>

                                                <strong>
                                                    #{success.id}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Doctor
                                                </span>

                                                <strong>
                                                    {success.doctorName}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Date
                                                </span>

                                                <strong>
                                                    {success.date}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Time
                                                </span>

                                                <strong>
                                                    {success.time}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Status
                                                </span>

                                                <strong className="cancelled-status">
                                                    CANCELLED
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="cancel-actions">
                                            <Button
                                                as={Link}
                                                to="/appointments"
                                                className="cancel-primary-button"
                                            >
                                                Book Another Appointment
                                            </Button>

                                            <Button
                                                as={Link}
                                                to="/"
                                                className="cancel-secondary-button"
                                            >
                                                Back to Home
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="cancel-card-heading">
                                            <div className="cancel-icon">
                                                ×
                                            </div>

                                            <div>
                                                <span>
                                                    APPOINTMENT MANAGEMENT
                                                </span>

                                                <h2>
                                                    Cancel your appointment
                                                </h2>
                                            </div>
                                        </div>

                                        <p className="cancel-description">
                                            Enter the appointment ID
                                            you received during
                                            booking and the phone
                                            number registered with
                                            the appointment.
                                        </p>

                                        <Form
                                            onSubmit={
                                                handleSubmit
                                            }
                                        >
                                            <Form.Group
                                                className="mb-4"
                                                controlId="appointmentId"
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

                                            <Form.Group
                                                className="mb-4"
                                                controlId="registeredPhone"
                                            >
                                                <Form.Label>
                                                    Registered Phone Number
                                                </Form.Label>

                                                <Form.Control
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setPhone(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Enter registered phone number"
                                                    required
                                                />
                                            </Form.Group>

                                            <div className="cancel-warning">
                                                <strong>
                                                    Please note:
                                                </strong>

                                                <span>
                                                    Cancelling an
                                                    appointment cannot
                                                    be undone from
                                                    this page.
                                                </span>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="cancel-submit-button"
                                                disabled={loading}
                                            >
                                                {loading
                                                    ? "Cancelling..."
                                                    : "Cancel Appointment"}
                                            </Button>
                                        </Form>
                                    </>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    );
}

export default CancelAppointment;