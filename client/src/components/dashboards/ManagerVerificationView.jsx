import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiClock, FiCheck, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../../dashboard.css';

const ManagerVerificationView = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [pendingVerifications, setPendingVerifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingVerifications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/workers/pending-verifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingVerifications(response.data);
        } catch (error) {
            console.error('Error fetching verifications:', error);
            toast.error('Failed to load pending verifications.');
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

    const handleApproveAll = async () => {
        if (pendingVerifications.length === 0) return;
        if (!window.confirm(`Are you sure you want to approve all ${pendingVerifications.length} submissions?`)) return;

        try {
            const response = await axios.post('http://localhost:5000/api/workers/verify-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingVerifications([]);
            toast.success(response.data.message);
        } catch (error) {
            console.error('Bulk Approval Error:', error);
            toast.error(error.response?.data?.message || 'Failed to approve all submissions.');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <div className="welcome-section">
                    <button className="back-btn" onClick={() => navigate('/dashboard/manager')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>
                        <FiArrowLeft /> Back to Dashboard
                    </button>
                    <h1>Employment Verifications</h1>
                    <p>Review and approve worker employment submissions in your district.</p>
                </div>
                {pendingVerifications.length > 0 && (
                    <button
                        className="btn-primary"
                        style={{ width: 'auto', background: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={handleApproveAll}
                    >
                        <FiCheck /> Approve All {pendingVerifications.length}
                    </button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="loader"></div>
                    <p>Loading pending verifications...</p>
                </div>
            ) : pendingVerifications.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <FiCheckCircle size={48} style={{ color: 'var(--success-color)', marginBottom: '1rem' }} />
                    <h3>All Clear!</h3>
                    <p>There are no pending employment verification requests in your district.</p>
                </div>
            ) : (
                <div className="dashboard-card" style={{ padding: 0 }}>
                    <div className="table-container" style={{ marginTop: 0 }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Worker</th>
                                    <th>Company</th>
                                    <th>Role</th>
                                    <th>Supervisor</th>
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
                                        <td>{worker.currentEmployment.companyName}</td>
                                        <td>{worker.currentEmployment.role}</td>
                                        <td>{worker.currentEmployment.supervisorNumber}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn-primary"
                                                    style={{ padding: '0.4rem 0.8rem', width: 'auto', background: 'var(--success-color)' }}
                                                    onClick={() => handleVerification(worker._id, 'verify')}
                                                    title="Approve"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn-secondary"
                                                    style={{ padding: '0.4rem 0.8rem', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}
                                                    onClick={() => handleVerification(worker._id, 'reject')}
                                                    title="Reject"
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

export default ManagerVerificationView;
