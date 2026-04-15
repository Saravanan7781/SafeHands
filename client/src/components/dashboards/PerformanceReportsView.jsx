import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiFileText, FiArrowLeft, FiUser, FiMapPin, FiCalendar, FiDownload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../dashboard.css';

const PerformanceReportsView = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/reports', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(response.data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [token]);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <div className="welcome-section">
                    <button className="back-btn" onClick={() => navigate('/dashboard/admin')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', padding: '0.5rem 0' }}>
                        <FiArrowLeft /> {t('admin.btn_back')}
                    </button>
                    <h1>{t('admin.reports_title')}</h1>
                    <p>{t('admin.reports_subtitle')}</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="loader"></div>
                    <p>{t('admin.loading_reports')}</p>
                </div>
            ) : reports.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <FiFileText size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                    <h3>{t('admin.empty_reports_title')}</h3>
                    <p>{t('admin.empty_reports_desc')}</p>
                </div>
            ) : (
                <div className="dashboard-grid">
                    {reports.map(report => (
                        <div key={report._id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                                        <FiFileText />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{report.title}</h3>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <FiCalendar size={14} /> {t('admin.submitted_on', { date: new Date(report.submittedAt).toLocaleDateString() })}
                                        </span>
                                    </div>
                                </div>
                                <span className="status-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>{report.month}</span>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                                <div style={{ marginBottom: '0.5rem' }}><strong>{t('admin.label_tasks_completed')}</strong> {report.tasksCompleted}</div>
                                <div><strong>{t('admin.label_welfare_status')}</strong> {report.welfareMetrics}</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                                        <FiUser size={14} /> {report.managerId?.fullName}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                                        <FiMapPin size={14} /> {report.district}
                                    </div>
                                </div>
                                {report.fileUrl && (
                                    <a
                                        href={`http://localhost:5000${report.fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary"
                                        style={{
                                            marginLeft: 'auto',
                                            padding: '0.4rem 0.8rem',
                                            width: 'auto',
                                            fontSize: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            textDecoration: 'none',
                                            color: '#0369a1',
                                            background: '#e0f2fe'
                                        }}
                                    >
                                        <FiDownload /> {t('admin.btn_excel_data')}
                                    </a>
                                )}
                                {!report.fileUrl && (
                                    <button className="btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', width: 'auto', fontSize: '0.8rem' }} disabled>
                                        {t('admin.btn_no_data')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PerformanceReportsView;
