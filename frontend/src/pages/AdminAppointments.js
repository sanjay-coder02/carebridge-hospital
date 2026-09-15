// src/pages/AdminAppointments.js

import { useEffect, useRef, useState } from "react";
import "./AdminAppointments.css";

const API_URL =
  `${process.env.REACT_APP_API_URL || "http://localhost:8082/api"}/appointments`;

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [completionAppointment, setCompletionAppointment] =
    useState(null);

  const [editingDiagnosisAppointment, setEditingDiagnosisAppointment] =
    useState(null);

  const [diagnosis, setDiagnosis] = useState("");

  const completionFormRef = useRef(null);
  const diagnosisEditFormRef = useRef(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load appointments.");
      }

      const data = await response.json();

      setAppointments(data);
    } catch (err) {
      setError(
        err.message || "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateAppointmentStatus(id, action) {
    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${id}/${action}`,
        {
          method: "POST"
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || `Unable to ${action} appointment.`
        );
      }

      await loadAppointments();

      if (action === "confirm") {
        setSuccess(
          "Appointment confirmed successfully."
        );
      } else {
        setSuccess(
          "Appointment cancelled successfully."
        );
      }
    } catch (err) {
      setError(
        err.message ||
        `Unable to ${action} appointment.`
      );
    } finally {
      setProcessingId(null);
    }
  }

  function openCompletionForm(appointment) {
    setCompletionAppointment(appointment);
    setEditingDiagnosisAppointment(null);
    setDiagnosis("");
    setError("");
    setSuccess("");

    setTimeout(() => {
      completionFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }

  function openDiagnosisEditForm(appointment) {
    setEditingDiagnosisAppointment(appointment);
    setCompletionAppointment(null);
    setDiagnosis(
      appointment.diagnosis || ""
    );
    setError("");
    setSuccess("");

    setTimeout(() => {
      diagnosisEditFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }

  function closeForms() {
    setCompletionAppointment(null);
    setEditingDiagnosisAppointment(null);
    setDiagnosis("");
  }

  async function handleComplete(event) {
    event.preventDefault();

    if (!completionAppointment) {
      return;
    }

    const trimmedDiagnosis =
      diagnosis.trim();

    if (!trimmedDiagnosis) {
      setError("Please enter the diagnosis.");
      return;
    }

    const appointmentId =
      completionAppointment.id;

    try {
      setProcessingId(appointmentId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${appointmentId}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            diagnosis: trimmedDiagnosis
          })
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
          "Unable to mark consultation as completed."
        );
      }

      await loadAppointments();

      closeForms();

      setSuccess(
        "Consultation completed and diagnosis saved successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } catch (err) {
      setError(
        err.message ||
        "Unable to mark consultation as completed."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDiagnosisUpdate(event) {
    event.preventDefault();

    if (!editingDiagnosisAppointment) {
      return;
    }

    const trimmedDiagnosis =
      diagnosis.trim();

    if (!trimmedDiagnosis) {
      setError("Please enter the diagnosis.");
      return;
    }

    const appointmentId =
      editingDiagnosisAppointment.id;

    try {
      setProcessingId(appointmentId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${appointmentId}/diagnosis`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            diagnosis: trimmedDiagnosis
          })
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message ||
          "Unable to update diagnosis."
        );
      }

      await loadAppointments();

      closeForms();

      setSuccess(
        "Diagnosis updated successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } catch (err) {
      setError(
        err.message ||
        "Unable to update diagnosis."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Unable to delete appointment."
        );
      }

      setAppointments((current) =>
        current.filter(
          (appointment) => appointment.id !== id
        )
      );

      setSuccess(
        "Appointment deleted successfully."
      );
    } catch (err) {
      setError(
        err.message ||
        "Unable to delete appointment."
      );
    } finally {
      setProcessingId(null);
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "CONFIRMED":
        return "status-confirmed";

      case "CANCELLED":
        return "status-cancelled";

      case "COMPLETED":
        return "status-completed";

      default:
        return "status-pending";
    }
  }

  return (
    <main className="admin-appointments-page">
      <section className="admin-appointments-header">
        <div>
          <span className="admin-page-label">
            CAREBRIDGE ADMINISTRATION
          </span>

          <h1>Appointments</h1>

          <p>
            Review, confirm and manage patient appointments.
          </p>
        </div>

        <div className="appointment-count">
          {appointments.length}{" "}
          {appointments.length === 1
            ? "Appointment"
            : "Appointments"}
        </div>
      </section>

      <section className="admin-appointments-content">
        {error && (
          <div className="admin-message admin-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-message admin-success">
            {success}
          </div>
        )}

        {completionAppointment && (
          <section
            ref={completionFormRef}
            className="diagnosis-form-card"
          >
            <div className="diagnosis-form-header">
              <div>
                <span>
                  COMPLETE CONSULTATION
                </span>

                <h2>
                  Appointment #
                  {completionAppointment.id}
                </h2>

                <p>
                  Record the diagnosis from the
                  completed consultation.
                </p>
              </div>

              <button
                type="button"
                className="diagnosis-close-button"
                onClick={closeForms}
                disabled={
                  processingId ===
                  completionAppointment.id
                }
              >
                ×
              </button>
            </div>

            <div className="diagnosis-patient-grid">
              <div>
                <small>Patient</small>

                <strong>
                  {completionAppointment.patient?.name ||
                    "Unknown Patient"}
                </strong>
              </div>

              <div>
                <small>Doctor</small>

                <strong>
                  {completionAppointment.doctor?.name ||
                    "Unknown Doctor"}
                </strong>
              </div>

              <div>
                <small>Consultation Date</small>

                <strong>
                  {completionAppointment.appointmentDate ||
                    "—"}
                </strong>
              </div>
            </div>

            <form
              className="diagnosis-form"
              onSubmit={handleComplete}
            >
              <div className="diagnosis-field">
                <label htmlFor="consultationDiagnosis">
                  Diagnosis
                </label>

                <textarea
                  id="consultationDiagnosis"
                  value={diagnosis}
                  onChange={(event) =>
                    setDiagnosis(event.target.value)
                  }
                  placeholder="Enter the diagnosis from the consultation"
                  rows="5"
                  required
                />

                <span>
                  This diagnosis will be saved to the
                  patient's consultation record.
                </span>
              </div>

              <div className="diagnosis-form-actions">
                <button
                  type="button"
                  className="diagnosis-cancel-button"
                  onClick={closeForms}
                  disabled={
                    processingId ===
                    completionAppointment.id
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="diagnosis-save-button"
                  disabled={
                    processingId ===
                    completionAppointment.id
                  }
                >
                  {processingId ===
                  completionAppointment.id
                    ? "Saving..."
                    : "Mark Consultation Completed"}
                </button>
              </div>
            </form>
          </section>
        )}

        {editingDiagnosisAppointment && (
          <section
            ref={diagnosisEditFormRef}
            className="diagnosis-form-card"
          >
            <div className="diagnosis-form-header">
              <div>
                <span>
                  EDIT DIAGNOSIS
                </span>

                <h2>
                  Appointment #
                  {editingDiagnosisAppointment.id}
                </h2>

                <p>
                  Update the diagnosis recorded for
                  this completed consultation.
                </p>
              </div>

              <button
                type="button"
                className="diagnosis-close-button"
                onClick={closeForms}
                disabled={
                  processingId ===
                  editingDiagnosisAppointment.id
                }
              >
                ×
              </button>
            </div>

            <div className="diagnosis-patient-grid">
              <div>
                <small>Patient</small>

                <strong>
                  {editingDiagnosisAppointment.patient
                    ?.name ||
                    "Unknown Patient"}
                </strong>
              </div>

              <div>
                <small>Doctor</small>

                <strong>
                  {editingDiagnosisAppointment.doctor
                    ?.name ||
                    "Unknown Doctor"}
                </strong>
              </div>

              <div>
                <small>Status</small>

                <strong>COMPLETED</strong>
              </div>
            </div>

            <form
              className="diagnosis-form"
              onSubmit={handleDiagnosisUpdate}
            >
              <div className="diagnosis-field">
                <label htmlFor="editConsultationDiagnosis">
                  Diagnosis
                </label>

                <textarea
                  id="editConsultationDiagnosis"
                  value={diagnosis}
                  onChange={(event) =>
                    setDiagnosis(event.target.value)
                  }
                  rows="5"
                  required
                />

                <span>
                  Saving changes will also update the
                  diagnosis in an existing medical report.
                </span>
              </div>

              <div className="diagnosis-form-actions">
                <button
                  type="button"
                  className="diagnosis-cancel-button"
                  onClick={closeForms}
                  disabled={
                    processingId ===
                    editingDiagnosisAppointment.id
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="diagnosis-save-button"
                  disabled={
                    processingId ===
                    editingDiagnosisAppointment.id
                  }
                >
                  {processingId ===
                  editingDiagnosisAppointment.id
                    ? "Saving..."
                    : "Save Diagnosis"}
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="appointments-card">
          <div className="appointments-card-header">
            <div>
              <span>APPOINTMENT MANAGEMENT</span>

              <h2>Appointment Information</h2>
            </div>

            <div className="appointments-total">
              {appointments.length}
            </div>
          </div>

          {loading ? (
            <div className="appointments-state">
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="appointments-state">
              No appointments found.
            </div>
          ) : (
            <div className="appointments-table-wrapper">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => {
                    const isProcessing =
                      processingId === appointment.id;

                    const status =
                      appointment.status || "PENDING";

                    return (
                      <tr key={appointment.id}>
                        <td>
                          <strong>
                            #{appointment.id}
                          </strong>
                        </td>

                        <td>
                          <div className="patient-cell">
                            <strong>
                              {appointment.patient?.name ||
                                "Unknown Patient"}
                            </strong>

                            <small>
                              {appointment.patient?.phone ||
                                "No phone"}
                            </small>
                          </div>
                        </td>

                        <td>
                          <div className="doctor-cell">
                            <strong>
                              {appointment.doctor?.name ||
                                "Unknown Doctor"}
                            </strong>

                            <small>
                              {appointment.doctor
                                ?.specialization || ""}
                            </small>
                          </div>
                        </td>

                        <td>
                          {appointment.appointmentDate}
                        </td>

                        <td>
                          {appointment.appointmentTime}
                        </td>

                        <td>
                          <span className="reason-cell">
                            {appointment.reason || "—"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`appointment-status ${getStatusClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>
                          <div className="appointment-actions">
                            {status === "PENDING" && (
                              <>
                                <button
                                  type="button"
                                  className="confirm-button"
                                  disabled={isProcessing}
                                  onClick={() =>
                                    updateAppointmentStatus(
                                      appointment.id,
                                      "confirm"
                                    )
                                  }
                                >
                                  Confirm
                                </button>

                                <button
                                  type="button"
                                  className="cancel-button"
                                  disabled={isProcessing}
                                  onClick={() =>
                                    updateAppointmentStatus(
                                      appointment.id,
                                      "cancel"
                                    )
                                  }
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {status === "CONFIRMED" && (
                              <button
                                type="button"
                                className="complete-button"
                                disabled={isProcessing}
                                onClick={() =>
                                  openCompletionForm(
                                    appointment
                                  )
                                }
                              >
                                Mark Consultation Completed
                              </button>
                            )}

                            {status === "COMPLETED" && (
                              <button
                                type="button"
                                className="edit-diagnosis-button"
                                disabled={isProcessing}
                                onClick={() =>
                                  openDiagnosisEditForm(
                                    appointment
                                  )
                                }
                              >
                                Edit Diagnosis
                              </button>
                            )}

                            {status === "CANCELLED" && (
                              <button
                                type="button"
                                className="delete-button"
                                disabled={isProcessing}
                                onClick={() =>
                                  handleDelete(
                                    appointment.id
                                  )
                                }
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminAppointments;