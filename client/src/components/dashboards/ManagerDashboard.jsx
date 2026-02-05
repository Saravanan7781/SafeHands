import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiClock, FiCheckCircle, FiZap, FiClipboard, FiUserPlus, FiSearch, FiBarChart2 } from 'react-icons/fi';
import '../../dashboard.css';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const stats = [
        { label: 'Total Workers', value: '124', icon: <FiUsers />, color: 'var(--accent-color)' },
        { label: 'Pending Grievances', value: '12', icon: <FiClock />, color: '#f59e0b' },
        { label: 'Resolved (MTD)', value: '45', icon: <FiCheckCircle />, color: '#10b981' },
        { label: 'High Priority', value: '3', icon: <FiZap />, color: '#ef4444' }
    ];

    const managementActions = [
        { title: 'Manage Grievances', desc: 'Review and resolve worker complaints', icon: <FiClipboard />, path: '/manager/grievances' },
        { title: 'Register Worker', desc: 'Onboard new migrant workers', icon: <FiUserPlus />, path: '/register' },
        { title: 'Worker Directory', desc: 'Search and view worker profiles', icon: <FiSearch />, path: '#' },
        { title: 'Performance Reports', desc: 'Monthly welfare and task reports', icon: <FiBarChart2 />, path: '#' }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Manager Console</h1>
                    <p>Welcome back, {user?.fullName || 'Manager'}. You have 3 urgent items requiring attention.</p>
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
                <h2 className="section-title">Management Tools</h2>
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
                <h2 className="section-title">Recent Activity</h2>
                <div className="dashboard-card">
                    <div className="table-container" style={{ marginTop: 0 }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Worker Name</th>
                                    <th>Action</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Rahul Kumar</td>
                                    <td>Filed Grievance (Wage)</td>
                                    <td>2 hours ago</td>
                                    <td><span className="status-badge status-pending">New</span></td>
                                </tr>
                                <tr>
                                    <td>Sunil Verma</td>
                                    <td>Profile Update</td>
                                    <td>5 hours ago</td>
                                    <td><span className="status-badge status-completed">Verified</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;

