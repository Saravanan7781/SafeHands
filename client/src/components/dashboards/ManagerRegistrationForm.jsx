import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUserPlus, FiArrowLeft, FiUser, FiPhone, FiLock, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ManagerRegistrationForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        password: '',
        currentDistrict: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/admin/register-manager', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(t('admin.toast_onboard_success'));
            navigate('/dashboard/admin');
        } catch (error) {
            console.error('Error registering manager:', error);
            toast.error(error.response?.data?.message || t('admin.toast_onboard_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
            <div style={{ maxWidth: '440px', width: '100%', marginBottom: '0.8rem' }}>
                <button
                    onClick={() => navigate('/dashboard/admin')}
                    style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                    <FiArrowLeft /> {t('admin.btn_back_short')}
                </button>
            </div>

            <div style={{
                maxWidth: '440px',
                width: '100%',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                padding: '1.75rem 2rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        background: '#eff6ff',
                        color: 'var(--primary-color)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.8rem',
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1)'
                    }}>
                        <FiUserPlus />
                    </div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: '#1e293b' }}>{t('admin.onboard_title')}</h2>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{t('admin.onboard_subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>{t('admin.label_fullname')}</label>
                        <div style={{ position: 'relative' }}>
                            <FiUser style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder={t('admin.placeholder_fullname')}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem 0.8rem 0.6rem 2.2rem',
                                    borderRadius: '8px',
                                    border: '1.5px solid #e2e8f0',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>{t('admin.label_contact_region')}</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                            <div style={{ position: 'relative' }}>
                                <FiPhone style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    required
                                    pattern="[0-9]{10}"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder={t('admin.placeholder_phone')}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem 0.8rem 0.6rem 2.2rem',
                                        borderRadius: '8px',
                                        border: '1.5px solid #e2e8f0',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <FiMapPin style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    name="currentDistrict"
                                    required
                                    value={formData.currentDistrict}
                                    onChange={handleChange}
                                    placeholder={t('admin.placeholder_district')}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem 0.8rem 0.6rem 2.2rem',
                                        borderRadius: '8px',
                                        border: '1.5px solid #e2e8f0',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>{t('admin.label_password')}</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                name="password"
                                required
                                minLength="6"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={t('admin.placeholder_password_hint')}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem 0.8rem 0.6rem 2.2rem',
                                    borderRadius: '8px',
                                    border: '1.5px solid #e2e8f0',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '0.4rem' }}>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                            }}
                        >
                            {loading ? (
                                t('admin.btn_onboarding')
                            ) : (
                                <>
                                    <FiUserPlus /> {t('admin.btn_onboard')}
                                </>
                            )}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.8rem' }}>
                            {t('admin.text_authorized_action')}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManagerRegistrationForm;
