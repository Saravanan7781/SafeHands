import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiMapPin, FiUsers, FiClipboard, FiCheckCircle, FiClock, FiActivity, FiArrowLeft, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../../dashboard.css';

const AdvancedAdminDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [searchTerm, setSearchTerm] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrictData, setSelectedDistrictData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const fetchDistricts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/admin/district-analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDistricts(response.data);
            } catch (error) {
                console.error('Error fetching districts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDistricts();
    }, [token]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) {
            setSelectedDistrictData(null);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/district-analytics?district=${searchTerm}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedDistrictData(response.data);
        } catch (error) {
            console.error('Error fetching district analytics:', error);
            setSelectedDistrictData(null);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleDistrictClick = async (districtName) => {
        setSearchTerm(districtName);
        setSearchLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/district-analytics?district=${districtName}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedDistrictData(response.data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error fetching district analytics:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                <div className="welcome-section">
                    <button className="back-btn" onClick={() => navigate('/dashboard/admin')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>
                        <FiArrowLeft /> Back to Admin
                    </button>
                    <h1>Advanced Analytics</h1>
                    <p>Deep-dive into district-level performance and worker statistics.</p>
                </div>
            </div>

            <div className="dashboard-card" style={{ marginBottom: '3rem', padding: '1.5rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                    <div className="search-input-wrapper" style={{ flex: 1, position: 'relative' }}>
                        <FiMapPin className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Enter district name (e.g. Pune, Mumbai, Nagpur)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '3rem', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0.8rem 1rem 0.8rem 3rem' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 2rem' }} disabled={searchLoading}>
                        {searchLoading ? 'Searching...' : 'Analyze District'}
                    </button>
                </form>
            </div>

            {selectedDistrictData ? (
                <div className="analytics-view animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <FiTrendingUp style={{ color: 'var(--primary-color)' }} />
                            Analytics for {selectedDistrictData.district}
                        </h2>
                        <button className="btn-secondary" onClick={() => setSelectedDistrictData(null)} style={{ width: 'auto' }}>Clear Results</button>
                    </div>

                    <div className="stat-grid" style={{ marginBottom: '3rem' }}>
                        <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                            <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary-color)' }}><FiUsers /></div>
                            <div className="stat-info">
                                <div className="stat-label">Total Workers</div>
                                <div className="stat-value">{selectedDistrictData.workersCount}</div>
                            </div>
                        </div>
                        <div className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                            <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}><FiClipboard /></div>
                            <div className="stat-info">
                                <div className="stat-label">Total Grievances</div>
                                <div className="stat-value">{selectedDistrictData.grievancesCount}</div>
                            </div>
                        </div>
                        <div className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
                            <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><FiCheckCircle /></div>
                            <div className="stat-info">
                                <div className="stat-label">Resolved Cases</div>
                                <div className="stat-value">{selectedDistrictData.resolvedCount}</div>
                            </div>
                        </div>
                        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
                            <div className="stat-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><FiClock /></div>
                            <div className="stat-info">
                                <div className="stat-label">Pending Verifications</div>
                                <div className="stat-value">{selectedDistrictData.pendingVerifications}</div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <div className="dashboard-card" style={{ padding: '2rem' }}>
                            <h3 className="card-title">Performance Breakdown</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>Grievance Resolution Efficiency</span>
                                        <strong>{selectedDistrictData.grievancesCount > 0 ? Math.round((selectedDistrictData.resolvedCount / selectedDistrictData.grievancesCount) * 100) : 0}%</strong>
                                    </div>
                                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                                        <div style={{ height: '100%', width: `${selectedDistrictData.grievancesCount > 0 ? (selectedDistrictData.resolvedCount / selectedDistrictData.grievancesCount) * 100 : 0}%`, background: '#10b981', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>Verification Backlog</span>
                                        <strong>{selectedDistrictData.pendingVerifications > 10 ? 'High' : 'Low'}</strong>
                                    </div>
                                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                                        <div style={{ height: '100%', width: `${selectedDistrictData.pendingVerifications > 50 ? 100 : selectedDistrictData.pendingVerifications * 2}%`, background: '#ef4444', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-card" style={{ padding: '2rem', background: 'var(--primary-color)', color: 'white' }}>
                            <h3 className="card-title" style={{ color: 'white' }}>District Status</h3>
                            <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Comprehensive monitoring of migrant welfare in {selectedDistrictData.district}.</p>
                            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <FiActivity /> <span>Active Monitoring: <strong>Enabled</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <FiUsers /> <span>Enrolled Migrants: <strong>{selectedDistrictData.workersCount}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="districts-list animate-fade-in">
                    <h2 style={{ marginBottom: '1.5rem' }}>Active Districts Overview</h2>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <div className="loader"></div>
                            <p>Loading district list...</p>
                        </div>
                    ) : districts.length === 0 ? (
                        <div className="dashboard-card" style={{ textAlign: 'center', padding: '4rem' }}>
                            <FiMapPin size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                            <h3>No active districts found</h3>
                            <p>Start registering workers to see regional data.</p>
                        </div>
                    ) : (
                        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                            {districts.map((d, idx) => (
                                <div
                                    key={idx}
                                    className="dashboard-card"
                                    style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                    onClick={() => handleDistrictClick(d.name)}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: 'var(--primary-light)', color: 'var(--primary-color)', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FiMapPin />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{d.name}</h4>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{d.workerCount} Workers</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AdvancedAdminDashboard;
