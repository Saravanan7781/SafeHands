import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiClock, FiCheck, FiArrowLeft, FiAlertCircle, FiMapPin } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../../dashboard.css';

const AdminVerificationView = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingVerifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/pending-verifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingVerifications(response.data);
        } catch (error) {
            console.error('Error fetching verifications:', error);
            toast.error('Failed to load global verifications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPendingVerifications();
        }
    }, [token]);

    const handleVerification = async (workerId, action) => {
        try {
            // Admin can use the same endpoint, backend logic handles it if token is admin
            await axios.post('http://localhost:5000/api/workers/verify-employment',
                { workerId, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPendingVerifications(pendingVerifications.filter(v => v._id !== workerId));
            toast.success(`Employment ${action === 'verify' ? 'approved' : action}ed successfully.`);
        } catch (error) {
            console.error('Verification Error:', error);
            toast.error('Failed to process verification.');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <div className="welcome-section">
                    <button className="back-btn" onClick={() => navigate('/dashboard/admin')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>
                        <FiArrowLeft /> Back to Admin Dashboard
                    </button>
                    <h1>Global Employment Verifications</h1>
                    <p>Administrative override to approve worker company submissions across all districts.</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="loader"></div>
                    <p>Scanning all districts for pending requests...</p>
                </div>
            ) : pendingVerifications.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <FiCheckCircle size={48} style={{ color: 'var(--success-color)', marginBottom: '1rem' }} />
                    <h3>No pending requests</h3>
                    <p>All worker submissions across all districts have been processed.</p>
                </div>
            ) : (
                <div className="dashboard-card" style={{ padding: 0 }}>
                    <div className="table-container" style={{ marginTop: 0 }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Worker</th>
                                    <th>District</th>
                                    <th>Company</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingVerifications.map(worker => (
                                    <tr key={worker._id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{worker.fullName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{worker.phoneNumber}</div>
                                        </td>
                                        <td>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <FiMapPin size={14} /> {worker.currentDistrict}
                                            </span>
                                        </td>
                                        <td>{worker.currentEmployment.companyName}</td>
                                        <td>{worker.currentEmployment.role}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn-primary"
                                                    style={{ padding: '0.4rem 0.8rem', width: 'auto', background: 'var(--success-color)' }}
                                                    onClick={() => handleVerification(worker._id, 'verify')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn-secondary"
                                                    style={{ padding: '0.4rem 0.8rem', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}
                                                    onClick={() => handleVerification(worker._id, 'reject')}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVerificationView;
