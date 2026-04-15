import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEye, FiFilter, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import api from '../api';

const WorkerGrievanceView = () => {
    const { t } = useTranslation();
    const [grievances, setGrievances] = useState([]);
    const [filteredGrievances, setFilteredGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    const fetchGrievances = async () => {
        try {
            const response = await api.get('/grievances/worker');
            setGrievances(response.data);
            setFilteredGrievances(response.data);
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

    useEffect(() => {
        if (filter === 'all') {
            setFilteredGrievances(grievances);
        } else {
            setFilteredGrievances(grievances.filter(g => g.status === filter));
        }
    }, [filter, grievances]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'under review': return 'status-under-review';
            case 'completed': return 'status-completed';
            default: return '';
        }
    };

    const getTranslatedStatus = (status) => {
        switch (status) {
            case 'pending': return t('status.pending');
            case 'under review': return t('status.under_review');
            case 'completed': return t('status.resolved');
            default: return status;
        }
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', padding: '2rem 1rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ color: 'var(--primary-color)', marginBottom: '0.25rem' }}>{t('worker_grievance.title')}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{t('worker_grievance.subtitle')}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <FiFilter style={{ color: 'var(--text-secondary)' }} />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', fontWeight: '500', cursor: 'pointer' }}
                            >
                                <option value="all">{t('worker_grievance.filter_all')}</option>
                                <option value="pending">{t('status.pending')}</option>
                                <option value="under review">{t('status.under_review')}</option>
                                <option value="completed">{t('status.resolved')}</option>
                            </select>
                        </div>
                        <button onClick={() => navigate('/dashboard/worker')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiArrowLeft /> {t('worker_grievance.btn_back')}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{t('worker_grievance.loading')}</p>
                    </div>
                ) : error ? (
                    <div className="error-message" style={{ margin: '1rem 0' }}>{error}</div>
                ) : grievances.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                        <h3>{t('worker_grievance.empty_title')}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t('worker_grievance.empty_desc')}</p>
                        <button className="btn-primary" onClick={() => navigate('/file-grievance')}>{t('worker_grievance.btn_file_new')}</button>
                    </div>
                ) : (
                    <div className="table-container shadow-sm" style={{ overflowX: 'auto' }}>
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>{t('worker_grievance.table_date')}</th>
                                    <th>{t('worker_grievance.table_title')}</th>
                                    <th>{t('worker_grievance.table_status')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('worker_grievance.table_details')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGrievances.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                            {t('worker_grievance.no_filter_match', { filter: filter === 'all' ? t('worker_grievance.filter_all') : getTranslatedStatus(filter) })}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredGrievances.map((grievance) => (
                                        <tr key={grievance._id} style={{ transition: 'background 0.2s' }}>
                                            <td>{new Date(grievance.createdAt).toLocaleDateString()}</td>
                                            <td style={{ fontWeight: '500' }}>{grievance.title}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(grievance.status)}`}>
                                                    {getTranslatedStatus(grievance.status)}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => setSelectedGrievance(grievance)}
                                                    style={{ color: 'var(--primary-color)', background: '#eff6ff', padding: '0.5rem', borderRadius: '6px' }}
                                                >
                                                    <FiEye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedGrievance && (
                <div className="modal-overlay" onClick={() => setSelectedGrievance(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', borderRadius: '16px' }}>
                        <div className="modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ margin: 0 }}>{t('worker_grievance.modal_title')}</h3>
                            <button className="close-button" onClick={() => setSelectedGrievance(null)}>&times;</button>
                        </div>
                        <div className="modal-body" style={{ padding: '1.5rem' }}>
                            <div className="grievance-detail-item" style={{ marginBottom: '1.5rem' }}>
                                <span className="grievance-detail-label" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>{t('worker_grievance.modal_label_title')}</span>
                                <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--primary-dark)', marginTop: '0.25rem' }}>
                                    {selectedGrievance.title}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="grievance-detail-item">
                                    <span className="grievance-detail-label" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>{t('worker_grievance.modal_label_date')}</span>
                                    <div style={{ marginTop: '0.25rem', fontWeight: '500' }}>{new Date(selectedGrievance.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="grievance-detail-item">
                                    <span className="grievance-detail-label" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>{t('worker_grievance.modal_label_status')}</span>
                                    <div style={{ marginTop: '0.25rem' }}>
                                        <span className={`status-badge ${getStatusClass(selectedGrievance.status)}`}>
                                            {getTranslatedStatus(selectedGrievance.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grievance-detail-item">
                                <span className="grievance-detail-label" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>{t('worker_grievance.modal_label_description')}</span>
                                <div style={{
                                    background: '#f8fafc',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    whiteSpace: 'pre-wrap',
                                    marginTop: '0.5rem',
                                    lineHeight: '1.6',
                                    color: '#334155'
                                }}>
                                    {selectedGrievance.description}
                                </div>
                            </div>

                            {selectedGrievance.status === 'completed' && (
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5', color: '#065f46', fontSize: '0.9rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <FiCheckCircle style={{ flexShrink: 0 }} /> {t('worker_grievance.modal_resolved_msg')}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer" style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn-secondary" onClick={() => setSelectedGrievance(null)} style={{ padding: '0.6rem 1.5rem' }}>{t('worker_grievance.btn_close')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerGrievanceView;
