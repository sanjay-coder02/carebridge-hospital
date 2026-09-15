// frontend/src/pages/AdminDashboard.js

import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Row
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8082/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        patients: 0,
        doctors: 0,
        appointments: 0,
        medicalRecords: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const authenticated = sessionStorage.getItem(
            "carebridgeAdminAuthenticated"
        );

        if (authenticated !== "true") {
            navigate("/admin/login");
            return;
        }

        async function loadStats() {
            try {
                setLoading(true);
                setError("");

                const [
                    patientsResponse,
                    doctorsResponse,
                    appointmentsResponse,
                    recordsResponse
                ] = await Promise.all([
                    fetch(`${API_BASE_URL}/patients`),
                    fetch(`${API_BASE_URL}/doctors`),
                    fetch(`${API_BASE_URL}/appointments`),
                    fetch(`${API_BASE_URL}/medical-records`)
                ]);

                if (
                    !patientsResponse.ok ||
                    !doctorsResponse.ok ||
                    !appointmentsResponse.ok ||
                    !recordsResponse.ok
                ) {
                    throw new Error(
                        "Unable to load dashboard data."
                    );
                }

                const [
                    patients,
                    doctors,
                    appointments,
                    medicalRecords
                ] = await Promise.all([
                    patientsResponse.json(),
                    doctorsResponse.json(),
                    appointmentsResponse.json(),
                    recordsResponse.json()
                ]);

                setStats({
                    patients: patients.length,
                    doctors: doctors.length,
                    appointments: appointments.length,
                    medicalRecords: medicalRecords.length
                });
            } catch (dashboardError) {
                setError(
                    dashboardError.message ||
                    "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, [navigate]);

    function handleLogout() {
        sessionStorage.removeItem(
            "carebridgeAdminAuthenticated"
        );

        navigate("/admin/login");
    }

    const statCards = [
        {
            title: "Patients",
            value: stats.patients,
            icon: "P"
        },
        {
            title: "Doctors",
            value: stats.doctors,
            icon: "D"
        },
        {
            title: "Appointments",
            value: stats.appointments,
            icon: "A"
        },
        {
            title: "Medical Reports",
            value: stats.medicalRecords,
            icon: "M"
        }
    ];

    const managementModules = [
        {
            title: "Patients",
            description: "Manage patient information",
            path: "/admin/patients"
        },
        {
            title: "Doctors",
            description: "Manage medical professionals",
            path: "/admin/doctors"
        },
        {
            title: "Appointments",
            description: "Confirm and manage appointments",
            path: "/admin/appointments"
        },
        {
            title: "Medical Reports",
            description: "Generate and manage consultation reports",
            path: "/admin/reports"
        }
    ];

    return (
        <main className="admin-dashboard-page">
            <section className="admin-dashboard-header">
                <Container>
                    <div className="admin-dashboard-header-content">
                        <div>
                            <span>
                                CAREBRIDGE ADMINISTRATION
                            </span>

                            <h1>
                                Dashboard
                            </h1>

                            <p>
                                Manage patients, doctors,
                                appointments and medical reports.
                            </p>
                        </div>

                        <Button
                            className="admin-logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </Container>
            </section>

            <section className="admin-dashboard-section">
                <Container>
                    {error && (
                        <Alert
                            variant="danger"
                            className="admin-dashboard-alert"
                        >
                            {error}
                        </Alert>
                    )}

                    <Row className="admin-stats-row g-4">
                        {statCards.map((card) => (
                            <Col
                                key={card.title}
                                xs={12}
                                sm={6}
                                lg={3}
                            >
                                <Card className="admin-stat-card">
                                    <Card.Body>
                                        <div className="admin-stat-icon">
                                            {card.icon}
                                        </div>

                                        <div className="admin-stat-content">
                                            <span>
                                                {card.title}
                                            </span>

                                            <strong>
                                                {loading
                                                    ? "..."
                                                    : card.value}
                                            </strong>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div className="admin-management-card">
                        <div className="admin-management-heading">
                            <span>
                                ADMINISTRATION
                            </span>

                            <h2>
                                Hospital Management
                            </h2>

                            <p>
                                Access and manage the hospital's
                                operational modules.
                            </p>
                        </div>

                        <Row className="admin-management-row g-4">
                            {managementModules.map((module) => (
                                <Col
                                    key={module.title}
                                    xs={12}
                                    md={6}
                                    lg={4}
                                >
                                    <button
                                        type="button"
                                        className="admin-module-card"
                                        onClick={() =>
                                            navigate(module.path)
                                        }
                                    >
                                        <div className="admin-module-content">
                                            <strong>
                                                {module.title}
                                            </strong>

                                            <small>
                                                {module.description}
                                            </small>
                                        </div>

                                        <span className="admin-module-link">
                                            Open
                                            <span aria-hidden="true">
                                                →
                                            </span>
                                        </span>
                                    </button>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </section>
        </main>
    );
}

export default AdminDashboard;