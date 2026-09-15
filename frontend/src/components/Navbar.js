// frontend/src/components/Navbar.js

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function NavigationBar() {
    return (
        <Navbar
            expand="lg"
            className="carebridge-navbar"
            sticky="top"
        >
            <Container>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    className="carebridge-brand"
                >
                    <span className="brand-icon">
                        +
                    </span>

                    <span className="brand-text">
                        <strong>
                            CareBridge
                        </strong>

                        <small>
                            Hospital
                        </small>
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle
                    aria-controls="carebridge-navigation"
                    aria-label="Toggle navigation"
                />

                <Navbar.Collapse
                    id="carebridge-navigation"
                >
                    <Nav className="ms-auto align-items-lg-center">
                        <Nav.Link
                            as={Link}
                            to="/"
                            className="carebridge-nav-link"
                        >
                            Home
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/doctors"
                            className="carebridge-nav-link"
                        >
                            Doctors
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/appointments"
                            className="carebridge-nav-link"
                        >
                            Appointments
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/medical-records"
                            className="carebridge-nav-link"
                        >
                            Medical Records
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/appointments/status"
                            className="carebridge-nav-link"
                        >
                            Appointment Status
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/admin/login"
                            className="carebridge-admin-link"
                        >
                            Admin Login
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;