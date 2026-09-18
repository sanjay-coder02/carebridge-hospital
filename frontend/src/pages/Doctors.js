// frontend/src/pages/Doctors.js

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { getDoctors } from "../services/doctorservice";
import doctorsBanner from "../assets/images/doctors-banner.png";
import "./Doctors.css";

function Icon({ type }) {
  const paths = {
    doctor: (
      <>
        <path d="M7 3v5a5 5 0 0 0 10 0V3" />
        <path d="M5 3h4M15 3h4" />
        <path d="M12 13v8" />
        <path d="M8 21h8" />
        <path d="M17 14h3a2 2 0 0 1 2 2v2" />
        <circle cx="20" cy="11" r="2" />
      </>
    ),

    heart: (
      <path d="M20.8 8.8c0 5.5-8.8 10.4-8.8 10.4S3.2 14.3 3.2 8.8A5 5 0 0 1 12 5.9a5 5 0 0 1 8.8 2.9Z" />
    ),

    brain: (
      <>
        <path d="M9.2 4.2A3.5 3.5 0 0 0 4 7a3.5 3.5 0 0 0 .5 1.7A3.6 3.6 0 0 0 3 11.6a3.8 3.8 0 0 0 2.6 3.6A3.7 3.7 0 0 0 9 19h2V5.8a3.1 3.1 0 0 0-1.8-1.6Z" />
        <path d="M14.8 4.2A3.5 3.5 0 0 1 20 7a3.5 3.5 0 0 1-.5 1.7 3.6 3.6 0 0 1 1.5 2.9 3.8 3.8 0 0 1-2.6 3.6A3.7 3.7 0 0 1 15 19h-2V5.8a3.1 3.1 0 0 1 1.8-1.6Z" />
        <path d="M11 8H8.5M11 12H8M11 16H9M13 8h2.5M13 12h3M13 16h2" />
      </>
    ),

    bone: (
      <path d="M18.4 8.5a3 3 0 1 0-2.8-4.1l-8.2 8.2a3 3 0 1 0 2.8 4.1l8.2-8.2Z" />
    ),

    child: (
      <>
        <circle cx="12" cy="6" r="3" />
        <path d="M8 13.5c1.1-1 2.4-1.5 4-1.5s2.9.5 4 1.5" />
        <path d="M7 21v-3.5a5 5 0 0 1 10 0V21" />
        <path d="M7.5 15.5 5 18M16.5 15.5 19 18" />
      </>
    ),

    skin: (
      <>
        <path d="M12 3c3.7 0 6.7 2.4 6.7 5.4 0 1.9-1.2 3.6-3 4.6 1.1 1.1 1.8 2.5 1.8 4 0 2.2-2.5 4-5.5 4s-5.5-1.8-5.5-4c0-1.5.7-2.9 1.8-4-1.8-1-3-2.7-3-4.6C5.3 5.4 8.3 3 12 3Z" />
        <circle cx="9.5" cy="8" r="0.8" />
        <circle cx="14.5" cy="10" r="0.8" />
        <circle cx="11" cy="14" r="0.8" />
        <circle cx="15" cy="17" r="0.8" />
      </>
    ),

    location: (
      <path
        fill="currentColor"
        stroke="none"
        d="M12 2.5A7.5 7.5 0 0 0 4.5 10c0 5.5 7.5 11.5 7.5 11.5S19.5 15.5 19.5 10A7.5 7.5 0 0 0 12 2.5Zm0 10.4a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
      />
    ),

    phone: (
      <path
        fill="currentColor"
        stroke="none"
        d="M6.2 2.8c.7-.4 1.6-.2 2.1.4l2.1 2.7c.5.6.5 1.5.1 2.1L9.2 9.8c1 2.1 2.8 3.9 4.9 4.9l1.8-1.3c.7-.5 1.6-.4 2.1.1l2.7 2.1c.7.5.8 1.4.4 2.1l-1.1 1.7c-.6.9-1.7 1.3-2.7 1C9.9 18.7 5.3 14.1 3.6 6.7c-.2-1 .2-2.1 1-2.7l1.6-1.2Z"
      />
    ),

    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 19c.5-3.5 2.5-5.3 6-5.3s5.5 1.8 6 5.3" />
        <path d="M15.5 14.5c2.7.3 4.2 1.8 4.5 4.5" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v5c0 4.8-3.3 8.5-8 10-4.7-1.5-8-5.2-8-10V6l8-3Z" />
        <path d="m8.3 12 2.3 2.3 5.1-5.1" />
      </>
    ),

    star: (
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    ),

    arrow: (
      <>
        <path d="M5 12h13" />
        <path d="m13 7 5 5-5 5" />
      </>
    ),
  };

  return (
    <svg
      className="doctors-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type] || paths.doctor}
    </svg>
  );
}

function getSpecialtyIcon(specialization = "") {
  const specialty = specialization.toLowerCase();

  if (specialty.includes("cardio")) {
    return "heart";
  }

  if (specialty.includes("neuro")) {
    return "brain";
  }

  if (specialty.includes("ortho")) {
    return "bone";
  }

  if (specialty.includes("pediatric") || specialty.includes("child")) {
    return "child";
  }

  if (specialty.includes("dermat")) {
    return "skin";
  }

  return "doctor";
}

