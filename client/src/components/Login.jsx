import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phoneNumber: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', formData);
            const { token, user } = response.data;

            // Store token
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on role
            switch (user.role) {
                case 'worker':
                    navigate('/dashboard/worker');
                    break;
                case 'manager':
                    navigate('/dashboard/manager');
                    break;
                case 'admin':
                    navigate('/dashboard/admin');
                    break;
                default:
                    navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        Don't have an account? <span
                            style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '500' }}
                            onClick={() => navigate('/register')}
                        >
                            Register here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
