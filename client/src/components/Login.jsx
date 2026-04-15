import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiPhone, FiLock, FiLogOut, FiArrowRight, FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import api from '../api';
import './Login.css';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phoneNumber: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const loadingToast = toast.loading(t('auth.toast_logging_in'));

        try {
            const response = await api.post('/auth/login', formData);
            const { token, user } = response.data;

            // Store token
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success(t('auth.toast_login_success', { name: user.name }), { id: loadingToast });

            // Redirect based on role
            setTimeout(() => {
                switch (user.role) {
                    case 'worker':
                        navigate('/dashboard/worker');
                        break;
                    case 'manager':
                        navigate('/dashboard/manager');
                        break;
                    case 'admin':
                        navigate('/dashboard/admin');
                        break;
                    default:
                        navigate('/');
                }
            }, 500);
        } catch (err) {
            const message = err.response?.data?.message || t('auth.toast_login_error');
            toast.error(message, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <FiShield />
                        <span>{t('app.title')}</span>
                    </div>
                    <p>{t('auth.login_subtitle')}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="phoneNumber">{t('auth.label_phone')}</label>
                        <div className="input-wrapper">
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder={t('auth.placeholder_phone')}
                                autoComplete="tel"
                                disabled={loading}
                            />
                            <FiPhone className="input-icon" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">{t('auth.label_password')}</label>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder={t('auth.placeholder_password')}
                                autoComplete="current-password"
                                disabled={loading}
                            />
                            <FiLock className="input-icon" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="loading-spinner"></div>
                                <span>{t('auth.btn_logging_in')}</span>
                            </>
                        ) : (
                            <>
                                <span>{t('auth.btn_login')}</span>
                                <FiArrowRight />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    {t('auth.text_no_account')}
                    <span
                        className="register-link"
                        onClick={() => navigate('/register')}
                    >
                        {t('auth.link_register')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
