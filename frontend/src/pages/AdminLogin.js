// frontend/src/pages/AdminLogin.js

import { useState } from "react";
import {
    Alert,
    Button,
    Container,
    Form,
    Row,
    Col
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const API_URL =
    `${process.env.REACT_APP_API_URL || "http://localhost:8082/api"}/admin/login`;

function AdminLogin() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Login failed."
                );
            }

            sessionStorage.setItem(
                "carebridgeAdminAuthenticated",
                "true"
            );

            navigate("/admin/dashboard");
        } catch (loginError) {
            setError(
                loginError.message ||
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="admin-login-page">
            <section className="admin-login-section">
                <Container>
                    <Row className="justify-content-center">
                        <Col
                            xs={12}
                            sm={10}
                            md={7}
                            lg={5}
                            xl={4}
                        >
                            <div className="admin-login-card">

                                <div className="admin-login-icon">
                                    +
                                </div>

                                <span className="admin-login-label">
                                    CAREBRIDGE HOSPITAL
                                </span>

                                <h1>
                                    Admin Login
                                </h1>

                                <p className="admin-login-description">
                                    Sign in to manage hospital
                                    operations and patient services.
                                </p>

                                {error && (
                                    <Alert
                                        variant="danger"
                                        className="admin-login-alert"
                                    >
                                        {error}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>

                                    <Form.Group
                                        className="mb-4"
                                        controlId="adminUsername"
                                    >
                                        <Form.Label>
                                            Username
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            value={username}
                                            onChange={(event) =>
                                                setUsername(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter admin username"
                                            autoComplete="username"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group
                                        className="mb-4"
                                        controlId="adminPassword"
                                    >
                                        <Form.Label>
                                            Password
                                        </Form.Label>

                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter admin password"
                                            autoComplete="current-password"
                                            required
                                        />
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        className="admin-login-button"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Signing in..."
                                            : "Sign In"}
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

export default AdminLogin;