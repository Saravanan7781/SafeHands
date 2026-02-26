import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiCheckCircle, FiClock, FiPlus, FiAlertCircle, FiTrendingUp, FiArrowDown } from 'react-icons/fi';
import api from '../api';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showJobForm, setShowJobForm] = useState(false);
    const [newJob, setNewJob] = useState({ companyName: '', supervisorNumber: '', role: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch profile", error);
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
            else navigate('/login');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [navigate]);

    const handleAddJob = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/workers/employment', newJob);
            setShowJobForm(false);
            setNewJob({ companyName: '', supervisorNumber: '', role: '' });
            fetchUserProfile();
            toast.success('Employment details submitted for manager verification.', {
                duration: 4000,
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        } catch (error) {
            console.error('Error adding job:', error);
            toast.error(error.response?.data?.message || 'Failed to submit employment details.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading Profile...</div>;
    if (!user) return null;

    const qrData = `Name: ${user.fullName}\nID: ${user.migrantId || 'N/A'}\nPhone: ${user.phoneNumber}\nState: ${user.nativeState || 'N/A'}`;

    return (
        <div className="container" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="card profile-card" style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '2.5rem', marginBottom: '2.5rem' }}>
                <div className="profile-details" style={{ flex: '1', minWidth: '300px' }}>
                    <h2 style={{ display: "flex", justifyContent: "space-between", borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                        User Profile
                    </h2>

                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="label">Full Name</span>
                            <span className="value">{user.fullName || 'N/A'}</span>
                        </div>
                        {user.migrantId && (
                            <div className="detail-item">
                                <span className="label">Migrant ID</span>
                                <span className="value">{user.migrantId}</span>
                            </div>
                        )}
                        <div className="detail-item">
                            <span className="label">Phone Number</span>
                            <span className="value">{user.phoneNumber || 'N/A'}</span>
                        </div>
                        {user.age && (
                            <div className="detail-item">
                                <span className="label">Age</span>
                                <span className="value">{user.age}</span>
                            </div>
                        )}
                        {user.nativeState && (
                            <div className="detail-item">
                                <span className="label">Native State</span>
                                <span className="value">{user.nativeState}</span>
                            </div>
                        )}
                        {user.currentDistrict && (
                            <div className="detail-item">
                                <span className="label">Current District</span>
                                <span className="value">{user.currentDistrict}</span>
                            </div>
                        )}
                        <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                            <span className="label">Skills</span>
                            <span className="value">{Array.isArray(user.skills) ? user.skills.join(', ') : user.skills}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-qr" style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #f0f9ff, #e6f7ff)', padding: '2rem', borderRadius: '12px' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#0056b3' }}>Digital Identity</h3>
                    <div style={{ padding: '1.5rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <QRCodeSVG value={qrData} size={200} level={"H"} includeMargin={true} />
                    </div>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>Scan to verify identity and skills.</p>
                </div>
            </div>

            {/* Employment Section */}
            <div className="dashboard-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="section-title"><FiBriefcase /> Employment Progress</h2>
                    {user.role === 'worker' && user.currentEmployment?.status !== 'pending' && (
                        <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.2rem' }} onClick={() => setShowJobForm(!showJobForm)}>
                            <FiPlus /> {user.currentEmployment?.status === 'active' ? 'Switch Company' : 'Add Current Job'}
                        </button>
                    )}
                </div>

                {user.role === 'worker' && (
                    <div className="dashboard-card" style={{ marginBottom: '2rem', borderLeft: '6px solid var(--accent-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Current Status</h3>
                                {user.currentEmployment?.status === 'active' ? (
                                    <div style={{ display: 'flex', gap: '2rem' }}>
                                        <div><strong>Company:</strong> {user.currentEmployment.companyName}</div>
                                        <div><strong>Role:</strong> {user.currentEmployment.role}</div>
                                        <div><span className="status-badge status-completed">Verified & Active</span></div>
                                    </div>
                                ) : user.currentEmployment?.status === 'pending' ? (
                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <div><strong>Company:</strong> {user.currentEmployment.companyName}</div>
                                        <div><span className="status-badge status-pending"><FiClock /> Waiting for Verification</span></div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>A manager in {user.currentDistrict} will verify your details soon.</p>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)' }}>Currently not linked to any verified company.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {showJobForm && (
                    <div className="card" style={{ marginBottom: '2rem', background: '#f8fafc', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Submit New Employment Details</h3>
                        <form onSubmit={handleAddJob} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                            <div className="form-group">
                                <label>Company Name</label>
                                <input type="text" value={newJob.companyName} onChange={e => setNewJob({ ...newJob, companyName: e.target.value })} required placeholder="e.g. DLF Construction" />
                            </div>
                            <div className="form-group">
                                <label>Supervisor Phone</label>
                                <input type="text" value={newJob.supervisorNumber} onChange={e => setNewJob({ ...newJob, supervisorNumber: e.target.value })} required placeholder="e.g. 9876543210" />
                            </div>
                            <div className="form-group">
                                <label>Your Role</label>
                                <input type="text" value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })} required placeholder="e.g. Electrician" />
                            </div>
                            <button type="submit" className="btn-primary" disabled={submitting} style={{ height: '48px' }}>
                                {submitting ? 'Submitting...' : 'Submit to Manager'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Employment Timeline */}
                <h3 className="section-title" style={{ fontSize: '1.2rem', marginTop: '2.5rem', textAlign: 'center' }}><FiTrendingUp /> Professional Journey</h3>
                <div className="timeline-wrapper">
                    {user.employmentHistory && user.employmentHistory.length > 0 ? (
                        user.employmentHistory.map((job, index) => (
                            <div key={job._id || index} className="timeline-node">
                                <div className="timeline-card-wrapper">
                                    <div className="timeline-card">
                                        <div className="card-glass-shine"></div>
                                        <div className="job-header">
                                            <div className="company-logo-avatar">
                                                {job.companyName.charAt(0)}
                                            </div>
                                            <div className="job-title-group">
                                                <h4>{job.companyName}</h4>
                                                <p className="job-role">{job.role}</p>
                                            </div>
                                            <div className="job-date">
                                                <FiClock /> {new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}
                                            </div>
                                        </div>

                                        <div className="job-details-footer">
                                            <div className="supervisor-info">
                                                <span className="info-label">Supervisor</span>
                                                <span className="info-val">{job.supervisorNumber}</span>
                                            </div>
                                            {job.duration && (
                                                <div className="duration-tag">
                                                    <FiTrendingUp /> {job.duration}
                                                </div>
                                            )}
                                            {!job.endDate && <span className="active-badge">Active</span>}
                                        </div>
                                    </div>
                                </div>

                                {index < user.employmentHistory.length - 1 && (
                                    <div className={`zigzag-connector ${index % 2 === 0 ? 'to-left' : 'to-right'}`}>
                                        <svg width="100%" height="120" viewBox="0 0 800 120" fill="none" preserveAspectRatio="none">
                                            {index % 2 === 0 ? (
                                                /* Starts from Right, loops out and goes to Left of next box */
                                                <g>
                                                    <path
                                                        d="M 650 0 C 850 40, 850 80, 400 80 C 0 80, 0 80, 150 120"
                                                        stroke="var(--accent-color)"
                                                        strokeWidth="4"
                                                        strokeLinecap="round"
                                                        strokeDasharray="8 12"
                                                        className="flow-path"
                                                    />
                                                    <path d="M 145 110 L 150 120 L 140 118" stroke="var(--accent-color)" strokeWidth="4" strokeLinecap="round" />
                                                </g>
                                            ) : (
                                                /* Starts from Left, loops out and goes to Right of next box */
                                                <g>
                                                    <path
                                                        d="M 150 0 C -50 40, -50 80, 400 80 C 800 80, 800 80, 650 120"
                                                        stroke="var(--accent-color)"
                                                        strokeWidth="4"
                                                        strokeLinecap="round"
                                                        strokeDasharray="8 12"
                                                        className="flow-path"
                                                    />
                                                    <path d="M 655 110 L 650 120 L 660 118" stroke="var(--accent-color)" strokeWidth="4" strokeLinecap="round" />
                                                </g>
                                            )}
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="empty-timeline">
                            <FiAlertCircle size={40} />
                            <p>No verified work history found on your timeline yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1.25rem;
                }
                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.8rem;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                }
                .label { font-weight: 600; color: #555; font-size: 0.9rem; }
                .value { font-weight: 500; color: #333; }
                
                .timeline-wrapper {
                    padding: 4rem 0;
                    max-width: 1000px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    overflow: visible;
                }

                .timeline-node {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    margin-bottom: 0;
                    animation: fadeInUp 0.6s ease-out forwards;
                }

                .timeline-card-wrapper {
                    width: 100%;
                    max-width: 650px;
                    perspective: 1000px;
                    z-index: 5;
                }

                .timeline-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 24px;
                    padding: 1.75rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s ease;
                    cursor: pointer;
                }

                .timeline-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.08);
                    border-color: var(--accent-color);
                }

                .card-glass-shine {
                    position: absolute;
                    top: -100%;
                    left: -100%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        45deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0) 40%,
                        rgba(255, 255, 255, 0.4) 50%,
                        rgba(255, 255, 255, 0) 60%,
                        transparent 100%
                    );
                    transition: all 0.6s;
                    pointer-events: none;
                }

                .timeline-card:hover .card-glass-shine {
                    top: -50%;
                    left: -50%;
                }

                .job-header {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    margin-bottom: 1.5rem;
                }

                .company-logo-avatar {
                    width: 50px;
                    height: 50px;
                    background: #dbeafe;
                    color: #2563eb;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                    font-weight: 700;
                    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.1);
                }

                .job-title-group {
                    flex: 1;
                }

                .job-title-group h4 {
                    margin: 0;
                    font-size: 1.25rem;
                    color: var(--primary-color);
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                    font-weight: 700;
                }

                .job-role {
                    margin: 0.2rem 0 0;
                    color: var(--accent-color);
                    font-weight: 500;
                    font-size: 0.95rem;
                }

                .job-date {
                    font-size: 0.8rem;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: #f8fafc;
                    padding: 0.4rem 0.8rem;
                    border-radius: 99px;
                }

                .job-details-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 1.25rem;
                }

                .supervisor-info {
                    display: flex;
                    flex-direction: column;
                }

                .info-label {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    color: #94a3b8;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }

                .info-val {
                    color: #475569;
                    font-weight: 600;
                    font-size: 0.85rem;
                }

                .duration-tag {
                    color: #10b981;
                    font-weight: 700;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    background: #ecfdf5;
                    padding: 0.3rem 0.8rem;
                    border-radius: 8px;
                }

                .active-badge {
                    background: #eff6ff;
                    color: #3b82f6;
                    padding: 0.3rem 0.8rem;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                }

                .zigzag-connector {
                    width: 100%;
                    max-width: 900px;
                    height: 120px;
                    margin: -10px 0; /* Overlap slightly to connect */
                    pointer-events: none;
                    overflow: visible;
                }

                .flow-path {
                    animation: flowAnim 1.5s linear infinite;
                    opacity: 0.6;
                }

                @keyframes flowAnim {
                    from { stroke-dashoffset: 20; }
                    to { stroke-dashoffset: 0; }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 900px) {
                    .zigzag-connector { display: none; }
                    .timeline-node::after {
                        content: '';
                        width: 4px;
                        height: 40px;
                        background: var(--accent-color);
                        display: block;
                        margin: 1rem 0;
                        border-radius: 2px;
                    }
                    .timeline-node:last-child::after { display: none; }
                }

                .empty-timeline {
                    text-align: center;
                    padding: 4rem;
                    background: white;
                    border-radius: 24px;
                    border: 2px dashed #e2e8f0;
                    color: #94a3b8;
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default Profile;
