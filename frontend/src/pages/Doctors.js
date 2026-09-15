// frontend/src/pages/Doctors.js

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { getDoctors } from "../services/doctorservice";
import "./Doctors.css";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctors() {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        setError("Unable to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadDoctors();
  }, []);

  return (
    <main className="doctors-page">
      <section className="doctors-header">
        <Container>
          <div className="doctors-header-content">
            <span>OUR MEDICAL TEAM</span>
            <h1>Meet Our Doctors</h1>
            <p>
              Experienced medical professionals dedicated to providing
              compassionate and reliable healthcare.
            </p>
          </div>
        </Container>
      </section>

      <section className="doctors-list-section">
        <Container>
          {loading && (
            <div className="doctors-message">
              <p>Loading doctors...</p>
            </div>
          )}

          {error && (
            <div className="doctors-message doctors-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && doctors.length === 0 && (
            <div className="doctors-message">
              <p>No doctors are currently available.</p>
            </div>
          )}

          {!loading && !error && doctors.length > 0 && (
            <Row className="g-4">
              {doctors.map((doctor) => (
                <Col key={doctor.id} md={6} lg={4}>
                  <Card className="doctor-card h-100">
                    <Card.Body>
                      <div className="doctor-icon">+</div>

                      <span className="doctor-specialization">
                        {doctor.specialization}
                      </span>

                      <Card.Title>{doctor.name}</Card.Title>

                      <Card.Text className="doctor-description">
                        {doctor.description}
                      </Card.Text>

                      <div className="doctor-details">
                        <p>
                          <strong>Location:</strong> {doctor.location}
                        </p>
                        <p>
                          <strong>Contact:</strong> {doctor.phone}
                        </p>
                      </div>

                      <Button
                        as={Link}
                        to="/appointments"
                        className="doctor-book-button"
                      >
                        Book Appointment
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </main>
  );
}

export default Doctors;