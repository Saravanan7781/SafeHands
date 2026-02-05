import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiGlobe, FiFileText, FiShield, FiClock, FiLock, FiActivity, FiMap, FiSettings } from 'react-icons/fi';
import '../../dashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const stats = [
        { label: 'Total Enrolled', value: '14,250', icon: <FiGlobe />, color: 'var(--accent-color)' },
        { label: 'Active Grievances', value: '452', icon: <FiFileText />, color: '#f59e0b' },
        { label: 'System Health', value: '99.9%', icon: <FiShield />, color: '#10b981' },
        { label: 'Wait Time (Avg)', value: '3.2 days', icon: <FiClock />, color: 'var(--primary-light)' }
    ];

    const adminActions = [
        { title: 'User Management', desc: 'Manage roles and access control', icon: <FiLock />, path: '#' },
        { title: 'System Logs', desc: 'Audit trails and error reporting', icon: <FiActivity />, path: '#' },
        { title: 'Regional Overviews', desc: 'State and district-wise data', icon: <FiMap />, path: '#' },
        { title: 'Policy Config', desc: 'Manage grievance types and SLAs', icon: <FiSettings />, path: '#' }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Administrative Control</h1>
                    <p>Welcome, {user?.fullName || 'Administrator'}. System is operating normally across all regions.</p>
                </div>
                <div className="page-actions">
                    <button className="btn-secondary">Export Database</button>
                    <button className="btn-primary">System Settings</button>
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

            <div className="dashboard-section">
                <h2 className="section-title">Administration Tools</h2>
                <div className="dashboard-grid">
                    {adminActions.map((action, idx) => (
                        <div key={idx} className="action-tile" onClick={() => action.path !== '#' && navigate(action.path)}>
                            <div className="tile-icon">{action.icon}</div>
                            <h3>{action.title}</h3>
                            <p>{action.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="dashboard-section">
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3 className="card-title">Registration Trends</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Worker registrations increased by 12% this week compared to last week.</p>
                        <div style={{ height: '150px', background: '#f8fafc', borderRadius: '8px', marginTop: '1rem', display: 'flex', alignItems: 'flex-end', gap: '0.5rem', padding: '10px' }}>
                            {/* Simple CSS bars for visual effect */}
                            <div style={{ flex: 1, height: '40%', background: 'var(--accent-color)', borderRadius: '4px 4px 0 0' }}></div>
                            <div style={{ flex: 1, height: '60%', background: 'var(--accent-color)', borderRadius: '4px 4px 0 0' }}></div>
                            <div style={{ flex: 1, height: '55%', background: 'var(--accent-color)', borderRadius: '4px 4px 0 0' }}></div>
                            <div style={{ flex: 1, height: '80%', background: 'var(--accent-color)', borderRadius: '4px 4px 0 0' }}></div>
                            <div style={{ flex: 1, height: '70%', background: 'var(--accent-color)', borderRadius: '4px 4px 0 0' }}></div>
                            <div style={{ flex: 1, height: '90%', background: 'var(--accent-color)', borderRadius: '4px 4px 0 0' }}></div>
                            <div style={{ flex: 1, height: '95%', background: 'var(--accent-color)', borderRadius: '4px 4px 0 0' }}></div>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <h3 className="card-title">System Status</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span>API Server</span>
                                <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>Operational</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span>Database</span>
                                <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>Healthy</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                                <span>Storage</span>
                                <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>82% Free</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

