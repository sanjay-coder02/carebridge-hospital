// src/pages/Home.js

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import banner1 from "../assets/images/banner1.jpg";
import "./Home.css";

function Home() {
  const features = [
    {
      icon: "🩺",
      title: "Experienced Doctors",
      description:
        "Trusted medical professionals focused on quality and personalized patient care.",
    },
    {
      icon: "🏥",
      title: "Modern Facilities",
      description:
        "Comfortable healthcare services supported by modern facilities and technology.",
    },
    {
      icon: "❤️",
      title: "Patient First",
      description:
        "Your comfort, safety, and wellbeing remain at the center of our care.",
    },
    {
      icon: "🕐",
      title: "24/7 Support",
      description:
        "Reliable assistance whenever you need help with your healthcare journey.",
    },
  ];

  const services = [
    {
      icon: "🩺",
      title: "Patient Care",
      description:
        "Personalized healthcare services designed around individual patient needs.",
    },
    {
      icon: "📅",
      title: "Appointments",
      description:
        "Book appointments with trusted doctors quickly and conveniently.",
    },
    {
      icon: "📋",
      title: "Medical Records",
      description:
        "Keep important medical information organized and easily accessible.",
    },
    {
      icon: "❤️",
      title: "Cardiology",
      description:
        "Professional consultation and care for heart-related health concerns.",
    },
    {
      icon: "🧠",
      title: "Neurology",
      description:
        "Specialized medical support for neurological health and wellbeing.",
    },
    {
      icon: "🦴",
      title: "Orthopedics",
      description:
        "Care for bones, joints, muscles, movement, and physical wellbeing.",
    },
  ];

  return (
    <main>
      <section className="carebridge-home-intro">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <span className="home-intro-label">
                TRUSTED HEALTHCARE FOR EVERYONE
              </span>

              <h1>
                Your Health,
                <span> Our Priority.</span>
              </h1>

              <p>
                Quality healthcare with trusted medical professionals,
                compassionate service, and patient-focused care.
              </p>

              <div className="home-intro-actions">
                <Button
                  as={Link}
                  to="/appointments"
                  className="carebridge-primary-button"
                >
                  Book an Appointment
                </Button>

                <Button
                  as={Link}
                  to="/doctors"
                  variant="outline-primary"
                  className="carebridge-secondary-button"
                >
                  Meet Our Doctors
                </Button>
              </div>

              <div className="home-trust-details">
                <div>
                  <strong>24/7</strong>
                  <span>Support</span>
                </div>

                <div>
                  <strong>Expert</strong>
                  <span>Doctors</span>
                </div>

                <div>
                  <strong>Patient</strong>
                  <span>Focused Care</span>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="home-image-container">
                <div className="home-banner-wrapper">
                  <img
                    src={banner1}
                    alt="CareBridge Hospital medical team"
                    className="home-banner-image"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="carebridge-section">
        <Container>
          <div className="carebridge-section-heading">
            <span>WHY CAREBRIDGE</span>

            <h2>Healthcare You Can Rely On</h2>

            <p>
              We combine medical expertise with compassionate service to create
              a better healthcare experience.
            </p>
          </div>

          <Row className="g-4">
            {features.map((feature) => (
              <Col key={feature.title} sm={6} lg={3}>
                <Card className="carebridge-feature-card h-100">
                  <Card.Body>
                    <div className="carebridge-card-icon">
                      {feature.icon}
                    </div>

                    <Card.Title>{feature.title}</Card.Title>

                    <Card.Text>{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="carebridge-services-section">
        <Container>
          <div className="carebridge-section-heading">
            <span>OUR SERVICES</span>

            <h2>Complete Healthcare Services</h2>

            <p>
              Healthcare services designed to support you through every stage
              of your health journey.
            </p>
          </div>

          <Row className="g-4">
            {services.map((service) => (
              <Col key={service.title} sm={6} lg={4}>
                <Card className="carebridge-service-card h-100">
                  <Card.Body>
                    <div className="carebridge-card-icon">
                      {service.icon}
                    </div>

                    <Card.Title>{service.title}</Card.Title>

                    <Card.Text>{service.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="carebridge-doctors-preview">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <span>OUR MEDICAL TEAM</span>

              <h2>Meet Our Doctors</h2>

              <p>
                Experienced healthcare professionals committed to providing
                trusted and personalized medical care.
              </p>
            </Col>

            <Col md={4} className="text-md-end">
              <Button
                as={Link}
                to="/doctors"
                variant="outline-primary"
                className="view-doctors-button"
              >
                View All Doctors
              </Button>
            </Col>
          </Row>

          <Row className="g-4 mt-3">
            <Col md={4}>
              <Card className="doctor-info-card h-100">
                <Card.Body>
                  <div className="doctor-info-icon">👨‍⚕️</div>

                  <Card.Title>General Medicine</Card.Title>

                  <Card.Text>
                    Professional primary healthcare for routine consultations
                    and common health concerns.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="doctor-info-card h-100">
                <Card.Body>
                  <div className="doctor-info-icon">❤️</div>

                  <Card.Title>Cardiology</Card.Title>

                  <Card.Text>
                    Specialized cardiac consultation and support for heart
                    health.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="doctor-info-card h-100">
                <Card.Body>
                  <div className="doctor-info-icon">🧠</div>

                  <Card.Title>Neurology</Card.Title>

                  <Card.Text>
                    Dedicated neurological consultation focused on patient
                    wellbeing.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="carebridge-appointment-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <span>NEED MEDICAL CARE?</span>

              <h2>Take the First Step Toward Better Health</h2>

              <p>
                Schedule an appointment with one of our trusted healthcare
                professionals.
              </p>
            </Col>

            <Col lg={4} className="text-lg-end">
              <Button
                as={Link}
                to="/appointments"
                className="carebridge-cta-button"
              >
                Book Your Appointment
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}

export default Home;