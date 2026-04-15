import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="logo-section">
                    <FiShield className="logo-icon" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
                    <div>
                        <h1>{t('app.title')}</h1>
                        <p className="logo-subtitle">{t('app.portal_subtitle')}</p>
                    </div>
                </div>
                <nav className="landing-nav">
                    <div style={{ marginRight: '1rem' }}>
                        <select 
                            value={i18n.language} 
                            onChange={changeLanguage}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                padding: '0.2rem 0.5rem',
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                            <option value="bn">বাংলা</option>
                            <option value="or">ଓଡ଼ିଆ</option>
                            <option value="te">తెలుగు</option>
                            <option value="ta">தமிழ்</option>
                        </select>
                    </div>
                    <button
                        className="nav-item-btn"
                        onClick={() => navigate('/login')}
                    >
                        {t('landing.login')}
                    </button>
                    <button
                        className="nav-link-button"
                        onClick={() => navigate('/register')}
                        style={{ padding: '0.5rem 1.5rem', borderRadius: '99px' }}
                    >
                        {t('landing.register')}
                    </button>
                </nav>
            </header>

            <main className="hero-section">
                <div className="hero-content">
                    <p className="hero-tagline">{t('landing.tagline')}</p>
                    <h2>{t('landing.heading')}</h2>
                    <p className="hero-subtitle">
                        {t('landing.description')}
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
                            {t('landing.start_journey')}
                        </button>
                    </div>

                    <div className="hero-grid">
                        <div className="hero-card">
                            <h3>{t('landing.card1_title')}</h3>
                            <p>{t('landing.card1_desc')}</p>
                        </div>
                        <div className="hero-card">
                            <h3>{t('landing.card2_title')}</h3>
                            <p>{t('landing.card2_desc')}</p>
                        </div>
                        <div className="hero-card">
                            <h3>{t('landing.card3_title')}</h3>
                            <p>{t('landing.card3_desc')}</p>
                        </div>
                    </div>

                    <div className="hero-meta">
                        <span className="hero-pill">{t('landing.meta_pill')}</span>
                        <span className="hero-note">{t('landing.meta_note')}</span>
                    </div>
                </div>
            </main>

            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} {t('app.footer_text')}</p>
            </footer>
        </div>
    );
};

export default LandingPage;
