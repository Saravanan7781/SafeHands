import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const GrievanceForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await api.post('/grievances', { title, description });

            if (response.status === 201) {
                setMessage('Grievance filed successfully!');
                setTitle('');
                setDescription('');
                setTimeout(() => navigate('/dashboard/worker'), 2000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to file grievance. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>File a Grievance</h2>
                {message && (
                    <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}
                        style={{
                            padding: '1rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
                            color: message.includes('successfully') ? '#155724' : '#721c24'
                        }}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title / Subject</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Brief title of the issue"
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your grievance in detail"
                            required
                            rows="5"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', resize: 'vertical' }}
                        ></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ flex: 1, padding: '0.75rem' }}
                        >
                            {loading ? 'Submitting...' : 'Submit Grievance'}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/dashboard/worker')}
                            style={{ padding: '0.75rem' }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GrievanceForm;
