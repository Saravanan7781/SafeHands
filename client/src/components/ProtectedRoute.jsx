import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard if they try to access a route they aren't allowed to
        const dashboardPath = user.role === 'admin' ? '/dashboard/admin' :
            user.role === 'manager' ? '/dashboard/manager' :
                '/dashboard/worker';
        return <Navigate to={dashboardPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
