import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiFilePlus, FiArrowLeft, FiType, FiCalendar, FiActivity, FiMessageSquare, FiDownload, FiUploadCloud, FiCheckCircle, FiLoader, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ReportSubmission = () => {
    const { t } = useTranslation();
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
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setReportFile(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setReportFile(e.dataTransfer.files[0]);
        }
    };

    const handleDownloadData = async () => {
        toast.loading(t('report.toast_generating', 'Generating Excel report...'), { id: 'export' });
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
            toast.success(t('report.toast_download_success', 'Worker data downloaded!'), { id: 'export' });
        } catch (error) {
            console.error('Error downloading data:', error);
            toast.error(t('report.toast_download_error', 'Failed to download worker data.'), { id: 'export' });
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
            toast.success(t('report.toast_submit_success', 'Performance report submitted to Admin.'));
            navigate('/dashboard/manager');
        } catch (error) {
            console.error('Error submitting report:', error);
            toast.error(t('report.toast_submit_error', 'Failed to submit report. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

                    .premium-wrapper {
                        font-family: 'Outfit', sans-serif;
                        max-width: 850px;
                        margin: 2rem auto;
                        padding: 0 1.5rem;
                        animation: fadeIn 0.6s ease-out;
                    }

                    .back-btn-modern {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.6rem 1.2rem;
                        color: #64748b;
                        background: rgba(255, 255, 255, 0.7);
                        border: 1px solid #e2e8f0;
                        border-radius: 99px;
                        font-weight: 600;
                        font-size: 0.95rem;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        backdrop-filter: blur(10px);
                        margin-bottom: 2rem;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.02);
                    }

                    .back-btn-modern:hover {
                        color: #0f172a;
                        background: #ffffff;
                        transform: translateX(-4px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                    }

                    .premium-card {
                        background: rgba(255, 255, 255, 0.85);
                        backdrop-filter: blur(24px);
                        border: 1px solid rgba(255, 255, 255, 0.6);
                        border-radius: 28px;
                        padding: 3.5rem;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,1);
                        position: relative;
                        overflow: hidden;
                    }

                    .card-decoration-1 {
                        position: absolute;
                        top: -100px;
                        right: -100px;
                        width: 300px;
                        height: 300px;
                        background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%);
                        z-index: 0;
                        border-radius: 50%;
                        pointer-events: none;
                    }

                    .card-decoration-2 {
                        position: absolute;
                        bottom: -100px;
                        left: -50px;
                        width: 250px;
                        height: 250px;
                        background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 70%);
                        z-index: 0;
                        border-radius: 50%;
                        pointer-events: none;
                    }

                    .premium-header {
                        text-align: center;
                        margin-bottom: 3.5rem;
                        position: relative;
                        z-index: 1;
                    }

                    .icon-container {
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
                        color: #4f46e5;
                        border-radius: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1.5rem;
                        font-size: 2.2rem;
                        box-shadow: 0 10px 25px rgba(79, 70, 229, 0.15), inset 0 2px 0 rgba(255,255,255,0.5);
                        transform: rotate(-5deg);
                        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }

                    .premium-card:hover .icon-container {
                        transform: rotate(0deg) scale(1.05);
                        box-shadow: 0 15px 35px rgba(79, 70, 229, 0.2), inset 0 2px 0 rgba(255,255,255,0.7);
                    }

                    .premium-title {
                        font-size: 2.2rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-bottom: 0.75rem;
                        letter-spacing: -0.03em;
                    }

                    .premium-subtitle {
                        color: #64748b;
                        font-size: 1.1rem;
                        font-weight: 400;
                        max-width: 85%;
                        margin: 0 auto;
                        line-height: 1.6;
                    }

                    .download-btn {
                        margin-top: 1.5rem;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.75rem;
                        background: linear-gradient(to right, #ecfdf5, #d1fae5);
                        color: #059669;
                        border: 1px solid #6ee7b7;
                        padding: 0.8rem 1.6rem;
                        border-radius: 14px;
                        font-weight: 600;
                        font-size: 0.95rem;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.08);
                    }

                    .download-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.15);
                        background: linear-gradient(to right, #d1fae5, #a7f3d0);
                    }

                    .download-btn:active {
                        transform: translateY(1px);
                    }

                    .form-grid-modern {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 2rem;
                        position: relative;
                        z-index: 1;
                    }

                    .form-row {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                    }

                    @media (max-width: 640px) {
                        .form-row {
                            grid-template-columns: 1fr;
                        }
                    }

                    .input-group {
                        display: flex;
                        flex-direction: column;
                        gap: 0.6rem;
                    }

                    .input-label {
                        font-size: 0.95rem;
                        font-weight: 600;
                        color: #334155;
                        margin-left: 0.25rem;
                    }

                    .input-wrapper {
                        position: relative;
                        display: flex;
                        align-items: center;
                    }

                    .input-icon {
                        position: absolute;
                        left: 1.25rem;
                        color: #94a3b8;
                        font-size: 1.2rem;
                        transition: color 0.3s ease;
                    }

                    .modern-input {
                        width: 100%;
                        padding: 1.1rem 1.1rem 1.1rem 3.2rem;
                        background: #f8fafc;
                        border: 1.5px solid #e2e8f0;
                        border-radius: 16px;
                        font-size: 1.05rem;
                        color: #0f172a;
                        font-weight: 500;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
                    }

                    .modern-input::placeholder {
                        color: #cbd5e1;
                        font-weight: 400;
                    }

                    .modern-input:focus {
                        outline: none;
                        background: #ffffff;
                        border-color: #6366f1;
                        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15), inset 0 1px 2px rgba(0,0,0,0.01);
                    }

                    .modern-input:focus + .input-icon,
                    .input-wrapper:focus-within .input-icon {
                        color: #6366f1;
                    }

                    .modern-textarea {
                        min-height: 140px;
                        padding-top: 1.1rem;
                        resize: vertical;
                    }

                    .modern-textarea-icon {
                        top: 1.3rem;
                    }

                    .file-upload-wrapper {
                        position: relative;
                        margin-top: 0.5rem;
                    }

                    .file-upload-zone {
                        border: 2px dashed #cbd5e1;
                        border-radius: 20px;
                        padding: 2.5rem;
                        text-align: center;
                        background: #f8fafc;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 1.2rem;
                    }

                    .file-upload-zone:hover, .file-upload-zone.drag-active {
                        border-color: #6366f1;
                        background: #eef2ff;
                        box-shadow: inset 0 0 0 4px rgba(99, 102, 241, 0.05);
                    }

                    .file-icon-lg {
                        font-size: 3rem;
                        color: #a5b4fc;
                        transition: all 0.3s ease;
                    }

                    .file-upload-zone:hover .file-icon-lg, .file-upload-zone.drag-active .file-icon-lg {
                        transform: translateY(-8px) scale(1.1);
                        color: #6363f1;
                    }

                    .file-upload-text {
                        font-size: 1.1rem;
                        color: #334155;
                        font-weight: 600;
                    }

                    .file-upload-subtext {
                        font-size: 0.9rem;
                        color: #94a3b8;
                    }

                    .file-input {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                        cursor: pointer;
                    }

                    .selected-file-card {
                        display: flex;
                        align-items: center;
                        gap: 1.2rem;
                        padding: 1.2rem 1.5rem;
                        background: #ecfdf5;
                        border: 1px solid #10b981;
                        border-radius: 16px;
                        margin-top: 1.5rem;
                        animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.05);
                    }

                    .file-detail-icon {
                        color: #10b981;
                        font-size: 1.5rem;
                    }

                    .file-name {
                        color: #065f46;
                        font-weight: 600;
                        font-size: 0.95rem;
                    }

                    .submit-btn-modern {
                        width: 100%;
                        margin-top: 1.5rem;
                        padding: 1.3rem;
                        background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
                        color: white;
                        border: none;
                        border-radius: 16px;
                        font-size: 1.15rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                        box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.75rem;
                        position: relative;
                        z-index: 1;
                        overflow: hidden;
                        letter-spacing: 0.02em;
                    }

                    .submit-btn-modern::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                        transition: all 0.6s ease;
                    }

                    .submit-btn-modern:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 15px 35px rgba(79, 70, 229, 0.4);
                    }

                    .submit-btn-modern:hover::before {
                        left: 100%;
                    }

                    .submit-btn-modern:active {
                        transform: translateY(1px);
                    }

                    .submit-btn-modern:disabled {
                        opacity: 0.7;
                        cursor: not-allowed;
                        transform: translateY(0);
                        box-shadow: none;
                    }

                    @keyframes slideIn {
                        from { opacity: 0; transform: translateY(-15px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .spinner {
                        animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                    }

                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>

            <div className="premium-wrapper">
                <button className="back-btn-modern" onClick={() => navigate('/dashboard/manager')}>
                    <FiArrowLeft /> {t('manager.btn_back')}
                </button>

                <div className="premium-card">
                    <div className="card-decoration-1"></div>
                    <div className="card-decoration-2"></div>

                    <div className="premium-header">
                        <div className="icon-container">
                            <FiFilePlus />
                        </div>
                        <h2 className="premium-title">{t('report.title')}</h2>
                        <p className="premium-subtitle">{t('report.subtitle')}</p>

                        <button type="button" onClick={handleDownloadData} className="download-btn">
                            <FiDownload style={{ fontSize: '1.2rem' }} /> {t('report.btn_generate_data')}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="form-grid-modern">
                        <div className="input-group">
                            <label className="input-label">{t('report.label_title')}</label>
                            <div className="input-wrapper">
                                <FiType className="input-icon" />
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder={t('report.placeholder_title')}
                                    className="modern-input"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label className="input-label">{t('report.label_month')}</label>
                                <div className="input-wrapper">
                                    <FiCalendar className="input-icon" />
                                    <input
                                        type="month"
                                        name="month"
                                        required
                                        value={formData.month}
                                        onChange={handleChange}
                                        className="modern-input"
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">{t('report.label_tasks')}</label>
                                <div className="input-wrapper">
                                    <FiActivity className="input-icon" />
                                    <input
                                        type="number"
                                        name="tasksCompleted"
                                        required
                                        value={formData.tasksCompleted}
                                        onChange={handleChange}
                                        placeholder={t('report.placeholder_tasks')}
                                        className="modern-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">{t('report.label_metrics')}</label>
                            <div className="input-wrapper" style={{ alignItems: 'flex-start' }}>
                                <FiMessageSquare className="input-icon modern-textarea-icon" />
                                <textarea
                                    name="welfareMetrics"
                                    required
                                    value={formData.welfareMetrics}
                                    onChange={handleChange}
                                    placeholder={t('report.placeholder_metrics')}
                                    className="modern-input modern-textarea"
                                ></textarea>
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">{t('report.label_file')}</label>
                            <div className="file-upload-wrapper">
                                <div 
                                    className={`file-upload-zone ${dragActive ? 'drag-active' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        name="reportFile"
                                        onChange={handleFileChange}
                                        accept=".xlsx,.xls,.csv"
                                        className="file-input"
                                    />
                                    <FiUploadCloud className="file-icon-lg" />
                                    <div>
                                        <div className="file-upload-text">{t('report.file_upload_text')}</div>
                                        <div className="file-upload-subtext">{t('report.file_upload_subtext')}</div>
                                    </div>
                                </div>
                                
                                {reportFile && (
                                    <div className="selected-file-card">
                                        <FiCheckCircle className="file-detail-icon" />
                                        <span className="file-name">{reportFile.name} ({(reportFile.size / 1024).toFixed(1)} KB)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="submit-btn-modern" disabled={loading}>
                            {loading ? (
                                <>
                                    <FiLoader className="spinner" /> {t('report.btn_submitting')}
                                </>
                            ) : (
                                <>
                                    <FiCheckCircle style={{ fontSize: '1.25rem' }} /> {t('report.btn_submit')}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ReportSubmission;
