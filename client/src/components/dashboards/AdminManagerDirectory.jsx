import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiUser, FiMapPin, FiPhone, FiArrowLeft, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../../dashboard.css';

const AdminManagerDirectory = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/managers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setManagers(response.data);
            } catch (error) {
                console.error('Error fetching managers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchManagers();
    }, [token]);

    const filteredManagers = managers.filter(m =>
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.currentDistrict.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <div className="welcome-section">
                    <button className="back-btn" onClick={() => navigate('/dashboard/admin')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>
                        <FiArrowLeft /> Back to Admin
                    </button>
                    <h1>Manager Directory</h1>
                    <p>Total {managers.length} Department Heads registered across districts.</p>
                </div>

                <div className="search-input-wrapper" style={{ width: '400px', position: 'relative' }}>
                    <FiSearch className="input-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search by name or district..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '3rem', width: '100%', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0.8rem 1rem 0.8rem 3rem' }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="loader"></div>
                    <p>Loading manager profiles...</p>
                </div>
            ) : filteredManagers.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <FiSearch size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                    <h3>No managers found</h3>
                    <p>Try adjusting your search criteria.</p>
                </div>
            ) : (
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {filteredManagers.map(manager => (
                        <div key={manager._id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '1.2rem', fontWeight: 600 }}>
                                    {manager.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0 }}>{manager.fullName}</h3>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <FiShield size={14} /> Official Manager
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                                    <FiMapPin /> <strong>District:</strong> {manager.currentDistrict}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}>
                                    <FiPhone /> <strong>Phone:</strong> {manager.phoneNumber}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminManagerDirectory;
