// frontend/src/pages/AdminDoctors.js

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import "./AdminDoctors.css";

const API_URL =
  `${process.env.REACT_APP_API_URL || "http://localhost:8082/api"}/doctors`;

const emptyDoctor = {
  name: "",
  specialization: "",
  phone: "",
  email: "",
  location: "",
};

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(emptyDoctor);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load doctors.");
      }

      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      setError(err.message || "Unable to load doctors.");
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingId(null);
    setDoctor(emptyDoctor);
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function openEditModal(selectedDoctor) {
    setEditingId(selectedDoctor.id);

    setDoctor({
      name: selectedDoctor.name || "",
      specialization: selectedDoctor.specialization || "",
      phone: selectedDoctor.phone || "",
      email: selectedDoctor.email || "",
      location: selectedDoctor.location || "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingId(null);
    setDoctor(emptyDoctor);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setDoctor((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!doctor.name.trim()) {
      setError("Doctor name is required.");
      return;
    }

    if (!doctor.specialization) {
      setError("Please select a specialization.");
      return;
    }

    if (!doctor.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: doctor.name.trim(),
        specialization: doctor.specialization,
        phone: doctor.phone.trim(),
        email: doctor.email.trim(),
        location: doctor.location.trim(),
      };

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to save doctor.");
      }

      await loadDoctors();

      setSuccess(
        editingId
          ? "Doctor updated successfully."
          : "Doctor added successfully."
      );

      setShowModal(false);
      setDoctor(emptyDoctor);
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Unable to save doctor.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to delete doctor.");
      }

      setDoctors((current) =>
        current.filter((item) => item.id !== id)
      );

      setSuccess("Doctor deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete doctor.");
    }
  }

  return (
    <main className="admin-doctors-page">
      <section className="admin-doctors-header">
        <Container>
          <Row className="align-items-center g-4">
            <Col>
              <span className="admin-doctors-label">
                CAREBRIDGE ADMINISTRATION
              </span>

              <h1>Doctors</h1>

              <p>
                Manage medical professionals and their hospital information.
              </p>
            </Col>

            <Col xs="auto">
              <Button
                className="admin-doctors-add-button"
                onClick={openAddModal}
              >
                + Add Doctor
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="admin-doctors-content">
        <Container>
          {error && !showModal && (
            <Alert
              variant="danger"
              onClose={() => setError("")}
              dismissible
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              variant="success"
              onClose={() => setSuccess("")}
              dismissible
            >
              {success}
            </Alert>
          )}

          <div className="doctors-table-card">
            <div className="doctors-table-heading">
              <div>
                <span>MEDICAL PROFESSIONALS</span>
                <h2>Doctor Information</h2>
              </div>

              <div className="doctor-count">
                {doctors.length} Doctors
              </div>
            </div>

            {loading ? (
              <div className="doctors-empty-state">
                <p>Loading doctors...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="doctors-empty-state">
                <strong>No doctors found</strong>
                <p>
                  Add your first doctor using the button above.
                </p>
              </div>
            ) : (
              <div className="doctors-table-wrapper">
                <Table responsive hover className="doctors-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Doctor</th>
                      <th>Specialization</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {doctors.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span className="doctor-id">
                            #{item.id}
                          </span>
                        </td>

                        <td>
                          <strong>{item.name}</strong>
                        </td>

                        <td>
                          <span className="specialization-badge">
                            {item.specialization}
                          </span>
                        </td>

                        <td>{item.phone}</td>

                        <td>{item.email || "—"}</td>

                        <td>{item.location || "—"}</td>

                        <td>
                          <div className="doctor-actions">
                            <Button
                              className="edit-doctor-button"
                              size="sm"
                              onClick={() => openEditModal(item)}
                            >
                              Edit
                            </Button>

                            <Button
                              className="delete-doctor-button"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Container>
      </section>

      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit Doctor" : "Add Doctor"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && (
              <Alert
                variant="danger"
                onClose={() => setError("")}
                dismissible
              >
                {error}
              </Alert>
            )}

            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Doctor Name</Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    value={doctor.name}
                    onChange={handleChange}
                    placeholder="Enter doctor name"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Specialization</Form.Label>

                  <Form.Select
                    name="specialization"
                    value={doctor.specialization}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select specialization
                    </option>

                    <option value="General Physician">
                      General Physician
                    </option>

                    <option value="Cardiology">
                      Cardiology
                    </option>

                    <option value="Neurology">
                      Neurology
                    </option>

                    <option value="Orthopedics">
                      Orthopedics
                    </option>

                    <option value="Pediatrics">
                      Pediatrics
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>

                  <Form.Control
                    type="tel"
                    name="phone"
                    value={doctor.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={doctor.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>

                  <Form.Control
                    type="text"
                    name="location"
                    value={doctor.location}
                    onChange={handleChange}
                    placeholder="City / Location"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="light"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              className="save-doctor-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Doctor"
                  : "Add Doctor"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </main>
  );
}

export default AdminDoctors;  