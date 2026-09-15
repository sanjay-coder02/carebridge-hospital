// src/components/ProtectedRoute.js

import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const isAuthenticated =
        sessionStorage.getItem(
            "carebridgeAdminAuthenticated"
        ) === "true";

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;