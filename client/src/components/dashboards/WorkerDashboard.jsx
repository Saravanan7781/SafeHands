import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiStar, FiAlertTriangle, FiEdit3, FiUser, FiBook, FiMapPin, FiBell, FiClock, FiAlertOctagon } from 'react-icons/fi';
import api from '../../api';
import '../../dashboard.css';
import { useTranslation } from 'react-i18next';

const WorkerDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [grievanceStats, setGrievanceStats] = useState({ pending: 0, underReview: 0, resolved: 0 });
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/grievances/worker');
                const grievances = response.data;
                const pending = grievances.filter(g => g.status === 'pending').length;
                const underReview = grievances.filter(g => g.status === 'under review').length;
                const resolved = grievances.filter(g => g.status === 'resolved').length;
                setGrievanceStats({ pending, underReview, resolved });
            } catch (err) {
                console.error("Failed to fetch grievance stats", err);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        {
            label: t('worker.stat_active_grievances', 'Active Grievances'),
            value: grievanceStats.pending.toString(),
            icon: <FiAlertTriangle />,
            color: '#ef4444',
            clickable: true
        },
        {
            label: t('worker.stat_under_review', 'Under Review'),
            value: grievanceStats.underReview.toString(),
            icon: <FiClock />,
            color: '#f59e0b',
            clickable: true
        },
        {
            label: t('worker.stat_resolved_grievances', 'Resolved Grievances'),
            value: grievanceStats.resolved.toString(),
            icon: <FiCheckCircle />,
            color: '#10b981',
            clickable: true
        }
    ];

    const quickActions = [
        { title: t('worker.qa_file_grievance_title', 'File Grievance'), desc: t('worker.qa_file_grievance_desc', 'Report an issue or complaint'), icon: <FiEdit3 />, path: '/file-grievance' },
        { title: t('worker.qa_id_card_title', 'My ID Card'), desc: t('worker.qa_id_card_desc', 'View your digital ID'), icon: <FiUser />, path: '/profile' },
        { title: t('worker.qa_works_title', 'Works'), desc: t('worker.qa_works_desc', 'Upskill'), icon: <FiBook />, path: '#' },
        { title: t('worker.qa_sos_title', 'Emergency SOS'), desc: t('worker.qa_sos_desc', 'Instant help in emergency'), icon: <FiAlertOctagon style={{ color: '#ef4444' }} />, path: '/sos' },
        { title: t('worker.qa_help_title', 'Help Center'), desc: t('worker.qa_help_desc', 'Find nearby support offices'), icon: <FiMapPin />, path: '#' }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>{t('worker.welcome_title', { name: user?.fullName || 'Worker' })}</h1>
                    <p>{t('worker.welcome_subtitle')}</p>
                </div>
                {/* <div className="page-actions">
                    <button className="btn-secondary" onClick={() => navigate('/profile')}>View Profile</button>
                    <button className="btn-primary" onClick={() => navigate('/file-grievance')}>New Grievance</button>
                </div> */}
            </div>

            <div className="stat-grid">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className={`stat-card ${stat.clickable ? 'clickable-stat' : ''}`}
                        onClick={() => stat.clickable && navigate('/worker/grievances')}
                        style={{ cursor: stat.clickable ? 'pointer' : 'default' }}
                    >
                        <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                        <div className="stat-info">
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-value">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-section">
                <h2 className="section-title">{t('worker.section_quick_actions')}</h2>
                <div className="dashboard-grid">
                    {quickActions.map((action, idx) => (
                        <div key={idx} className="action-tile" onClick={() => action.path !== '#' && navigate(action.path)}>
                            <div className="tile-icon">{action.icon}</div>
                            <h3>{action.title}</h3>
                            <p>{action.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="dashboard-section">
                <h2 className="section-title">{t('worker.section_latest_updates')}</h2>
                <div className="dashboard-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '2rem', color: 'var(--primary-color)' }}><FiBell /></div>
                    <div>
                        <h3 className="card-title">{t('worker.update_title')}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{t('worker.update_desc')}</p>
                    </div>
                </div>
            </div>

            <style>{`
                .clickable-stat:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    border-color: var(--primary-color);
                }
                .clickable-stat {
                    transition: all 0.3s ease;
                    border: 1px solid transparent;
                }
            `}</style>
        </div>
    );
};

export default WorkerDashboard;

