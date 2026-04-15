import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUsers, FiCheckCircle, FiUserPlus, FiSearch, FiBarChart2, FiGlobe, FiShield, FiActivity, FiMapPin, FiBriefcase } from 'react-icons/fi';
import '../../dashboard.css';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem('token');

    const [stats, setStats] = useState({
        totalWorkers: 0,
        totalManagers: 0,
        totalGrievances: 0,
        pendingGrievances: 0,
        totalReports: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        }
    }, [token]);

    const dashboardCards = [
        { label: 'Total Workers', value: stats.totalWorkers.toLocaleString(), icon: <FiUsers />, color: 'var(--accent-color)' },
        { label: 'Active Managers', value: stats.totalManagers.toLocaleString(), icon: <FiShield />, color: '#10b981' },
        { label: 'Open Grievances', value: stats.pendingGrievances.toLocaleString(), icon: <FiActivity />, color: '#ef4444' },
        { label: 'Compliance Reports', value: stats.totalReports.toLocaleString(), icon: <FiBarChart2 />, color: '#f59e0b' }
    ];

    const adminActions = [
        {
            title: t('admin.qa_adv_dashboard_title', 'Advanced Dashboard'),
            desc: t('admin.qa_adv_dashboard_desc', 'Detailed district-wise analytics'),
            icon: <FiActivity />,
            path: '/admin/analytics',
            color: 'var(--primary-color)'
        },
        {
            title: t('admin.qa_register_manager_title', 'Register Manager'),
            desc: t('admin.qa_register_manager_desc', 'Onboard new managers for districts'),
            icon: <FiUserPlus />,
            path: '/admin/register-manager',
            color: 'var(--primary-color)'
        },
        {
            title: t('admin.qa_manager_dir_title', 'Manager Directory'),
            desc: t('admin.qa_manager_dir_desc', 'Search and view manager profiles'),
            icon: <FiSearch />,
            path: '/admin/managers',
            color: 'var(--accent-color)'
        },
        {
            title: t('admin.qa_perf_reports_title', 'Performance Reports'),
            desc: t('admin.qa_perf_reports_desc', 'Monthly welfare and task reports'),
            icon: <FiBarChart2 />,
            path: '/admin/reports',
            color: '#f59e0b'
        }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                <div className="welcome-section">
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.4rem 0.8rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'inline-block' }}>Central Command</span>
                    <h1>Administrative Control</h1>
                    <p>Welcome back, {user?.fullName || 'Administrator'}. You have full oversight across all districts.</p>
                </div>
                <div className="page-actions">
                    <button className="btn-secondary" style={{ width: 'auto' }}>Export Global Data</button>
                </div>
            </div>

            <div className="stat-grid" style={{ marginBottom: '3rem' }}>
                {dashboardCards.map((card, idx) => (
                    <div key={idx} className="stat-card" style={{ borderLeft: `4px solid ${card.color}` }}>
                        <div className="stat-icon" style={{ background: `${card.color}15`, color: card.color }}>{card.icon}</div>
                        <div className="stat-info">
                            <div className="stat-label">{card.label}</div>
                            <div className="stat-value">{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-section" style={{ marginBottom: '4rem' }}>
                <h2 className="section-title">Global Management Tools</h2>
                <div className="dashboard-grid">
                    {adminActions.map((action, idx) => (
                        <div key={idx} className="action-tile" onClick={() => navigate(action.path)}>
                            <div className="tile-icon" style={{ color: action.color }}>{action.icon}</div>
                            <h3>{action.title}</h3>
                            <p>{action.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                <div className="dashboard-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 className="card-title" style={{ margin: 0 }}>System Health Overview</h3>
                        <span style={{ color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <FiActivity size={14} /> Systems Operational
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                <span>Grievance Resolution Rate</span>
                                <strong>84%</strong>
                            </div>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                                <div style={{ height: '100%', width: '84%', background: 'var(--primary-color)', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                <span>Manager Reporting Compliance</span>
                                <strong>92%</strong>
                            </div>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                                <div style={{ height: '100%', width: '92%', background: '#10b981', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                <span>Worker Enrollment (MoM)</span>
                                <strong style={{ color: 'var(--success-color)' }}>+12.4%</strong>
                            </div>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                                <div style={{ height: '100%', width: '65%', background: 'var(--accent-color)', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card" style={{ padding: '2rem' }}>
                    <h3 className="card-title">Recent System Logs</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {[
                            { msg: 'New Manager registered for Pune district', time: '14m ago', icon: <FiUserPlus /> },
                            { msg: 'Global worker sync completed', time: '2h ago', icon: <FiGlobe /> },
                            { msg: 'Security policy updated', time: '5h ago', icon: <FiShield /> },
                            { msg: 'New grievance escalation from Mumbai', time: 'Yesterday', icon: <FiActivity /> }
                        ].map((log, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.8rem', fontSize: '0.85rem', paddingBottom: '0.8rem', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                                <div style={{ color: 'var(--primary-color)', marginTop: '0.2rem' }}>{log.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{log.msg}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{log.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
