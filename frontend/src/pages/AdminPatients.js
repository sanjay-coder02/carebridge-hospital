// frontend/src/pages/AdminPatients.js

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import "./AdminPatients.css";

const API_URL =
  `${process.env.REACT_APP_API_URL || "http://localhost:8082/api"}/patients`;

  
const emptyPatient = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  location: "",
  bloodGroup: "",
};

function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(emptyPatient);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load patients.");
      }

      const data = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err.message || "Unable to load patients.");
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingId(null);
    setPatient(emptyPatient);
    setError("");
    setSuccess("");
    setShowModal(true);
  }

  function openEditModal(selectedPatient) {
    setEditingId(selectedPatient.id);

    setPatient({
      name: selectedPatient.name || "",
      age: selectedPatient.age ?? "",
      gender: selectedPatient.gender || "",
      phone: selectedPatient.phone || "",
      email: selectedPatient.email || "",
      location: selectedPatient.location || "",
      bloodGroup: selectedPatient.bloodGroup || "",
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
    setPatient(emptyPatient);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setPatient((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!patient.name.trim()) {
      setError("Patient name is required.");
      return;
    }

    if (!patient.age || Number(patient.age) <= 0) {
      setError("Please enter a valid age.");
      return;
    }

    if (!patient.gender) {
      setError("Please select a gender.");
      return;
    }

    if (!patient.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: patient.name.trim(),
        age: Number(patient.age),
        gender: patient.gender,
        phone: patient.phone.trim(),
        email: patient.email.trim(),
        location: patient.location.trim(),
        bloodGroup: patient.bloodGroup,
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
        throw new Error(message || "Unable to save patient.");
      }

      await loadPatients();

      setSuccess(
        editingId
          ? "Patient updated successfully."
          : "Patient added successfully."
      );

      setShowModal(false);
      setPatient(emptyPatient);
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Unable to save patient.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
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
        throw new Error(message || "Unable to delete patient.");
      }

      setPatients((current) =>
        current.filter((item) => item.id !== id)
      );

      setSuccess("Patient deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete patient.");
    }
  }

  return (
    <main className="admin-patients-page">
      <section className="admin-patients-header">
        <Container>
          <Row className="align-items-center g-4">
            <Col>
              <span className="admin-page-label">
                CAREBRIDGE ADMINISTRATION
              </span>

              <h1>Patients</h1>

              <p>
                Manage registered patient information and records.
              </p>
            </Col>

            <Col xs="auto">
              <Button
                className="admin-add-button"
                onClick={openAddModal}
              >
                + Add Patient
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="admin-patients-content">
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

          <div className="patients-table-card">
            <div className="patients-table-heading">
              <div>
                <span>REGISTERED PATIENTS</span>
                <h2>Patient Information</h2>
              </div>

              <div className="patient-count">
                {patients.length} Patients
              </div>
            </div>

            {loading ? (
              <div className="patients-empty-state">
                <p>Loading patients...</p>
              </div>
            ) : patients.length === 0 ? (
              <div className="patients-empty-state">
                <strong>No patients found</strong>
                <p>
                  Add your first patient using the button above.
                </p>
              </div>
            ) : (
              <div className="patients-table-wrapper">
                <Table responsive hover className="patients-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Blood Group</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {patients.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span className="patient-id">
                            #{item.id}
                          </span>
                        </td>

                        <td>
                          <strong>{item.name}</strong>
                        </td>

                        <td>{item.age}</td>

                        <td>{item.gender}</td>

                        <td>{item.phone}</td>

                        <td>
                          {item.email || "—"}
                        </td>

                        <td>
                          {item.location || "—"}
                        </td>

                        <td>
                          <span className="blood-group">
                            {item.bloodGroup || "—"}
                          </span>
                        </td>

                        <td>
                          <div className="patient-actions">
                            <Button
                              className="edit-patient-button"
                              size="sm"
                              onClick={() => openEditModal(item)}
                            >
                              Edit
                            </Button>

                            <Button
                              className="delete-patient-button"
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
            {editingId ? "Edit Patient" : "Add Patient"}
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
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={patient.name}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={patient.age}
                    onChange={handleChange}
                    placeholder="Age"
                    min="1"
                    max="120"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={patient.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Blood Group</Form.Label>
                  <Form.Select
                    name="bloodGroup"
                    value={patient.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={patient.phone}
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
                    value={patient.email}
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
                    value={patient.location}
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
              className="save-patient-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Patient"
                  : "Add Patient"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </main>
  );
}

export default AdminPatients;