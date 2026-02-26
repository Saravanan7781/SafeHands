import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiFilePlus, FiArrowLeft, FiType, FiCalendar, FiActivity, FiMessageSquare, FiDownload, FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ReportSubmission = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        tasksCompleted: '',
        welfareMetrics: ''
    });
    const [reportFile, setReportFile] = useState(null);

    const handleFileChange = (e) => {
        setReportFile(e.target.files[0]);
    };

    const handleDownloadData = async () => {
        toast.loading('Generating Excel report...', { id: 'export' });
        try {
            const response = await axios.get('http://localhost:5000/api/workers/export/workers', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `District_Worker_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Worker data downloaded!', { id: 'export' });
        } catch (error) {
            console.error('Error downloading data:', error);
            toast.error('Failed to download worker data.', { id: 'export' });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('month', formData.month);
        data.append('tasksCompleted', formData.tasksCompleted);
        data.append('welfareMetrics', formData.welfareMetrics);
        if (reportFile) {
            data.append('reportFile', reportFile);
        }

        try {
            await axios.post('http://localhost:5000/api/reports', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Performance report submitted to Admin.');
            navigate('/dashboard/manager');
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error('Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
            <button className="back-btn" onClick={() => navigate('/dashboard/manager')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', padding: 0 }}>
                <FiArrowLeft /> Back to Dashboard
            </button>

            <div className="card" style={{ padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', background: '#fef3c7', color: '#d97706', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>
                        <FiFilePlus />
                    </div>
                    <h2>Monthly Performance Report</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Submit your district's welfare metrics and task completion summary to the Central Admin.</p>

                    <button
                        type="button"
                        onClick={handleDownloadData}
                        style={{
                            marginTop: '1.5rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            background: '#ecfdf5',
                            color: '#059669',
                            border: '1.5px solid #10b98133',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '10px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <FiDownload /> Generate District Worker Data (Excel)
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Report Title</label>
                        <div style={{ position: 'relative' }}>
                            <FiType style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. February 2026 Welfare Audit"
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Reporting Month</label>
                            <div style={{ position: 'relative' }}>
                                <FiCalendar style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="month"
                                    name="month"
                                    required
                                    value={formData.month}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '3rem' }}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Total Tasks Completed</label>
                            <div style={{ position: 'relative' }}>
                                <FiActivity style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="number"
                                    name="tasksCompleted"
                                    required
                                    value={formData.tasksCompleted}
                                    onChange={handleChange}
                                    placeholder="Total count"
                                    style={{ paddingLeft: '3rem' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Welfare Metrics & Summary</label>
                        <div style={{ position: 'relative' }}>
                            <FiMessageSquare style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: '#94a3b8' }} />
                            <textarea
                                name="welfareMetrics"
                                required
                                value={formData.welfareMetrics}
                                onChange={handleChange}
                                placeholder="Details about worker health, safety audits, and grievance resolutions..."
                                rows="5"
                                style={{ paddingLeft: '3rem', paddingTop: '1rem' }}
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Attach Generated Excel Data</label>
                        <div style={{ position: 'relative' }}>
                            <FiUpload style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="file"
                                name="reportFile"
                                onChange={handleFileChange}
                                accept=".xlsx,.xls,.csv"
                                style={{ padding: '0.6rem 0.8rem 0.6rem 3rem', cursor: 'pointer', width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '8px' }}
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontStyle: 'italic' }}>* Please upload the Excel file you generated above after verifying all details.</p>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                        {loading ? 'Submitting...' : 'Submit to Admin Control'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportSubmission;
