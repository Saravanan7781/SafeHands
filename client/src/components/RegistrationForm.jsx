import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const SKILL_OPTIONS = [
    'Construction',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Farming',
    'Domestic Help',
    'Driver',
    'Tailoring',
    'Other'
];

const RegistrationForm = () => {
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
                throw new Error("Please select at least one skill.");
            }
            if (formData.phoneNumber.length < 10) {
                throw new Error("Please enter a valid phone number.");
            }

            const response = await api.post('/workers/register', formData);
            navigate('/success', { state: { data: response.data } });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Worker Registration</h2>
                <p className="card-description">
                    Enter worker details to generate a government-issued Unique Migrant ID.
                </p>

                {error && <div className="error-message" style={{ marginBottom: '1.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Rahul Kumar"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
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
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="10 digit number"
                                    pattern="[0-9]{10}"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Create Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Min 6 chars"
                                minLength="6"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label htmlFor="nativeState">Native State</label>
                                <input
                                    type="text"
                                    id="nativeState"
                                    name="nativeState"
                                    value={formData.nativeState}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Bihar"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="currentDistrict">Current District</label>
                                <input
                                    type="text"
                                    id="currentDistrict"
                                    name="currentDistrict"
                                    value={formData.currentDistrict}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Mumbai"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Skills</label>
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
                                        {skill}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="preferredLanguage">Preferred Language</label>
                            <select
                                id="preferredLanguage"
                                name="preferredLanguage"
                                value={formData.preferredLanguage}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Language...</option>
                                <option value="Hindi">Hindi</option>
                                <option value="English">English</option>
                                <option value="Bengali">Bengali</option>
                                <option value="Marathi">Marathi</option>
                                <option value="Telugu">Telugu</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>



                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2 }}>
                                {loading ? 'Processing Registration...' : 'Register Worker'}
                            </button>
                            {localStorage.getItem('user') && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => navigate(-1)}
                                    style={{ flex: 1 }}
                                >
                                    Cancel
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
