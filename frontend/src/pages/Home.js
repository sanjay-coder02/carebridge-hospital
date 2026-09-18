// frontend/src/pages/Home.js

import { Link } from "react-router-dom";
import heroImage from "../assets/images/cbbanner1.png";
import "./Home.css";

function Icon({ type }) {
  const paths = {
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c.5-3.4 2.5-5.3 6-5.3s5.5 1.9 6 5.3" />
        <circle cx="17.5" cy="9" r="2.5" />
        <path d="M16 14.2c2.8.2 4.3 1.8 4.7 4.8" />
      </>
    ),
    heart: (
      <path d="M20.8 8.8c0 5.5-8.8 10.4-8.8 10.4S3.2 14.3 3.2 8.8A5 5 0 0 1 12 5.9a5 5 0 0 1 8.8 2.9Z" />
    ),
    shield: (
      <>
        <path d="M12 3 20 6v5c0 4.8-3.3 8.5-8 10-4.7-1.5-8-5.2-8-10V6l8-3Z" />
        <path d="m8.3 12 2.3 2.3 5.1-5.1" />
      </>
    ),
    doctor: (
      <>
        <path d="M6 3v5a4 4 0 0 0 8 0V3" />
        <path d="M4 3h4M12 3h4" />
        <path d="M14 13v2a4.5 4.5 0 0 0 9 0v-1" />
        <circle cx="21" cy="11" r="2" />
        <path d="M10 20h5a4 4 0 0 0 4-4v-1" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
        <path d="M7 14h3M14 14h3M7 17h3" />
      </>
    ),
    records: (
      <>
        <path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 3v5h5M8 12h8M8 16h6" />
      </>
    ),
    pulse: (
      <>
        <path d="M3 12h4l2-5 4 10 2-5h6" />
        <path d="M12 21a9 9 0 1 0-9-9" />
      </>
    ),
    brain: (
      <>
        <path d="M9.3 4.2A3.4 3.4 0 0 0 4 7a3.5 3.5 0 0 0 .5 1.7A3.5 3.5 0 0 0 3 11.5a3.7 3.7 0 0 0 2.6 3.6A3.7 3.7 0 0 0 9 19h1V5.7a3 3 0 0 0-.7-1.5Z" />
        <path d="M14.7 4.2A3.4 3.4 0 0 1 20 7a3.5 3.5 0 0 1-.5 1.7 3.5 3.5 0 0 1 1.5 2.8 3.7 3.7 0 0 1-2.6 3.6A3.7 3.7 0 0 1 15 19h-1V5.7a3 3 0 0 1 .7-1.5Z" />
        <path d="M10 8H8M10 12H7.5M14 8h2M14 12h2.5M10 16H8.5M14 16h1.5" />
      </>
    ),
    bone: (
      <path d="M18.4 8.5a3 3 0 1 0-2.8-4.1l-8.2 8.2a3 3 0 1 0 2.8 4.1l8.2-8.2Z" />
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
      className="home-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
}

function Home() {
  const trustCards = [
    {
      icon: "doctor",
      title: "Experienced Doctors",
      text: "Qualified medical professionals dedicated to personalized patient care.",
    },
    {
      icon: "heart",
      title: "Patient First",
      text: "Your comfort, safety, and wellbeing remain at the heart of our care.",
    },
    {
      icon: "shield",
      title: "Trusted Care",
      text: "Reliable healthcare services designed around your needs.",
    },
    {
      icon: "pulse",
      title: "Modern Facilities",
      text: "A comfortable healthcare environment supported by modern technology.",
    },
  ];

  const services = [
    {
      icon: "doctor",
      number: "01",
      title: "Find a Doctor",
      text: "Explore our medical specialists and find the right doctor for your needs.",
      link: "/doctors",
      action: "Meet Our Doctors",
    },
    {
      icon: "calendar",
      number: "02",
      title: "Book Appointment",
      text: "Schedule a consultation quickly through our simple online booking system.",
      link: "/appointments",
      action: "Book Appointment",
    },
    {
      icon: "records",
      number: "03",
      title: "Medical Records",
      text: "View completed consultations and access your available medical reports.",
      link: "/medical-records",
      action: "View Records",
    },
    {
      icon: "pulse",
      number: "04",
      title: "Track Appointment",
      text: "Stay informed about your appointment from booking through consultation.",
      link: "/appointments/status",
      action: "Check Status",
    },
  ];

  const specialties = [
    {
      icon: "doctor",
      title: "General Medicine",
      text: "Primary healthcare for routine consultations and common health concerns.",
    },
    {
      icon: "pulse",
      title: "Cardiology",
      text: "Specialized consultation and support focused on heart health.",
    },
    {
      icon: "brain",
      title: "Neurology",
      text: "Dedicated neurological consultation focused on patient wellbeing.",
    },
    {
      icon: "bone",
      title: "Orthopedics",
      text: "Care for bones, joints, muscles, movement, and physical wellbeing.",
    },
  ];

  return (
    <main className="home-page">

      <section className="home-hero">
        <img
          src={heroImage}
          alt="CareBridge Hospital"
          className="home-hero-image"
        />

        <div className="home-hero-overlay"></div>

        <div className="home-hero-content">
          <div className="home-container">
            <div className="home-hero-copy">

              <div className="home-hero-label">
                <span></span>
                TRUSTED HEALTHCARE • COMPASSIONATE CARE
              </div>

              <h1>
                Your Health,
                <strong>Our Priority.</strong>
              </h1>

              <p>
                Quality healthcare, experienced doctors, and patient-focused
                services — bringing trusted care closer to you.
              </p>

              <div className="home-hero-buttons">
                <Link
                  to="/appointments"
                  className="home-button home-button-primary"
                >
                  Book an Appointment
                  <Icon type="arrow" />
                </Link>

                <Link
                  to="/doctors"
                  className="home-button home-button-secondary"
                >
                  Meet Our Doctors
                </Link>
              </div>

              <div className="home-hero-trust">

                <div>
                  <Icon type="shield" />
                  <span>
                    <strong>Trusted Care</strong>
                    Patient focused
                  </span>
                </div>

                <div>
                  <Icon type="users" />
                  <span>
                    <strong>Expert Doctors</strong>
                    Experienced team
                  </span>
                </div>

                <div>
                  <Icon type="heart" />
                  <span>
                    <strong>Patient First</strong>
                    Compassionate care
                  </span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="home-container">
          <div className="home-stats-grid">

            <div>
              <strong>6+</strong>
              <span>Medical Specialists</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Healthcare Support</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Patient Focused</span>
            </div>

            <div>
              <strong>Care</strong>
              <span>At Every Step</span>
            </div>

          </div>
        </div>
      </section>

      <section className="home-welcome">
        <div className="home-container">

          <div className="home-welcome-grid">

            <div className="home-section-heading-left">
              <span className="home-label">
                WELCOME TO CAREBRIDGE
              </span>

              <h2>
                Healthcare built
                <strong>around people.</strong>
              </h2>

              <div className="home-heading-line"></div>
            </div>

            <div className="home-welcome-text">
              <h3>
                Healthcare should feel simple, accessible, and personal.
              </h3>

              <p>
                CareBridge Hospital brings essential healthcare services
                together in one connected experience. Find trusted doctors,
                book appointments, track consultations, and access completed
                medical records with ease.
              </p>

              <Link to="/doctors" className="home-text-link">
                Explore Our Medical Team
                <Icon type="arrow" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      <section className="home-trust">
        <div className="home-container">

          <div className="home-centered-heading">
            <span className="home-label">
              WHY CAREBRIDGE
            </span>

            <h2>
              Care you can <strong>count on.</strong>
            </h2>

            <p>
              A patient-focused healthcare experience built around trust,
              expertise, and accessibility.
            </p>
          </div>

          <div className="home-trust-grid">

            {trustCards.map((card, index) => (
              <article className="home-glass-card" key={card.title}>

                <div className="home-card-top">
                  <div className="home-card-icon">
                    <Icon type={card.icon} />
                  </div>

                  <span>0{index + 1}</span>
                </div>

                <h3>{card.title}</h3>

                <p>{card.text}</p>

              </article>
            ))}

          </div>

        </div>
      </section>

      <section className="home-services">
        <div className="home-container">

          <div className="home-services-heading">

            <div>
              <span className="home-label">
                OUR SERVICES
              </span>

              <h2>
                Everything you need,
                <strong>in one place.</strong>
              </h2>
            </div>

            <p>
              From finding a doctor to managing your consultation journey,
              CareBridge keeps your essential healthcare services simple.
            </p>

          </div>

          <div className="home-services-grid">

            {services.map((service) => (
              <article className="home-service-card" key={service.title}>

                <div className="home-service-header">
                  <div className="home-card-icon">
                    <Icon type={service.icon} />
                  </div>

                  <span>{service.number}</span>
                </div>

                <h3>{service.title}</h3>

                <p>{service.text}</p>

                <Link to={service.link}>
                  {service.action}
                  <Icon type="arrow" />
                </Link>

              </article>
            ))}

          </div>

        </div>
      </section>

      <section className="home-specialties">
        <div className="home-container">

          <div className="home-specialties-heading">

            <div>
              <span className="home-label">
                MEDICAL SPECIALTIES
              </span>

              <h2>
                The right care for
                <strong>every journey.</strong>
              </h2>
            </div>

            <Link to="/doctors" className="home-outline-button">
              View All Doctors
              <Icon type="arrow" />
            </Link>

          </div>

          <div className="home-specialties-grid">

            {specialties.map((specialty) => (
              <article
                className="home-specialty-card"
                key={specialty.title}
              >
                <div className="home-specialty-icon">
                  <Icon type={specialty.icon} />
                </div>

                <h3>{specialty.title}</h3>

                <p>{specialty.text}</p>

                <Link
                  to="/doctors"
                  className="home-specialty-arrow"
                  aria-label={`View ${specialty.title} doctors`}
                >
                  <Icon type="arrow" />
                </Link>

              </article>
            ))}

          </div>

        </div>
      </section>

      <section className="home-cta">
        <div className="home-container">

          <div className="home-cta-box">

            <div>
              <span className="home-label">
                YOUR HEALTH MATTERS
              </span>

              <h2>
                Take the first step
                <strong>towards better health.</strong>
              </h2>

              <p>
                Find a trusted doctor and schedule your consultation with
                CareBridge Hospital today.
              </p>
            </div>

          

          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;