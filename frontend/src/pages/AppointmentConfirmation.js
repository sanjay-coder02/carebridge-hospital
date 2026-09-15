// frontend/src/pages/AppointmentConfirmation.js

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Link, useLocation } from "react-router-dom";
import "./AppointmentConfirmation.css";

const API_URL = `${process.env.REACT_APP_API_URL || "http://localhost:8082/api"}/appointments`;

function AppointmentConfirmation() {
    const location = useLocation();

    const storedAppointment =
        sessionStorage.getItem(
            "carebridgeLastAppointment"
        );

    const initialAppointment =
        location.state?.appointment ||
        (storedAppointment
            ? JSON.parse(storedAppointment)
            : null);

    const [appointment, setAppointment] =
        useState(initialAppointment);

    const [checkingStatus, setCheckingStatus] =
        useState(false);

    const [statusMessage, setStatusMessage] =
        useState("");

    useEffect(() => {
        if (!appointment?.appointmentId) {
            return;
        }

        sessionStorage.setItem(
            "carebridgeLastAppointment",
            JSON.stringify(appointment)
        );
    }, [appointment]);

    async function checkLatestStatus() {
        if (!appointment?.appointmentId) {
            return;
        }

        try {
            setCheckingStatus(true);
            setStatusMessage("");

            const response = await fetch(
                `${API_URL}/${appointment.appointmentId}`
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to check appointment status."
                );
            }

            const latestAppointment =
                await response.json();

            const updatedAppointment = {
                appointmentId:
                    latestAppointment.id,
                patientName:
                    latestAppointment.patient?.name ||
                    appointment.patientName ||
                    "Patient",
                doctorName:
                    latestAppointment.doctor?.name ||
                    appointment.doctorName ||
                    "Selected doctor",
                date:
                    latestAppointment.appointmentDate ||
                    appointment.date,
                time:
                    latestAppointment.appointmentTime ||
                    appointment.time,
                status:
                    latestAppointment.status ||
                    "PENDING"
            };

            setAppointment(updatedAppointment);

            setStatusMessage(
                "Appointment status updated."
            );
        } catch (error) {
            setStatusMessage(
                error.message ||
                "Unable to check appointment status."
            );
        } finally {
            setCheckingStatus(false);
        }
    }

    if (!appointment) {
        return (
            <main className="appointment-confirmation-page">
                <section className="confirmation-section">
                    <Container>
                        <div className="confirmation-card">
                            <div className="confirmation-icon">
                                !
                            </div>

                            <span className="confirmation-label">
                                APPOINTMENT INFORMATION
                            </span>

                            <h1>
                                Appointment Not Found
                            </h1>

                            <p>
                                We could not find appointment
                                details for this page.
                                Please book an appointment
                                first.
                            </p>

                            <Button
                                as={Link}
                                to="/appointments"
                                className="confirmation-primary-button"
                            >
                                Book Appointment
                            </Button>
                        </div>
                    </Container>
                </section>
            </main>
        );
    }

    const currentStatus =
        appointment.status || "PENDING";

    const statusClass =
        currentStatus.toLowerCase();

    return (
        <main className="appointment-confirmation-page">
            <section className="confirmation-section">
                <Container>
                    <div className="confirmation-card">
                        <div className="confirmation-success-icon">
                            ✓
                        </div>

                        <span className="confirmation-label">
                            CAREBRIDGE APPOINTMENTS
                        </span>

                        <h1>
                            Appointment Request Submitted
                        </h1>

                        <p className="confirmation-message">
                            Your appointment request has been
                            submitted successfully. Please
                            keep your appointment ID for
                            future reference.
                        </p>

                        <div className="confirmation-details">
                            <div className="confirmation-detail">
                                <span>
                                    Patient Name
                                </span>

                                <strong>
                                    {appointment.patientName}
                                </strong>
                            </div>

                            <div className="confirmation-detail">
                                <span>
                                    Appointment ID
                                </span>

                                <strong>
                                    #{appointment.appointmentId}
                                </strong>
                            </div>

                            <div className="confirmation-detail">
                                <span>
                                    Doctor
                                </span>

                                <strong>
                                    {appointment.doctorName}
                                </strong>
                            </div>

                            <div className="confirmation-detail">
                                <span>
                                    Date
                                </span>

                                <strong>
                                    {appointment.date}
                                </strong>
                            </div>

                            <div className="confirmation-detail">
                                <span>
                                    Time
                                </span>

                                <strong>
                                    {appointment.time}
                                </strong>
                            </div>

                            <div className="confirmation-detail">
                                <span>
                                    Current Status
                                </span>

                                <strong
                                    className={`confirmation-status ${statusClass}`}
                                >
                                    {currentStatus}
                                </strong>
                            </div>
                        </div>

                        <div className="confirmation-status-section">
                            <p>
                                Your appointment will be
                                reviewed by the hospital
                                administration.
                            </p>

                            <Button
                                type="button"
                                className="confirmation-status-button"
                                onClick={
                                    checkLatestStatus
                                }
                                disabled={
                                    checkingStatus
                                }
                            >
                                {checkingStatus
                                    ? "Checking..."
                                    : "Check Latest Status"}
                            </Button>

                            {statusMessage && (
                                <span className="confirmation-status-message">
                                    {statusMessage}
                                </span>
                            )}
                        </div>

                        <div className="confirmation-actions">
                            <Button
                                as={Link}
                                to="/appointments/cancel"
                                className="confirmation-secondary-button"
                            >
                                Cancel Appointment
                            </Button>

                            <Button
                                as={Link}
                                to="/"
                                className="confirmation-primary-button"
                            >
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}

export default AppointmentConfirmation;