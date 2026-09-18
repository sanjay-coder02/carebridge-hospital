
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import NavigationBar from "./components/Navbar.js";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute.js";

import Home from "./pages/Home.js";
import Doctors from "./pages/Doctors.js";
import BookAppointment from "./pages/BookAppointment.js";
import CancelAppointment from "./pages/CancelAppointment.js";
import AppointmentConfirmation from "./pages/AppointmentConfirmation.js";
import AppointmentStatus from "./pages/AppointmentStatus.js";
import PatientMedicalRecords from "./pages/PatientMedicalRecords";

import AdminLogin from "./pages/AdminLogin.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import AdminPatients from "./pages/AdminPatients";
import AdminDoctors from "./pages/AdminDoctors";
import AdminAppointments from "./pages/AdminAppointments.js";
import AdminReports from "./pages/AdminReports";

function App() {
    return (
        <BrowserRouter>
            <NavigationBar />

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/doctors"
                    element={<Doctors />}
                />

                <Route
                    path="/appointments"
                    element={<BookAppointment />}
                />

                <Route
                    path="/appointments/cancel"
                    element={<CancelAppointment />}
                />

                <Route
                    path="/appointments/confirmation"
                    element={<AppointmentConfirmation />}
                />

                <Route
                    path="/appointments/status"
                    element={<AppointmentStatus />}
                />

                <Route
                    path="/medical-records"
                    element={<PatientMedicalRecords />}
                />

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/patients"
                        element={<AdminPatients />}
                    />

                    <Route
                        path="/admin/doctors"
                        element={<AdminDoctors />}
                    />

                    <Route
                        path="/admin/appointments"
                        element={<AdminAppointments />}
                    />

                    <Route
                        path="/admin/reports"
                        element={<AdminReports />}
                    />
                </Route>
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;