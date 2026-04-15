import React from 'react';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SuccessPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.data;

    if (!data) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="container">
            <div className="success-banner">
                <h2>{t('success.title')}</h2>
                <p>{t('success.subtitle')}</p>
            </div>

            <div className="id-card-container">
                <div style={{ marginBottom: '1.5rem' }}>
                    <img src="https://ui-avatars.com/api/?name=Safe+Hands&background=0f172a&color=fff&size=64" alt="Logo" style={{ borderRadius: '50%' }} />
                </div>

                <div className="id-label">{t('success.id_label')}</div>
                <div className="id-value">
                    {data.migrantId}
                </div>

                <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {t('success.id_note')}
                </p>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <Link to="/register" style={{ width: '100%', maxWidth: '250px' }}>
                    <button className="btn-primary" style={{ width: '100%' }}>{t('success.btn_register_another')}</button>
                </Link>
                <button
                    className="btn-secondary"
                    onClick={() => {
                        const userText = localStorage.getItem('user');
                        const user = userText ? JSON.parse(userText) : null;
                        if (user?.role === 'manager') navigate('/dashboard/manager');
                        else if (user?.role === 'admin') navigate('/dashboard/admin');
                        else navigate('/');
                    }}
                    style={{ width: '100%', maxWidth: '250px' }}
                >
                    {t('success.btn_dashboard')}
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
