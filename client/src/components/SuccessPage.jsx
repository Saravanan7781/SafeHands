import React from 'react';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.data;

    if (!data) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="container">
            <div className="success-banner">
                <h2>Registration Successful</h2>
                <p>The worker's details have been securely recorded in the government database.</p>
            </div>

            <div className="id-card-container">
                <div style={{ marginBottom: '1.5rem' }}>
                    <img src="https://ui-avatars.com/api/?name=Safe+Hands&background=0f172a&color=fff&size=64" alt="Logo" style={{ borderRadius: '50%' }} />
                </div>

                <div className="id-label">Migrant Worker ID</div>
                <div className="id-value">
                    {data.migrantId}
                </div>

                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    This ID is a permanent unique identifier. Please save a copy or take a screenshot for future welfare benefits processing.
                </p>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <Link to="/register" style={{ width: '100%', maxWidth: '250px' }}>
                    <button className="btn-primary" style={{ width: '100%' }}>Register Another Worker</button>
                </Link>
                <button
                    className="btn-secondary"
                    onClick={() => {
                        const user = JSON.parse(localStorage.getItem('user'));
                        if (user?.role === 'manager') navigate('/dashboard/manager');
                        else if (user?.role === 'admin') navigate('/dashboard/admin');
                        else navigate('/');
                    }}
                    style={{ width: '100%', maxWidth: '250px' }}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
