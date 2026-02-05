import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    if (!user) return <div className="container">Loading...</div>;

    // Create a structured summary for the QR code
    // Using simple text format for better readability when scanned by humans
    const qrData = `Name: ${user.fullName}
ID: ${user.migrantId || 'N/A'}
User ID: ${user.id}
Phone: ${user.phoneNumber}
State: ${user.nativeState || 'N/A'}
Skills: ${Array.isArray(user.skills) ? user.skills.join(', ') : user.skills}`;

    return (
        <div className="container" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div
                className="card profile-card"
                style={{
                    width: '100%',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '2.5rem',
                    alignItems: 'stretch'
                }}
            >


                {/* Left Half: User Details */}
                <div className="profile-details" style={{
                    flex: '1',
                    minWidth: '300px'
                }}>

                    <h2 style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: '2px solid var(--primary-color)',
                        paddingBottom: '0.5rem',
                        marginBottom: '1.5rem',
                        color: 'var(--primary-color)'
                    }}>
                        User Profile
                        {/* <button
                            className="btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            &larr; Back to Dashboard
                        </button> */}
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
                            <span className="label">Base User ID</span>
                            <span className="value" style={{ fontSize: '0.8rem' }}>{user.id}</span>
                        </div>

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
                                <span className="label">State</span>
                                <span className="value">{user.nativeState}</span>
                            </div>
                        )}

                        {user.currentDistrict && (
                            <div className="detail-item">
                                <span className="label">District</span>
                                <span className="value">{user.currentDistrict}</span>
                            </div>
                        )}

                        {user.skills && (
                            <div className="detail-item">
                                <span className="label">Skills</span>
                                <span className="value">
                                    {Array.isArray(user.skills) ? user.skills.join(', ') : user.skills}
                                </span>
                            </div>
                        )}

                        <div className="detail-item">
                            <span className="label">Role</span>
                            <span className="value" style={{ textTransform: 'capitalize' }}>{user.role || 'Worker'}</span>
                        </div>
                    </div>


                </div>

                {/* Right Half: QR Code */}
                <div className="profile-qr" style={{
                    flex: '0 0 320px',  // fixed width QR side
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(145deg, #f0f9ff, #e6f7ff)',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}>

                    <h3 style={{ marginBottom: '1.5rem', color: '#0056b3' }}>Digital Identity</h3>

                    <div style={{
                        padding: '1.5rem',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                        <QRCodeSVG
                            value={qrData}
                            size={200}
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>

                    <p style={{ marginTop: '1.5rem', fontSize: '1rem', color: '#666', textAlign: 'center', maxWidth: '80%' }}>
                        Scan to assume identity or verify worker details instantly.
                    </p>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .profile-card {
                        flex-direction: column !important;
                    }
                    .profile-qr {
                        flex: 1 1 auto !important;
                        width: 100% !important;
                    }
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1.25rem;
                }
                
                @media (max-width: 600px) {
                    .details-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.8rem;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                }
                .detail-item:hover {
                    background-color: #f0f0f0;
                    transform: translateX(5px);
                }
                .label {
                    font-weight: 600;
                    color: #555;
                    font-size: 0.9rem;
                }
                .value {
                    font-weight: 500;
                    color: #333;
                }
            `}</style>
        </div>
    );
};

export default Profile;
