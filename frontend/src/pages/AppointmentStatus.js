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
    const [phone, setPhone] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function normalizePhone(value) {
        return value.replace(/\D/g, "");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setAppointments("");
        setLoading(true);

        try {
            const enteredPhone = normalizePhone(phone);

            if (!enteredPhone) {
                throw new Error(
                    "Please enter your registered phone number."
                );
            }

            const response = await fetch(
                `${API_URL}/by-phone?phone=${encodeURIComponent(
                    enteredPhone
                )}`
            );

            const responseText = await response.text();

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(
                        "No appointments found for this phone number."
                    );
                }

                throw new Error(
                    responseText ||
                    "Unable to check appointment status."
                );
            }

            const data = JSON.parse(responseText);

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error(
                    "No appointments found for this phone number."
                );
            }

            setAppointments(data);
        } catch (statusError) {
            setAppointments([]);
            setError(
                statusError.message ||
                "Unable to check appointment status."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleClear() {
        setPhone("");
        setAppointments([]);
        setError("");
    }

    function getStatusClass(status) {
        return (status || "PENDING").toLowerCase();
    }

    function getStatusMessage(status) {
        switch (status) {
            case "PENDING":
                return "Your appointment request is waiting for hospital confirmation.";

            case "CONFIRMED":
                return "Your appointment has been confirmed. Please arrive on time for your consultation.";

            case "COMPLETED":
                return "Your consultation has been completed.";

            case "CANCELLED":
                return "This appointment has been cancelled.";

            default:
                return "Please contact the hospital for more information about this appointment.";
        }
    }

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
                            Enter your registered mobile number
                            to view your appointment status.
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
                                            Find Your Appointments
                                        </h2>
                                    </div>
                                </div>

                                <p className="status-card-description">
                                    Enter the mobile number
                                    registered with your
                                    appointment. You can view
                                    all appointments associated
                                    with that number.
                                </p>

                                {error && (
                                    <Alert
                                        variant="danger"
                                        className="status-alert"
                                    >
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group
                                        controlId="appointmentStatusPhone"
                                    >
                                        <Form.Label>
                                            Registered Phone Number
                                        </Form.Label>

                                        <Form.Control
                                            type="tel"
                                            value={phone}
                                            onChange={(event) =>
                                                setPhone(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter your registered phone number"
                                            required
                                        />
                                    </Form.Group>

                                    <div className="status-form-actions">
                                        <Button
                                            type="submit"
                                            className="status-check-button"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Checking..."
                                                : "Check Status"}
                                        </Button>

                                        <Button
                                            type="button"
                                            className="status-clear-button"
                                            onClick={handleClear}
                                            disabled={loading}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>

                    {appointments.length > 0 && (
                        <Row className="justify-content-center">
                            <Col
                                xs={12}
                                md={10}
                                lg={10}
                                xl={9}
                            >
                                <div className="appointment-status-results">
                                    <div className="status-results-heading">
                                        <div>
                                            <span>
                                                YOUR APPOINTMENTS
                                            </span>

                                            <h2>
                                                Appointment Status
                                            </h2>
                                        </div>

                                        <div className="status-results-count">
                                            {appointments.length}{" "}
                                            {appointments.length === 1
                                                ? "Appointment"
                                                : "Appointments"}
                                        </div>
                                    </div>

                                    <div className="status-appointment-list">
                                        {appointments.map(
                                            (appointment) => {
                                                const status =
                                                    appointment.status ||
                                                    "PENDING";

                                                const statusClass =
                                                    getStatusClass(status);

                                                return (
                                                    <article
                                                        className="appointment-status-result"
                                                        key={
                                                            appointment.id
                                                        }
                                                    >
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
                                                                    {
                                                                        appointment.patientName
                                                                    }
                                                                </strong>
                                                            </div>

                                                            <div className="status-detail">
                                                                <span>
                                                                    Doctor
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        appointment.doctorName
                                                                    }
                                                                </strong>
                                                            </div>

                                                            <div className="status-detail">
                                                                <span>
                                                                    Specialization
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        appointment.specialization
                                                                    }
                                                                </strong>
                                                            </div>

                                                            <div className="status-detail">
                                                                <span>
                                                                    Appointment Date
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        appointment.appointmentDate
                                                                    }
                                                                </strong>
                                                            </div>

                                                            <div className="status-detail">
                                                                <span>
                                                                    Appointment Time
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        appointment.appointmentTime
                                                                    }
                                                                </strong>
                                                            </div>

                                                            <div className="status-detail">
                                                                <span>
                                                                    Reason for Visit
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        appointment.reason ||
                                                                        "Not available"
                                                                    }
                                                                </strong>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={`status-message ${statusClass}`}
                                                        >
                                                            <p>
                                                                {getStatusMessage(
                                                                    status
                                                                )}
                                                            </p>
                                                        </div>
                                                    </article>
                                                );
                                            }
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