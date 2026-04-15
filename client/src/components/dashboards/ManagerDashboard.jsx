import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiClock, FiCheckCircle, FiZap, FiClipboard, FiUserPlus, FiSearch, FiBarChart2, FiAlertOctagon, FiMap, FiCheck, FiPhone } from 'react-icons/fi';
import axios from 'axios';
import '../../dashboard.css';
import { useTranslation } from 'react-i18next';

const ManagerDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem('token');

    const [dashboardStats, setDashboardStats] = useState({
        totalWorkers: 0,
        pendingGrievances: 0,
        resolvedGrievances: 0,
        urgentGrievances: 0
    });

    const [sosAlerts, setSosAlerts] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [alertToResolve, setAlertToResolve] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/workers/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDashboardStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        const fetchSOS = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/sos/alerts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSosAlerts(response.data);
            } catch (error) {
                console.error('Error fetching SOS alerts:', error);
            }
        };

        const fetchRecentActivities = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/grievances/manager', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Get top 5 recent grievances
                setRecentActivities(response.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching recent activities:', error);
            }
        };

        const fetchPendingVerifications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/workers/pending-verifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPendingVerifications(response.data);
            } catch (error) {
                console.error('Error fetching verifications:', error);
            }
        };

        if (token) {
            fetchStats();
            fetchSOS();
            fetchRecentActivities();
            fetchPendingVerifications();
            // Polling for SOS alerts every 30 seconds
            const interval = setInterval(fetchSOS, 30000);
            return () => clearInterval(interval);
        }
    }, [token]);


    const handleSOSResolve = async (alertId) => {
        try {
            await axios.patch(`http://localhost:5000/api/sos/resolve/${alertId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSosAlerts(sosAlerts.filter(a => a._id !== alertId));
            setAlertToResolve(null);
            toast.success(t('manager.toast_sos_resolved', 'SOS Alert resolved.'));
        } catch (error) {
            console.error('SOS Resolution Error:', error);
            toast.error(t('manager.toast_sos_error', 'Failed to resolve SOS alert.'));
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return t('time.just_now', 'Just now');
        if (diffInSeconds < 3600) return t('time.m_ago', { count: Math.floor(diffInSeconds / 60) });
        if (diffInSeconds < 86400) return t('time.h_ago', { count: Math.floor(diffInSeconds / 3600) });
        return date.toLocaleDateString();
    };

    const stats = [
        { label: t('manager.stat_total_workers', 'Total Workers'), value: dashboardStats.totalWorkers.toString(), icon: <FiUsers />, color: 'var(--accent-color)' },
        { label: t('manager.stat_pending_grievances', 'Pending Grievances'), value: dashboardStats.pendingGrievances.toString(), icon: <FiClock />, color: '#f59e0b' },
        { label: t('manager.stat_resolved_mtd', 'Resolved (MTD)'), value: dashboardStats.resolvedGrievances.toString(), icon: <FiCheckCircle />, color: '#10b981' }
    ];

    const managementActions = [
        { title: t('manager.qa_grievances_title', 'Manage Grievances'), desc: t('manager.qa_grievances_desc', 'Review and resolve worker complaints'), icon: <FiClipboard />, path: '/manager/grievances' },
        { title: t('manager.qa_verify_emp_title', 'Verify Employment'), desc: t('manager.qa_verify_emp_desc', 'Approve worker company submissions'), icon: <FiCheckCircle />, path: '/manager/verifications' },
        { title: t('manager.qa_register_worker_title', 'Register Worker'), desc: t('manager.qa_register_worker_desc', 'Onboard new migrant workers'), icon: <FiUserPlus />, path: '/register' },
        { title: t('manager.qa_directory_title', 'Worker Directory'), desc: t('manager.qa_directory_desc', 'Search and view worker profiles'), icon: <FiSearch />, path: '/manager/workers' },
        { title: t('manager.qa_report_title', 'Performance Report'), desc: t('manager.qa_report_desc', 'Submit monthly welfare and task reports'), icon: <FiBarChart2 />, path: '/manager/submit-report' }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>{t('manager.welcome_title')}</h1>
                    <p>{t('manager.welcome_subtitle', { name: user?.fullName || 'Manager' })}</p>
                </div>
            </div>

            <div className="stat-grid">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card">
                        <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                        <div className="stat-info">
                            <div className="stat-label">{stat.label}</div>
                            <div className="stat-value">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {sosAlerts.length > 0 && (
                <div className="dashboard-section sos-alerts-section">
                    <h2 className="section-title" style={{ color: '#ef4444' }}><FiAlertOctagon /> {t('manager.section_sos_alerts')}</h2>
                    <div className="sos-alerts-grid">
                        {sosAlerts.map(alert => (
                            <div key={alert._id} className="sos-alert-card">
                                <div className="sos-alert-header">
                                    <div className="alert-badge">{t('manager.sos_badge')}</div>
                                    <span className="alert-time">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <h3>{alert.workerId?.fullName}</h3>
                                <p className="alert-meta">{t('manager.label_phone')}: {alert.workerId?.phoneNumber}</p>
                                <div className="alert-actions">
                                    <a
                                        href={`https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="map-btn"
                                    >
                                        <FiMap /> {t('manager.btn_view_location')}
                                    </a>
                                    <a href={`tel:${alert.workerId?.phoneNumber}`} className="call-btn">
                                        <FiPhone /> {t('manager.btn_call')}
                                    </a>
                                    <button className="resolve-sos-btn" onClick={() => setAlertToResolve(alert)}>
                                        <FiCheck /> {t('manager.btn_resolve')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="dashboard-section">
                <h2 className="section-title">{t('manager.section_management_tools')}</h2>
                <div className="dashboard-grid">
                    {managementActions.map((action, idx) => (
                        <div key={idx} className="action-tile" onClick={() => action.path !== '#' && navigate(action.path)}>
                            <div className="tile-icon">{action.icon}</div>
                            <h3>{action.title}</h3>
                            <p>{action.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="dashboard-section">
                <h2 className="section-title">{t('manager.section_recent_activity')}</h2>
                <div className="dashboard-card" style={{ padding: 0 }}>
                    <div className="table-container" style={{ marginTop: 0 }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>{t('manager.table_worker_name')}</th>
                                    <th>{t('manager.table_grievance')}</th>
                                    <th>{t('manager.table_time')}</th>
                                    <th>{t('manager.table_status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity) => (
                                        <tr
                                            key={activity._id}
                                            onClick={() => navigate('/manager/grievances')}
                                            style={{ cursor: 'pointer' }}
                                            className="activity-row"
                                        >
                                            <td> {activity.worker?.fullName || 'Unknown'}</td>
                                            <td>{activity.title}</td>
                                            <td>{formatTimeAgo(activity.updatedAt)}</td>
                                            <td>
                                                <span className={`status-badge status-${activity.status.replace(' ', '-')}`}>
                                                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>{t('manager.table_empty')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SOS Resolution Confirmation Modal */}
            {alertToResolve && (
                <div className="modal-overlay" onClick={() => setAlertToResolve(null)}>
                    <div className="premium-modal resolve-alert-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-lottie-placeholder">
                            <div className="safety-bg-icon">
                                <FiCheckCircle />
                            </div>
                        </div>
                        <div className="modal-content-center">
                            <h2>{t('manager.modal_resolve_title')}</h2>
                            <p>{t('manager.modal_resolve_desc', { name: alertToResolve.workerId?.fullName })}</p>
                            <div className="safety-warning">
                                <FiZap className="warning-icon" />
                                <span>{t('manager.modal_resolve_warning')}</span>
                            </div>
                        </div>
                        <div className="modal-actions-vertical">
                            <button className="confirm-resolve-btn" onClick={() => handleSOSResolve(alertToResolve._id)}>
                                {t('manager.btn_confirm_resolve')}
                            </button>
                            <button className="cancel-resolve-btn" onClick={() => setAlertToResolve(null)}>
                                {t('manager.btn_cancel_resolve')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;