function getSpecialtyClass(specialization = "") {
  const specialty = specialization.toLowerCase();

  if (specialty.includes("cardio")) {
    return "specialty-cardiology";
  }

  if (specialty.includes("neuro")) {
    return "specialty-neurology";
  }

  if (specialty.includes("ortho")) {
    return "specialty-orthopedics";
  }

  if (specialty.includes("pediatric") || specialty.includes("child")) {
    return "specialty-pediatrics";
  }

  if (specialty.includes("dermat")) {
    return "specialty-dermatology";
  }

  return "specialty-general";
}

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
      <section className="doctors-hero">
        <img
          src={doctorsBanner}
          alt="CareBridge medical team"
          className="doctors-hero-image"
        />

        <div className="doctors-hero-overlay"></div>

        <div className="doctors-hero-content">
          <Container>
            <div className="doctors-hero-copy">
              <span className="doctors-hero-label">
                <span className="doctors-hero-dot"></span>
                OUR MEDICAL TEAM
              </span>

              <h1>
                Meet Our
                <strong>Doctors.</strong>
              </h1>

              <p>
                Experienced medical professionals dedicated to providing
                compassionate, reliable, and patient-focused healthcare.
              </p>

              <div className="doctors-hero-actions">
                <Link
                  to="/appointments"
                  className="doctors-hero-button"
                >
                  Book an Appointment
                  <Icon type="arrow" />
                </Link>

                <span className="doctors-hero-note">
                  Trusted care. Experienced professionals.
                </span>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <section className="doctors-trust-strip">
        <Container>
          <div className="doctors-trust-grid">
            <div className="doctors-trust-item">
              <div className="doctors-trust-icon doctors-trust-icon-teal">
                <Icon type="users" />
              </div>

              <div>
                <strong>6</strong>
                <span>Medical Specialties</span>
              </div>
            </div>

            <div className="doctors-trust-item">
              <div className="doctors-trust-icon doctors-trust-icon-green">
                <Icon type="shield" />
              </div>

              <div>
                <strong>Expert</strong>
                <span>Healthcare Professionals</span>
              </div>
            </div>

            <div className="doctors-trust-item">
              <div className="doctors-trust-icon doctors-trust-icon-pink">
                <Icon type="heart" />
              </div>

              <div>
                <strong>Patient</strong>
                <span>Focused Care</span>
              </div>
            </div>

            <div className="doctors-trust-item">
              <div className="doctors-trust-icon doctors-trust-icon-yellow">
                <Icon type="star" />
              </div>

              <div>
                <strong>Care</strong>
                <span>At Every Step</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="doctors-list-section">
        <Container>
          <div className="doctors-section-heading">
            <span className="doctors-section-label">
              OUR SPECIALISTS
            </span>

            <h2>
              Meet the people
              <strong>behind your care.</strong>
            </h2>

            <p>
              Choose from our team of medical specialists and schedule a
              consultation that fits your healthcare needs.
            </p>
          </div>

          {loading && (
            <div className="doctors-message">
              <div className="doctors-loader"></div>
              <p>Loading our medical team...</p>
            </div>
          )}

          {error && (
            <div className="doctors-message doctors-error">
              <div className="doctors-message-icon">!</div>
              <p>{error}</p>
              <span>Please refresh the page and try again.</span>
            </div>
          )}

          {!loading && !error && doctors.length === 0 && (
            <div className="doctors-message">
              <div className="doctors-message-icon">
                <Icon type="doctor" />
              </div>

              <p>No doctors are currently available.</p>
              <span>Please check again later.</span>
            </div>
          )}

          {!loading && !error && doctors.length > 0 && (
            <Row className="g-4">
              {doctors.map((doctor, index) => (
                <Col key={doctor.id} md={6} lg={4}>
                  <article
                    className={`doctor-card ${getSpecialtyClass(
                      doctor.specialization
                    )}`}
                  >
                    <div className="doctor-card-top">
                      <div className="doctor-icon">
                        <Icon
                          type={getSpecialtyIcon(
                            doctor.specialization
                          )}
                        />
                      </div>

                      <span className="doctor-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <span className="doctor-specialization">
                      {doctor.specialization}
                    </span>

                    <h3>{doctor.name}</h3>

                    <p className="doctor-description">
                      {doctor.description ||
                        "Dedicated to providing professional and compassionate healthcare."}
                    </p>

                    <div className="doctor-details">
                      <div className="doctor-detail">
                        <div className="doctor-detail-icon">
                          <Icon type="location" />
                        </div>

                        <div>
                          <span>Location</span>
                          <strong>
                            {doctor.location || "CareBridge Hospital"}
                          </strong>
                        </div>
                      </div>

                      <div className="doctor-detail">
                        <div className="doctor-detail-icon">
                          <Icon type="phone" />
                        </div>

                        <div>
                          <span>Contact</span>
                          <strong>
                            {doctor.phone || "Hospital Reception"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/appointments"
                      className="doctor-book-button"
                    >
                      <span>Book Appointment</span>
                      <Icon type="arrow" />
                    </Link>
                  </article>
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