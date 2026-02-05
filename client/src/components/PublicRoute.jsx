import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        // Already logged in, redirect to dashboard
        const dashboardPath = user.role === 'admin' ? '/dashboard/admin' :
            user.role === 'manager' ? '/dashboard/manager' :
                '/dashboard/worker';
        return <Navigate to={dashboardPath} replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
