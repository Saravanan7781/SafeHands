import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';

const GrievanceForm = () => {
    const { t } = useTranslation();
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
                setMessage(t('grievance.success_msg', 'Grievance filed successfully!'));
                setTitle('');
                setDescription('');
                setTimeout(() => navigate('/dashboard/worker'), 2000);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || t('grievance.error_msg', 'Failed to file grievance. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>{t('grievance.form_title')}</h2>
                {message && (
                    <div className={`alert ${message.includes('successfully') || message === t('grievance.success_msg') ? 'alert-success' : 'alert-error'}`}
                        style={{
                            padding: '1rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            backgroundColor: (message.includes('successfully') || message === t('grievance.success_msg')) ? '#d4edda' : '#f8d7da',
                            color: (message.includes('successfully') || message === t('grievance.success_msg')) ? '#155724' : '#721c24'
                        }}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('grievance.label_title')}</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('grievance.placeholder_title')}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('grievance.label_description')}</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('grievance.placeholder_description')}
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
                            {loading ? t('grievance.btn_submitting') : t('grievance.btn_submit')}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/dashboard/worker')}
                            style={{ padding: '0.75rem' }}
                        >
                            {t('grievance.btn_cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GrievanceForm;
