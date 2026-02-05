import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ManagerGrievanceView = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchGrievances = async () => {
        try {
            const response = await api.get('/grievances/manager');
            setGrievances(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Server error while fetching grievances');
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, [navigate]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/grievances/${id}/status`, { status: newStatus });
            // Refresh grievances
            fetchGrievances();
            if (selectedGrievance && selectedGrievance._id === id) {
                setSelectedGrievance({ ...selectedGrievance, status: newStatus });
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'under review': return 'status-under-review';
            case 'completed': return 'status-completed';
            default: return '';
        }
    };

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2>District Grievances</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Managing issues for {user?.currentDistrict} district</p>
                    </div>
                    <button onClick={() => navigate('/dashboard/manager')} className="btn-secondary">Back to Dashboard</button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Loading grievances...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : grievances.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                        <p>No grievances filed for this district.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Worker</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'center' }}>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grievances.map((grievance) => (
                                    <tr key={grievance._id}>
                                        <td>{new Date(grievance.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ fontWeight: '600' }}>{grievance.worker?.fullName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{grievance.worker?.phoneNumber}</div>
                                        </td>
                                        <td>{grievance.title}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(grievance.status)}`}>
                                                {grievance.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                className="btn-icon"
                                                onClick={() => setSelectedGrievance(grievance)}
                                                title="View Details"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Grievance Detail Modal */}
            {selectedGrievance && (
                <div className="modal-overlay" onClick={() => setSelectedGrievance(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Grievance Details</h3>
                            <button className="close-button" onClick={() => setSelectedGrievance(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="grievance-detail-item">
                                <span className="grievance-detail-label">Title</span>
                                <div className="grievance-detail-value" style={{ fontWeight: '700', fontSize: '1.25rem' }}>
                                    {selectedGrievance.title}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="grievance-detail-item">
                                    <span className="grievance-detail-label">Worker</span>
                                    <div className="grievance-detail-value">{selectedGrievance.worker?.fullName}</div>
                                </div>
                                <div className="grievance-detail-item">
                                    <span className="grievance-detail-label">Phone</span>
                                    <div className="grievance-detail-value">{selectedGrievance.worker?.phoneNumber}</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="grievance-detail-item">
                                    <span className="grievance-detail-label">Date Filed</span>
                                    <div className="grievance-detail-value">{new Date(selectedGrievance.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="grievance-detail-item">
                                    <span className="grievance-detail-label">Current Status</span>
                                    <div>
                                        <span className={`status-badge ${getStatusClass(selectedGrievance.status)}`}>
                                            {selectedGrievance.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grievance-detail-item">
                                <span className="grievance-detail-label">Description</span>
                                <div className="grievance-detail-value" style={{
                                    background: '#f8fafc',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {selectedGrievance.description}
                                </div>
                            </div>

                            <div className="grievance-detail-item" style={{ marginTop: '2rem' }}>
                                <span className="grievance-detail-label">Update Status</span>
                                <select
                                    className="form-control"
                                    value={selectedGrievance.status}
                                    onChange={(e) => handleStatusChange(selectedGrievance._id, e.target.value)}
                                    style={{ width: '100%', marginTop: '0.5rem' }}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="under review">Under Review</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setSelectedGrievance(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ManagerGrievanceView;
