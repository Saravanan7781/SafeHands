import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="logo-section">
                    <FiShield className="logo-icon" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
                    <div>
                        <h1>SafeHands</h1>
                        <p className="logo-subtitle">Migrant Worker Welfare Portal</p>
                    </div>
                </div>
                <nav className="landing-nav">
                    <button
                        className="nav-item-btn"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                    <button
                        className="nav-link-button"
                        onClick={() => navigate('/register')}
                        style={{ padding: '0.5rem 1.5rem', borderRadius: '99px' }}
                    >
                        Register
                    </button>
                </nav>
            </header>

            <main className="hero-section">
                <div className="hero-content">
                    <p className="hero-tagline">Government of India • Migrant Worker Protection</p>
                    <h2>Protecting and Empowering Migrant Workers</h2>
                    <p className="hero-subtitle">
                        SafeHands is a unified digital platform for worker registration, rights protection,
                        and welfare management, connecting workers, employers, and government agencies.
                    </p>

                    <div className="action-buttons">
                        <button
                            className="btn-primary btn-large"
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                width: 'fit-content',
                                borderRadius: '99px',
                                boxShadow: '0 4px 12px -2px rgba(37, 99, 235, 0.3)',
                                background: 'linear-gradient(135deg, var(--accent-color) 0%, #4f46e5 100%)'
                            }}
                        >
                            Start Your Journey
                        </button>
                    </div>

                    <div className="hero-grid">
                        <div className="hero-card">
                            <h3>Single Unified ID</h3>
                            <p>Issue secure, verifiable IDs for migrant workers to access welfare schemes seamlessly.</p>
                        </div>
                        <div className="hero-card">
                            <h3>Multi-role Access</h3>
                            <p>Dedicated views for workers, managers, and administrators to manage data responsibly.</p>
                        </div>
                        <div className="hero-card">
                            <h3>Safety & Compliance</h3>
                            <p>Track registrations, grievances, and safety measures in one transparent system.</p>
                        </div>
                    </div>

                    <div className="hero-meta">
                        <span className="hero-pill">Secure • Transparent • Inclusive</span>
                        <span className="hero-note">Built to support interstate and seasonal migration at scale.</span>
                    </div>
                </div>
            </main>

            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} SafeHands Initiative • Government of India</p>
            </footer>
        </div>
    );
};

export default LandingPage;
