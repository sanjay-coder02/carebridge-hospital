// src/components/Footer.js

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="carebridge-footer">
      <Container>
        <Row className="g-4">
          <Col md={5}>
            <div className="footer-brand">
              <span className="footer-brand-icon">+</span>

              <span>
                <strong>CareBridge</strong>
                <small>Hospital</small>
              </span>
            </div>

            <p className="footer-description">
              Compassionate healthcare delivered by trusted medical
              professionals with patient care at the heart of everything we do.
            </p>
          </Col>

          <Col sm={6} md={3}>
            <h5>Quick Links</h5>

            <Nav className="flex-column">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>

              <Nav.Link as={Link} to="/doctors">
                Doctors
              </Nav.Link>

              <Nav.Link as={Link} to="/appointments">
                Appointments
              </Nav.Link>

              <Nav.Link as={Link} to="/medical-records">
                Medical Records
              </Nav.Link>

              <Nav.Link as={Link} to="/appointments/status">
                Appointment Status
              </Nav.Link>

              <Nav.Link as={Link} to="/admin/login">
                Admin Login
              </Nav.Link>
            </Nav>
          </Col>

          <Col sm={6} md={4}>
            <h5>Contact Us</h5>

            <div className="footer-contact">
              <p>📍 Chennai, Tamil Nadu</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ care@carebridgehospital.com</p>
              <p>🕐 Open 24/7 for emergency care</p>
            </div>
          </Col>
        </Row>

        <hr />

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} CareBridge Hospital. All rights
            reserved.
          </p>

          <p>Compassionate Care. Better Health.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;