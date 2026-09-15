// frontend/src/pages/AdminReports.js

import { useEffect, useMemo, useState } from "react";
import "./AdminReports.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8082/api";


function AdminReports() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [patientSearch, setPatientSearch] = useState("");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [selectedReport, setSelectedReport] = useState(null);

  const [editingReport, setEditingReport] = useState(null);

  const [editingDiagnosis, setEditingDiagnosis] =
    useState(false);

  const [diagnosisValue, setDiagnosisValue] =
    useState("");

  const [reportForm, setReportForm] = useState({
    treatment: "",
    notes: ""
  });

  const [processing, setProcessing] = useState(false);
  
useEffect(() => {
    loadReports();
    // loadReports is intentionally called once when the page loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  async function fetchData(endpoint) {
    const response = await fetch(
      `${API_BASE_URL}/${endpoint}`
    );

    if (!response.ok) {
      throw new Error(`Unable to load ${endpoint}.`);
    }

    return response.json();
  }

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const [
        patientsData,
        doctorsData,
        appointmentsData,
        medicalRecordsData
      ] = await Promise.all([
        fetchData("patients"),
        fetchData("doctors"),
        fetchData("appointments"),
        fetchData("medical-records")
      ]);

      setPatients(patientsData);
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
      setMedicalRecords(medicalRecordsData);

      return {
        appointments: appointmentsData,
        medicalRecords: medicalRecordsData
      };
    } catch (err) {
      setError(
        err.message || "Unable to load reports."
      );

      return null;
    } finally {
      setLoading(false);
    }
  }

  const appointmentStats = useMemo(() => {
    return {
      pending: appointments.filter(
        (appointment) =>
          appointment.status === "PENDING"
      ).length,

      confirmed: appointments.filter(
        (appointment) =>
          appointment.status === "CONFIRMED"
      ).length,

      completed: appointments.filter(
        (appointment) =>
          appointment.status === "COMPLETED"
      ).length,

      cancelled: appointments.filter(
        (appointment) =>
          appointment.status === "CANCELLED"
      ).length
    };
  }, [appointments]);

  const specializationStats = useMemo(() => {
    const counts = {};

    doctors.forEach((doctor) => {
      const specialization =
        doctor.specialization?.trim() ||
        "Not specified";

      counts[specialization] =
        (counts[specialization] || 0) + 1;
    });

    return Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    );
  }, [doctors]);

  const totalAppointments = appointments.length;

  function getPercentage(value, total) {
    if (!total) {
      return 0;
    }

    return Math.round((value / total) * 100);
  }

  const completedAppointments = useMemo(() => {
    const searchValue =
      patientSearch.trim();

    const normalizedSearch =
      searchValue.replace(/\D/g, "");

    return appointments
      .filter(
        (appointment) =>
          appointment.status === "COMPLETED"
      )
      .filter((appointment) => {
        if (!searchValue) {
          return true;
        }

        const patientId =
          String(
            appointment.patient?.id || ""
          );

        const patientPhone =
          appointment.patient?.phone
            ?.replace(/\D/g, "") || "";

        return (
          patientId === searchValue ||
          (
            normalizedSearch &&
            patientPhone === normalizedSearch
          )
        );
      })
      .sort((a, b) => {
        const dateA =
          `${a.appointmentDate || ""} ${a.appointmentTime || ""}`;

        const dateB =
          `${b.appointmentDate || ""} ${b.appointmentTime || ""}`;

        return dateB.localeCompare(dateA);
      });
  }, [appointments, patientSearch]);

  function handleSearchChange(event) {
    setPatientSearch(event.target.value);

    setSelectedAppointment(null);
    setSelectedReport(null);
    setEditingReport(null);
    setEditingDiagnosis(false);
    setDiagnosisValue("");

    setReportForm({
      treatment: "",
      notes: ""
    });

    setError("");
    setSuccess("");
  }

  function handlePatientSearch(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSelectedAppointment(null);
    setSelectedReport(null);
    setEditingReport(null);
    setEditingDiagnosis(false);

    const searchValue =
      patientSearch.trim();

    if (!searchValue) {
      return;
    }

    const normalizedSearch =
      searchValue.replace(/\D/g, "");

    const matchingAppointment =
      appointments.find((appointment) => {
        if (
          appointment.status !== "COMPLETED"
        ) {
          return false;
        }

        const patientId =
          String(
            appointment.patient?.id || ""
          );

        const patientPhone =
          appointment.patient?.phone
            ?.replace(/\D/g, "") || "";

        return (
          patientId === searchValue ||
          (
            normalizedSearch &&
            patientPhone === normalizedSearch
          )
        );
      });

    if (!matchingAppointment) {
      setError(
        "No completed consultations found for that Patient ID or mobile number."
      );
    }
  }

  function getReportForAppointment(appointmentId) {
    return medicalRecords.find(
      (record) =>
        record.appointment?.id === appointmentId
    );
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "—";
    }

    const date = new Date(
      `${dateString}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function openGenerateForm(appointment) {
    setSelectedAppointment(appointment);
    setSelectedReport(null);
    setEditingReport(null);
    setEditingDiagnosis(false);
    setDiagnosisValue(
      appointment.diagnosis || ""
    );

    setReportForm({
      treatment: "",
      notes: ""
    });

    setError("");
    setSuccess("");
  }

  function openViewReport(report) {
    setSelectedReport(report);
    setSelectedAppointment(null);
    setEditingReport(null);
    setEditingDiagnosis(false);
    setDiagnosisValue("");

    setReportForm({
      treatment: "",
      notes: ""
    });

    setError("");
    setSuccess("");
  }

  function openEditReport(report) {
    setEditingReport(report);
    setSelectedReport(null);
    setSelectedAppointment(null);
    setEditingDiagnosis(false);
    setDiagnosisValue(
      report.diagnosis || ""
    );

    setReportForm({
      treatment: report.treatment || "",
      notes: report.notes || ""
    });

    setError("");
    setSuccess("");
  }

  function closeReportPanel() {
    setSelectedAppointment(null);
    setSelectedReport(null);
    setEditingReport(null);
    setEditingDiagnosis(false);
    setDiagnosisValue("");

    setReportForm({
      treatment: "",
      notes: ""
    });

    setError("");
    setSuccess("");
  }

  function handleReportFormChange(event) {
    const { name, value } = event.target;

    setReportForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function startDiagnosisEdit() {
    if (!selectedAppointment) {
      return;
    }

    setDiagnosisValue(
      selectedAppointment.diagnosis || ""
    );

    setEditingDiagnosis(true);
    setError("");
    setSuccess("");
  }

  function cancelDiagnosisEdit() {
    setDiagnosisValue(
      selectedAppointment?.diagnosis || ""
    );

    setEditingDiagnosis(false);
    setError("");
  }

  async function handleDiagnosisUpdate() {
    if (!selectedAppointment) {
      return;
    }

    const trimmedDiagnosis =
      diagnosisValue.trim();

    if (!trimmedDiagnosis) {
      setError("Please enter the diagnosis.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/appointments/${selectedAppointment.id}/diagnosis`,
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
        throw new Error(
          await parseErrorResponse(response)
        );
      }

      const updatedAppointment =
        await response.json();

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === updatedAppointment.id
            ? updatedAppointment
            : appointment
        )
      );

      setSelectedAppointment(
        updatedAppointment
      );

      setDiagnosisValue(
        updatedAppointment.diagnosis || ""
      );

      setEditingDiagnosis(false);

      setSuccess(
        "Diagnosis updated successfully."
      );

      const refreshedData =
        await loadReports();

      if (refreshedData) {
        const refreshedAppointment =
          refreshedData.appointments.find(
            (appointment) =>
              appointment.id ===
              updatedAppointment.id
          );

        if (refreshedAppointment) {
          setSelectedAppointment(
            refreshedAppointment
          );

          setDiagnosisValue(
            refreshedAppointment.diagnosis || ""
          );
        }
      }
    } catch (err) {
      setError(
        err.message ||
        "Unable to update diagnosis."
      );
    } finally {
      setProcessing(false);
    }
  }

  async function parseErrorResponse(response) {
    const text = await response.text();

    if (!text) {
      return "Unable to complete the request.";
    }

    try {
      const data = JSON.parse(text);

      return (
        data.message ||
        data.error ||
        text
      );
    } catch {
      return text;
    }
  }

  async function handleGenerateReport(event) {
    event.preventDefault();

    if (!selectedAppointment) {
      return;
    }

    const diagnosis =
      selectedAppointment.diagnosis?.trim();

    if (!diagnosis) {
      setError(
        "Diagnosis is not available for this completed consultation. Complete the consultation with a diagnosis first."
      );
      return;
    }

    if (!reportForm.treatment.trim()) {
      setError(
        "Please enter the treatment."
      );
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/medical-records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            appointmentId:
              selectedAppointment.id,
            diagnosis,
            treatment:
              reportForm.treatment,
            notes:
              reportForm.notes
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          await parseErrorResponse(response)
        );
      }

      await loadReports();

      setSelectedAppointment(null);

      setReportForm({
        treatment: "",
        notes: ""
      });

      setSuccess(
        "Medical report generated successfully."
      );
    } catch (err) {
      setError(
        err.message ||
        "Unable to generate medical report."
      );
    } finally {
      setProcessing(false);
    }
  }

  async function handleEditReport(event) {
    event.preventDefault();

    if (!editingReport) {
      return;
    }

    const appointmentId =
      editingReport.appointment?.id;

    if (!appointmentId) {
      setError(
        "Appointment information is unavailable."
      );
      return;
    }

    if (!reportForm.treatment.trim()) {
      setError(
        "Please enter the treatment."
      );
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/medical-records/${editingReport.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            appointmentId,
            diagnosis:
              editingReport.diagnosis,
            treatment:
              reportForm.treatment,
            notes:
              reportForm.notes
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          await parseErrorResponse(response)
        );
      }

      await loadReports();

      setEditingReport(null);

      setReportForm({
        treatment: "",
        notes: ""
      });

      setSuccess(
        "Medical report updated successfully."
      );
    } catch (err) {
      setError(
        err.message ||
        "Unable to update medical report."
      );
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <main className="admin-reports-page">
        <section className="admin-reports-header">
          <div>
            <span className="admin-page-label">
              CAREBRIDGE ADMINISTRATION
            </span>

            <h1>Reports</h1>

            <p>
              View hospital activity and management
              statistics.
            </p>
          </div>
        </section>

        <section className="admin-reports-content">
          <div className="reports-state">
            Loading hospital reports...
          </div>
        </section>
      </main>
    );
  }

  if (
    error &&
    completedAppointments.length === 0 &&
    appointments.length === 0
  ) {
    return (
      <main className="admin-reports-page">
        <section className="admin-reports-header">
          <div>
            <span className="admin-page-label">
              CAREBRIDGE ADMINISTRATION
            </span>

            <h1>Reports</h1>

            <p>
              View hospital activity and management
              statistics.
            </p>
          </div>
        </section>

        <section className="admin-reports-content">
          <div className="admin-message admin-error">
            {error}
          </div>

          <button
            type="button"
            className="reports-retry-button"
            onClick={loadReports}
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-reports-page">
      <section className="admin-reports-header">
        <div>
          <span className="admin-page-label">
            CAREBRIDGE ADMINISTRATION
          </span>

          <h1>Reports</h1>

          <p>
            View hospital activity and medical
            consultation reports.
          </p>
        </div>
      </section>

      <section className="admin-reports-content">
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

        <div className="report-summary-grid">
          <div className="report-summary-card">
            <div className="report-summary-icon">P</div>

            <div>
              <span>Total Patients</span>
              <strong>{patients.length}</strong>
            </div>
          </div>

          <div className="report-summary-card">
            <div className="report-summary-icon">D</div>

            <div>
              <span>Total Doctors</span>
              <strong>{doctors.length}</strong>
            </div>
          </div>

          <div className="report-summary-card">
            <div className="report-summary-icon">A</div>

            <div>
              <span>Total Appointments</span>
              <strong>{appointments.length}</strong>
            </div>
          </div>

          <div className="report-summary-card">
            <div className="report-summary-icon">M</div>

            <div>
              <span>Medical Reports</span>
              <strong>{medicalRecords.length}</strong>
            </div>
          </div>
        </div>

        <div className="reports-grid">
          <section className="report-card">
            <div className="report-card-header">
              <div>
                <span>APPOINTMENT ACTIVITY</span>
                <h2>Appointment Status</h2>
              </div>

              <div className="report-card-total">
                {totalAppointments}
              </div>
            </div>

            <div className="status-report-list">
              <div className="status-report-item">
                <div className="status-report-heading">
                  <span>Pending</span>
                  <strong>
                    {appointmentStats.pending}
                  </strong>
                </div>

                <div className="report-progress">
                  <div
                    className="report-progress-bar pending-progress"
                    style={{
                      width: `${getPercentage(
                        appointmentStats.pending,
                        totalAppointments
                      )}%`
                    }}
                  />
                </div>

                <small>
                  {getPercentage(
                    appointmentStats.pending,
                    totalAppointments
                  )}
                  % of appointments
                </small>
              </div>

              <div className="status-report-item">
                <div className="status-report-heading">
                  <span>Confirmed</span>
                  <strong>
                    {appointmentStats.confirmed}
                  </strong>
                </div>

                <div className="report-progress">
                  <div
                    className="report-progress-bar confirmed-progress"
                    style={{
                      width: `${getPercentage(
                        appointmentStats.confirmed,
                        totalAppointments
                      )}%`
                    }}
                  />
                </div>

                <small>
                  {getPercentage(
                    appointmentStats.confirmed,
                    totalAppointments
                  )}
                  % of appointments
                </small>
              </div>

              <div className="status-report-item">
                <div className="status-report-heading">
                  <span>Completed</span>
                  <strong>
                    {appointmentStats.completed}
                  </strong>
                </div>

                <div className="report-progress">
                  <div
                    className="report-progress-bar completed-progress"
                    style={{
                      width: `${getPercentage(
                        appointmentStats.completed,
                        totalAppointments
                      )}%`
                    }}
                  />
                </div>

                <small>
                  {getPercentage(
                    appointmentStats.completed,
                    totalAppointments
                  )}
                  % of appointments
                </small>
              </div>

              <div className="status-report-item">
                <div className="status-report-heading">
                  <span>Cancelled</span>
                  <strong>
                    {appointmentStats.cancelled}
                  </strong>
                </div>

                <div className="report-progress">
                  <div
                    className="report-progress-bar cancelled-progress"
                    style={{
                      width: `${getPercentage(
                        appointmentStats.cancelled,
                        totalAppointments
                      )}%`
                    }}
                  />
                </div>

                <small>
                  {getPercentage(
                    appointmentStats.cancelled,
                    totalAppointments
                  )}
                  % of appointments
                </small>
              </div>
            </div>
          </section>

          <section className="report-card">
            <div className="report-card-header">
              <div>
                <span>MEDICAL TEAM</span>
                <h2>Doctors by Specialization</h2>
              </div>

              <div className="report-card-total">
                {doctors.length}
              </div>
            </div>

            {specializationStats.length === 0 ? (
              <div className="reports-empty">
                No doctor specialization data available.
              </div>
            ) : (
              <div className="specialization-list">
                {specializationStats.map(
                  ([specialization, count]) => (
                    <div
                      className="specialization-item"
                      key={specialization}
                    >
                      <div className="specialization-heading">
                        <span>{specialization}</span>
                        <strong>{count}</strong>
                      </div>

                      <div className="specialization-progress">
                        <div
                          className="specialization-progress-bar"
                          style={{
                            width: `${getPercentage(
                              count,
                              doctors.length
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        </div>

        <section className="medical-report-management">
          <div className="medical-report-management-header">
            <div>
              <span>MEDICAL REPORTS</span>

              <h2>Consultation Reports</h2>

              <p>
                All completed consultations are listed
                below. Use search to quickly find a
                specific patient.
              </p>
            </div>
          </div>

          <form
            className="patient-report-search"
            onSubmit={handlePatientSearch}
          >
            <div className="patient-report-search-field">
              <label htmlFor="patientSearch">
                Search by Patient ID or Mobile Number
              </label>

              <input
                id="patientSearch"
                type="text"
                value={patientSearch}
                onChange={handleSearchChange}
                placeholder="Enter Patient ID or mobile number"
              />
            </div>

            <button
              type="submit"
              className="report-search-button"
            >
              Search
            </button>
          </form>

          {patientSearch.trim() && (
            <div className="searched-patient-card">
              <div>
                <span>SEARCH FILTER</span>

                <h3>
                  {completedAppointments.length} completed
                  consultation
                  {completedAppointments.length === 1
                    ? ""
                    : "s"}
                  found
                </h3>
              </div>

              <div className="searched-patient-details">
                <div>
                  <small>Search</small>

                  <strong>
                    {patientSearch.trim()}
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="consultation-history">
            <div className="consultation-history-header">
              <div>
                <span>COMPLETED CONSULTATIONS</span>

                <h3>
                  {patientSearch.trim()
                    ? "Filtered Consultation History"
                    : "All Consultation History"}
                </h3>
              </div>

              <strong>
                {completedAppointments.length}
              </strong>
            </div>

            {completedAppointments.length === 0 ? (
              <div className="reports-empty">
                {patientSearch.trim()
                  ? "No completed consultations found for that Patient ID or mobile number."
                  : "No completed consultations are available."}
              </div>
            ) : (
              <div className="consultation-table-wrapper">
                <table className="consultation-table">
                  <thead>
                    <tr>
                      <th>Appointment</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Consultation Date</th>
                      <th>Status</th>
                      <th>Report</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {completedAppointments.map(
                      (appointment) => {
                        const report =
                          getReportForAppointment(
                            appointment.id
                          );

                        return (
                          <tr key={appointment.id}>
                            <td>
                              <strong>
                                #{appointment.id}
                              </strong>
                            </td>

                            <td>
                              <div className="report-doctor-cell">
                                <strong>
                                  {appointment.patient
                                    ?.name ||
                                    "Unknown Patient"}
                                </strong>

                                <small>
                                  ID #
                                  {appointment.patient
                                    ?.id || "—"}
                                </small>
                              </div>
                            </td>

                            <td>
                              <div className="report-doctor-cell">
                                <strong>
                                  {appointment.doctor
                                    ?.name ||
                                    "Unknown Doctor"}
                                </strong>

                                <small>
                                  {appointment.doctor
                                    ?.specialization ||
                                    ""}
                                </small>
                              </div>
                            </td>

                            <td>
                              {formatDate(
                                appointment.appointmentDate
                              )}
                            </td>

                            <td>
                              <span className="completed-report-status">
                                COMPLETED
                              </span>
                            </td>

                            <td>
                              {report ? (
                                <span className="report-generated-status">
                                  GENERATED
                                </span>
                              ) : (
                                <span className="report-pending-status">
                                  NOT GENERATED
                                </span>
                              )}
                            </td>

                            <td>
                              <div className="report-actions">
                                {report ? (
                                  <>
                                    <button
                                      type="button"
                                      className="report-view-button"
                                      onClick={() =>
                                        openViewReport(
                                          report
                                        )
                                      }
                                    >
                                      View Report
                                    </button>

                                    <button
                                      type="button"
                                      className="report-edit-button"
                                      onClick={() =>
                                        openEditReport(
                                          report
                                        )
                                      }
                                    >
                                      Edit Report
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className="report-generate-button"
                                    onClick={() =>
                                      openGenerateForm(
                                        appointment
                                      )
                                    }
                                  >
                                    Generate Report
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedAppointment && (
            <section className="report-form-card">
              <div className="report-form-header">
                <div>
                  <span>GENERATE MEDICAL REPORT</span>

                  <h3>
                    Consultation #
                    {selectedAppointment.id}
                  </h3>
                </div>

                <button
                  type="button"
                  className="report-close-button"
                  onClick={closeReportPanel}
                >
                  ×
                </button>
              </div>

              <div className="report-readonly-grid">
                <div>
                  <small>Patient</small>

                  <strong>
                    {selectedAppointment.patient?.name ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <small>Patient ID</small>

                  <strong>
                    #
                    {selectedAppointment.patient?.id ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <small>Doctor</small>

                  <strong>
                    {selectedAppointment.doctor?.name ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <small>Consultation Date</small>

                  <strong>
                    {formatDate(
                      selectedAppointment.appointmentDate
                    )}
                  </strong>
                </div>
              </div>

              <div className="report-diagnosis-section">
                <div className="report-diagnosis-heading">
                  <label>
                    Diagnosis
                  </label>

                  {!editingDiagnosis && (
                    <button
                      type="button"
                      className="report-diagnosis-edit-button"
                      onClick={startDiagnosisEdit}
                      disabled={processing}
                    >
                      Edit Diagnosis
                    </button>
                  )}
                </div>

                {!editingDiagnosis ? (
                  <div
                    className="report-readonly-diagnosis"
                    aria-label="Diagnosis from completed consultation"
                  >
                    {selectedAppointment.diagnosis?.trim() ||
                      "Diagnosis not available"}
                  </div>
                ) : (
                  <div className="report-diagnosis-editor">
                    <textarea
                      value={diagnosisValue}
                      onChange={(event) =>
                        setDiagnosisValue(
                          event.target.value
                        )
                      }
                      rows="4"
                      autoFocus
                      placeholder="Enter diagnosis"
                      disabled={processing}
                    />

                    <div className="report-diagnosis-editor-actions">
                      <button
                        type="button"
                        className="report-diagnosis-cancel-button"
                        onClick={cancelDiagnosisEdit}
                        disabled={processing}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="report-diagnosis-save-button"
                        onClick={handleDiagnosisUpdate}
                        disabled={processing}
                      >
                        {processing
                          ? "Saving..."
                          : "Save Diagnosis"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleGenerateReport}>
                <div className="report-form-field">
                  <label htmlFor="generateTreatment">
                    Treatment
                  </label>

                  <textarea
                    id="generateTreatment"
                    name="treatment"
                    value={reportForm.treatment}
                    onChange={handleReportFormChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="report-form-field">
                  <label htmlFor="generateNotes">
                    Notes
                  </label>

                  <textarea
                    id="generateNotes"
                    name="notes"
                    value={reportForm.notes}
                    onChange={handleReportFormChange}
                    rows="4"
                  />
                </div>

                <div className="report-form-actions">
                  <button
                    type="button"
                    className="report-cancel-button"
                    onClick={closeReportPanel}
                    disabled={processing}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="report-submit-button"
                    disabled={processing}
                  >
                    {processing
                      ? "Generating..."
                      : "Generate Report"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {selectedReport && (
            <section className="report-view-card">
              <div className="report-view-header">
                <div>
                  <span>MEDICAL REPORT</span>

                  <h3>
                    Consultation #
                    {selectedReport.appointment?.id}
                  </h3>
                </div>

                <button
                  type="button"
                  className="report-close-button"
                  onClick={closeReportPanel}
                >
                  ×
                </button>
              </div>

              <div className="report-view-details">
                <div>
                  <small>Patient</small>

                  <strong>
                    {selectedReport.appointment?.patient
                      ?.name || "—"}
                  </strong>
                </div>

                <div>
                  <small>Patient ID</small>

                  <strong>
                    #
                    {selectedReport.appointment?.patient
                      ?.id || "—"}
                  </strong>
                </div>

                <div>
                  <small>Doctor</small>

                  <strong>
                    {selectedReport.appointment?.doctor
                      ?.name || "—"}
                  </strong>
                </div>

                <div>
                  <small>Consultation Date</small>

                  <strong>
                    {formatDate(
                      selectedReport.appointment
                        ?.appointmentDate
                    )}
                  </strong>
                </div>
              </div>

              <div className="report-content">
                <div>
                  <span>Diagnosis</span>

                  <p>
                    {selectedReport.diagnosis ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <span>Treatment</span>

                  <p>
                    {selectedReport.treatment ||
                      "Not provided"}
                  </p>
                </div>

                <div>
                  <span>Notes</span>

                  <p>
                    {selectedReport.notes ||
                      "No additional notes."}
                  </p>
                </div>
              </div>

              <div className="report-form-actions">
                <button
                  type="button"
                  className="report-cancel-button"
                  onClick={closeReportPanel}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="report-submit-button"
                  onClick={() =>
                    openEditReport(selectedReport)
                  }
                >
                  Edit Report
                </button>
              </div>
            </section>
          )}

          {editingReport && (
            <section className="report-form-card">
              <div className="report-form-header">
                <div>
                  <span>EDIT MEDICAL REPORT</span>

                  <h3>
                    Consultation #
                    {editingReport.appointment?.id}
                  </h3>
                </div>

                <button
                  type="button"
                  className="report-close-button"
                  onClick={closeReportPanel}
                >
                  ×
                </button>
              </div>

              <div className="report-readonly-grid">
                <div>
                  <small>Patient</small>

                  <strong>
                    {editingReport.appointment?.patient
                      ?.name || "—"}
                  </strong>
                </div>

                <div>
                  <small>Patient ID</small>

                  <strong>
                    #
                    {editingReport.appointment?.patient
                      ?.id || "—"}
                  </strong>
                </div>

                <div>
                  <small>Doctor</small>

                  <strong>
                    {editingReport.appointment?.doctor
                      ?.name || "—"}
                  </strong>
                </div>

                <div>
                  <small>Consultation Date</small>

                  <strong>
                    {formatDate(
                      editingReport.appointment
                        ?.appointmentDate
                    )}
                  </strong>
                </div>
              </div>

              <div className="report-diagnosis-section">
                <div className="report-diagnosis-heading">
                  <label>
                    Diagnosis
                  </label>

                  <span className="report-diagnosis-source">
                    From consultation
                  </span>
                </div>

                <div className="report-readonly-diagnosis">
                  {editingReport.diagnosis ||
                    "Not provided"}
                </div>
              </div>

              <form onSubmit={handleEditReport}>
                <div className="report-form-field">
                  <label htmlFor="editTreatment">
                    Treatment
                  </label>

                  <textarea
                    id="editTreatment"
                    name="treatment"
                    value={reportForm.treatment}
                    onChange={handleReportFormChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="report-form-field">
                  <label htmlFor="editNotes">
                    Notes
                  </label>

                  <textarea
                    id="editNotes"
                    name="notes"
                    value={reportForm.notes}
                    onChange={handleReportFormChange}
                    rows="4"
                  />
                </div>

                <div className="report-form-actions">
                  <button
                    type="button"
                    className="report-cancel-button"
                    onClick={closeReportPanel}
                    disabled={processing}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="report-submit-button"
                    disabled={processing}
                  >
                    {processing
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>
          )}
        </section>

        <section className="report-overview-card">
          <div>
            <span>HOSPITAL OVERVIEW</span>

            <h2>Current Activity</h2>

            <p>
              CareBridge currently has{" "}
              <strong>{patients.length}</strong>{" "}
              registered patients,{" "}
              <strong>{doctors.length}</strong> doctors,
              <strong> {appointments.length}</strong>{" "}
              appointments, and{" "}
              <strong>{medicalRecords.length}</strong>{" "}
              medical reports.
            </p>
          </div>

          <button
            type="button"
            className="reports-refresh-button"
            onClick={loadReports}
          >
            Refresh Reports
          </button>
        </section>
      </section>
    </main>
  );
}

export default AdminReports;