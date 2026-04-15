import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';

const ManagerGrievanceView = () => {
    const { t } = useTranslation();
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
            setError(err.response?.data?.message || t('manager.error_fetch_grievances', 'Server error while fetching grievances'));
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
            alert(err.response?.data?.message || t('manager.error_update_status', 'Failed to update status'));
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
                        <h2>{t('manager.grievance_title')}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{t('manager.grievance_subtitle', { district: user?.currentDistrict })}</p>
                    </div>
                    <button onClick={() => navigate('/dashboard/manager')} className="btn-secondary">{t('manager.btn_back')}</button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>{t('manager.loading_grievances')}</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : grievances.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                        <p>{t('manager.no_grievances')}</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>{t('manager.table_date')}</th>
                                    <th>{t('manager.table_worker')}</th>
                                    <th>{t('manager.table_title')}</th>
                                    <th>{t('manager.table_status')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('manager.table_details')}</th>
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
                                                {t(`status.${grievance.status === 'under review' ? 'under_review' : grievance.status}`, grievance.status)}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                className="btn-icon"
                                                onClick={() => setSelectedGrievance(grievance)}
                                                title={t('manager.table_details')}
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
                            <h3>{t('manager.modal_grievance_title')}</h3>
                            <button className="close-button" onClick={() => setSelectedGrievance(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="grievance-detail-item">
                                <span className="grievance-detail-label">{t('manager.table_title')}</span>
                                <div className="grievance-detail-value" style={{ fontWeight: '700', fontSize: '1.25rem' }}>
                                    {selectedGrievance.title}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="grievance-detail-item">
                                    <span className="grievance-detail-label">{t('manager.table_worker')}</span>
                                    <div className="grievance-detail-value">{selectedGrievance.worker?.fullName}</div>
                                </div>
                                <div className="grievance-detail-item">
                                    <span className="grievance-detail-label">{t('manager.label_phone')}</span>
                                    <div className="grievance-detail-value">{selectedGrievance.worker?.phoneNumber}</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="grievance-detail-item">
                                    <span className="grievance-detail-label">{t('manager.modal_date_filed')}</span>
                                    <div className="grievance-detail-value">{new Date(selectedGrievance.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="grievance-detail-item">
                                    <span className="grievance-detail-label">{t('profile.status_title')}</span>
                                    <div>
                                        <span className={`status-badge ${getStatusClass(selectedGrievance.status)}`}>
                                            {t(`status.${selectedGrievance.status === 'under review' ? 'under_review' : selectedGrievance.status}`, selectedGrievance.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grievance-detail-item">
                                <span className="grievance-detail-label">{t('grievance.label_description')}</span>
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
                                <span className="grievance-detail-label">{t('manager.modal_update_status')}</span>
                                <select
                                    className="form-control"
                                    value={selectedGrievance.status}
                                    onChange={(e) => handleStatusChange(selectedGrievance._id, e.target.value)}
                                    style={{ width: '100%', marginTop: '0.5rem' }}
                                >
                                    <option value="pending">{t('status.pending')}</option>
                                    <option value="under review">{t('status.under_review')}</option>
                                    <option value="completed">{t('status.resolved')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setSelectedGrievance(null)}>{t('manager.btn_close')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerGrievanceView;
