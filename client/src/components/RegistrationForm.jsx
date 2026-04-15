import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SKILL_OPTIONS = [
    'construction',
    'plumbing',
    'electrical',
    'carpentry',
    'farming',
    'domestic_help',
    'driver',
    'tailoring',
    'other'
];

const RegistrationForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        phoneNumber: '',
        password: '',
        nativeState: '',
        currentDistrict: '',
        skills: [],
        preferredLanguage: ''
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            if (checked) {
                return { ...prev, skills: [...prev.skills, value] };
            } else {
                return { ...prev, skills: prev.skills.filter(skill => skill !== value) };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Simple client-side validation
            if (formData.skills.length === 0) {
                throw new Error(t('auth.error_no_skills'));
            }
            if (formData.phoneNumber.length < 10) {
                throw new Error(t('auth.error_invalid_phone'));
            }

            const response = await api.post('/workers/register', formData);
            navigate('/success', { state: { data: response.data } });
        } catch (err) {
            setError(err.response?.data?.message || err.message || t('auth.error_register_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>{t('auth.register_title')}</h2>
                <p className="card-description">
                    {t('auth.register_subtitle')}
                </p>

                {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="fullName">{t('auth.label_fullname')}</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder={t('auth.placeholder_fullname')}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label htmlFor="age">{t('auth.label_age')}</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    min="14"
                                    max="100"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">{t('auth.label_phone')}</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder={t('auth.placeholder_phone_hint')}
                                    pattern="[0-9]{10}"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">{t('auth.label_create_password')}</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder={t('auth.placeholder_password_hint')}
                                minLength="6"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label htmlFor="nativeState">{t('auth.label_native_state')}</label>
                                <input
                                    type="text"
                                    id="nativeState"
                                    name="nativeState"
                                    value={formData.nativeState}
                                    onChange={handleChange}
                                    required
                                    placeholder={t('auth.placeholder_state')}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="currentDistrict">{t('auth.label_current_district')}</label>
                                <input
                                    type="text"
                                    id="currentDistrict"
                                    name="currentDistrict"
                                    value={formData.currentDistrict}
                                    onChange={handleChange}
                                    required
                                    placeholder={t('auth.placeholder_district')}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>{t('auth.label_skills')}</label>
                            <div className="checkbox-group">
                                {SKILL_OPTIONS.map(skill => (
                                    <label
                                        key={skill}
                                        className={`selection-card ${formData.skills.includes(skill) ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            value={skill}
                                            checked={formData.skills.includes(skill)}
                                            onChange={handleSkillChange}
                                            style={{ display: 'none' }} // Hide default checkbox
                                        />
                                        {t(`skills.${skill}`)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="preferredLanguage">{t('auth.label_language')}</label>
                            <select
                                id="preferredLanguage"
                                name="preferredLanguage"
                                value={formData.preferredLanguage}
                                onChange={handleChange}
                                required
                            >
                                <option value="">{t('auth.placeholder_language')}</option>
                                <option value="Hindi">{t('languages.hindi')}</option>
                                <option value="English">{t('languages.english')}</option>
                                <option value="Bengali">{t('languages.bengali')}</option>
                                <option value="Marathi">{t('languages.marathi')}</option>
                                <option value="Telugu">{t('languages.telugu')}</option>
                                <option value="Tamil">{t('languages.tamil')}</option>
                                <option value="Other">{t('languages.other')}</option>
                            </select>
                        </div>



                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2 }}>
                                {loading ? t('auth.btn_registering') : t('auth.btn_register')}
                            </button>
                            {localStorage.getItem('user') && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => navigate(-1)}
                                    style={{ flex: 1 }}
                                >
                                    {t('auth.btn_cancel')}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
