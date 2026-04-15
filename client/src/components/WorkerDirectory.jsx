import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiUser, FiMapPin, FiBriefcase, FiCalendar, FiArrowLeft, FiX, FiTrash2, FiAlertTriangle, FiClock, FiTrendingUp, FiAlertCircle, FiDownload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './WorkerDirectory.css';

const WorkerDirectory = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [editHistoryMode, setEditHistoryMode] = useState(false);

    // Deletion states
    const [workerToDelete, setWorkerToDelete] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        name: '',
        state: '',
        minAge: '',
        maxAge: '',
        skills: [],
        company: '',
        currentCompanyOnly: false
    });

    const [allCompanies, setAllCompanies] = useState([]);

    useEffect(() => {
        const fetchAllCompanies = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/workers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const companiesSet = new Set();
                response.data.forEach(worker => {
                    if (worker.currentEmployment && worker.currentEmployment.companyName) {
                        companiesSet.add(worker.currentEmployment.companyName);
                    }
                    if (worker.employmentHistory) {
                        worker.employmentHistory.forEach(job => {
                            if (job.companyName) companiesSet.add(job.companyName);
                        });
                    }
                });
                setAllCompanies(Array.from(companiesSet).sort());
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchAllCompanies();
    }, [token]);

    const availableSkills = [
        'construction', 'plumbing', 'electrical', 'carpentry',
        'farming', 'domestic_help', 'driver', 'tailoring', 'other'
    ];

    const fetchWorkers = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.name) queryParams.append('name', filters.name);
            if (filters.state) queryParams.append('state', filters.state);
            if (filters.minAge) queryParams.append('minAge', filters.minAge);
            if (filters.maxAge) queryParams.append('maxAge', filters.maxAge);
            if (filters.company) {
                queryParams.append('company', filters.company);
                if (filters.currentCompanyOnly) queryParams.append('currentCompanyOnly', 'true');
            }
            if (filters.skills.length > 0) queryParams.append('skills', filters.skills.join(','));

            const response = await axios.get(`http://localhost:5000/api/workers?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWorkers(response.data);
        } catch (error) {
            console.error('Error fetching workers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, [filters]);

    const handleSkillToggle = (skill) => {
        setFilters(prev => {
            const newSkills = prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill];
            return { ...prev, skills: newSkills };
        });
    };

    const handleViewProfile = (worker) => {
        setSelectedWorker(worker);
        setShowProfile(true);
    };

    const handleDeleteClick = (e, worker) => {
        e.stopPropagation();
        setWorkerToDelete(worker);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/workers/${workerToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWorkers(workers.filter(w => w._id !== workerToDelete._id));
            setShowDeleteConfirm(false);
            setWorkerToDelete(null);
        } catch (error) {
            console.error('Error deleting worker:', error);
            alert(t('directory.toast_delete_error', 'Failed to delete worker'));
        }
    };

    const handleDeleteTimelineItem = async (workerId, timelineId) => {
        if (!window.confirm(t('directory.confirm_delete_timeline', 'Are you sure you want to delete this work record?'))) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/workers/${workerId}/timeline/${timelineId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update selected worker in modal
            setSelectedWorker({
                ...selectedWorker,
                employmentHistory: response.data.employmentHistory
            });

            // Update workers list to reflect changes
            setWorkers(workers.map(w => w._id === workerId ? { ...w, employmentHistory: response.data.employmentHistory } : w));

        } catch (error) {
            console.error('Error deleting timeline item:', error);
            alert(t('directory.toast_delete_timeline_error', 'Failed to delete work record'));
        }
    };

    const handleDownloadExcel = async () => {
        try {
            const queryParams = new URLSearchParams();
            if (filters.name) queryParams.append('name', filters.name);
            if (filters.state) queryParams.append('state', filters.state);
            if (filters.minAge) queryParams.append('minAge', filters.minAge);
            if (filters.maxAge) queryParams.append('maxAge', filters.maxAge);
            if (filters.company) {
                queryParams.append('company', filters.company);
                if (filters.currentCompanyOnly) queryParams.append('currentCompanyOnly', 'true');
            }
            if (filters.skills.length > 0) queryParams.append('skills', filters.skills.join(','));

            const response = await axios.get(`http://localhost:5000/api/workers/export/workers?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Workers_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading Excel:', error);
            alert(t('directory.toast_download_error', 'Failed to download Excel report'));
        }
    };

    return (
        <div className="directory-container">
            <div className="directory-content">
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3><FiFilter /> {t('directory.filters_title')}</h3>

                        <div className="filter-item">
                            <label>{t('directory.label_worker_name')}</label>
                            <div className="search-input-wrapper">
                                <FiUser className="input-icon" />
                                <input
                                    type="text"
                                    placeholder={t('directory.placeholder_name')}
                                    value={filters.name}
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="filter-item">
                            <label>{t('directory.label_company')}</label>
                            <div className="search-input-wrapper" style={{ marginBottom: '0.5rem' }}>
                                <FiBriefcase className="input-icon" />
                                <input
                                    type="text"
                                    list="companiesList"
                                    placeholder={t('directory.placeholder_company')}
                                    value={filters.company}
                                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                                />
                                <datalist id="companiesList">
                                    {allCompanies.map((c, i) => (
                                        <option key={i} value={c} />
                                    ))}
                                </datalist>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'normal', color: 'var(--text-secondary)' }}>
                                <input 
                                    type="checkbox" 
                                    checked={filters.currentCompanyOnly}
                                    onChange={(e) => setFilters({ ...filters, currentCompanyOnly: e.target.checked })}
                                    style={{ width: 'auto', margin: 0 }}
                                />
                                {t('directory.label_current_company_only')}
                            </label>
                        </div>

                        <div className="filter-item">
                            <label>{t('directory.label_state')}</label>
                            <div className="search-input-wrapper">
                                <FiMapPin className="input-icon" />
                                <input
                                    type="text"
                                    placeholder={t('directory.placeholder_state')}
                                    value={filters.state}
                                    onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="filter-item">
                            <label>{t('directory.label_age_range')}</label>
                            <div className="age-inputs">
                                <input
                                    type="number"
                                    placeholder={t('directory.placeholder_min')}
                                    value={filters.minAge}
                                    onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder={t('directory.placeholder_max')}
                                    value={filters.maxAge}
                                    onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="filter-item">
                            <label>{t('directory.label_skills')}</label>
                            <div className="skills-grid">
                                {availableSkills.map(skill => (
                                    <button
                                        key={skill}
                                        className={`skill-chip ${filters.skills.includes(skill) ? 'active' : ''}`}
                                        onClick={() => handleSkillToggle(skill)}
                                    >
                                        {t(`skills.${skill}`)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-actions">
                            <button className="download-excel-btn" onClick={handleDownloadExcel}>
                                <FiDownload /> {t('directory.btn_download_excel', 'Download Excel')}
                            </button>
                            <button className="reset-filters" onClick={() => setFilters({ name: '', state: '', minAge: '', maxAge: '', skills: [], company: '', currentCompanyOnly: false })}>
                                {t('directory.btn_clear_filters')}
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="workers-main">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loader"></div>
                            <p>{t('directory.loading_directory')}</p>
                        </div>
                    ) : workers.length === 0 ? (
                        <div className="empty-state">
                            <FiSearch size={48} />
                            <h3>{t('directory.empty_title')}</h3>
                            <p>{t('directory.empty_desc')}</p>
                        </div>
                    ) : (
                        <div className="workers-grid">
                            {workers.map(worker => (
                                <div key={worker._id} className="worker-card">
                                    <button className="delete-card-btn" onClick={(e) => handleDeleteClick(e, worker)} title={t('directory.btn_remove_worker')}>
                                        <FiTrash2 />
                                    </button>
                                    <div className="worker-avatar">
                                        <FiUser size={32} />
                                    </div>
                                    <div className="worker-info">
                                        <h3>{worker.fullName}</h3>
                                        <p className="worker-meta"><FiMapPin /> {worker.nativeState}</p>
                                        <p className="worker-meta"><FiCalendar /> {worker.age} {t('profile.label_age', 'years')}</p>
                                        <div className="worker-skills">
                                            {worker.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="mini-skill">
                                                    {t(`skills.${skill.toLowerCase().replace(' ', '_')}`, skill)}
                                                </span>
                                            ))}
                                            {worker.skills.length > 3 && <span>+{worker.skills.length - 3}</span>}
                                        </div>
                                    </div>
                                    <button className="view-profile-btn" onClick={() => handleViewProfile(worker)}>
                                        {t('directory.btn_view_profile')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {showProfile && selectedWorker && (
                <div className="profile-overlay" onClick={() => setShowProfile(false)}>
                    <div className="profile-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowProfile(false)}><FiX /></button>
                        <div className="modal-header">
                            <div className="modal-avatar"><FiUser size={48} /></div>
                            <div className="modal-title">
                                <h2>{selectedWorker.fullName}</h2>
                                <p>{t('directory.modal_subtitle')}</p>
                            </div>
                        </div>
                        <div className="modal-body split-modal">
                            {/* Left Side: Personal Details */}
                            <div className="modal-left-pane">
                                <section className="info-section">
                                    <h3>{t('directory.modal_personal_details')}</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>{t('profile.label_age')}</label>
                                            <p>{selectedWorker.age} {t('profile.label_age', 'years')}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>{t('profile.label_phone')}</label>
                                            <p>{selectedWorker.phoneNumber}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>{t('profile.label_state')}</label>
                                            <p>{selectedWorker.nativeState}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>{t('profile.label_district')}</label>
                                            <p>{selectedWorker.currentDistrict}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>{t('profile.label_skills')}</label>
                                            <p>{selectedWorker.preferredLanguage}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>{t('profile.label_id')}</label>
                                            <p>{selectedWorker.migrantId}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="info-section">
                                    <h3>{t('directory.modal_skills_expertise')}</h3>
                                    <div className="skills-container">
                                        {selectedWorker.skills.map((skill, i) => (
                                            <span key={i} className="skill-badge">
                                                <FiBriefcase size={12} /> {t(`skills.${skill.toLowerCase().replace(' ', '_')}`, skill)}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Right Side: Professional Journey Timeline */}
                            <div className="modal-right-pane">
                                <div className="pane-header-flex">
                                    <h3 className="pane-title"><FiTrendingUp /> {t('directory.modal_work_journey')}</h3>
                                    <button
                                        className={`timeline-manage-btn ${editHistoryMode ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditHistoryMode(!editHistoryMode);
                                        }}
                                        title={editHistoryMode ? t('manager.btn_close') : t('directory.btn_remove_worker')}
                                        type="button"
                                    >
                                        <FiTrash2 style={{ pointerEvents: 'none' }} />
                                    </button>
                                </div>
                                <div className="overlay-timeline-wrapper">
                                    {selectedWorker.employmentHistory && selectedWorker.employmentHistory.length > 0 ? (
                                        selectedWorker.employmentHistory.map((job, index) => (
                                            <div key={job._id || index} className="overlay-timeline-node">
                                                <div className="overlay-timeline-card">
                                                    {editHistoryMode && (
                                                        <button
                                                            className="delete-timeline-item"
                                                            onClick={() => handleDeleteTimelineItem(selectedWorker._id, job._id)}
                                                            title={t('directory.btn_remove_worker')}
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    )}
                                                    <div className="overlay-job-header">
                                                        <div className="overlay-company-initial">
                                                            {job.companyName.charAt(0)}
                                                        </div>
                                                        <div className="overlay-job-title">
                                                            <h4>{job.companyName}</h4>
                                                            <p>{job.role}</p>
                                                        </div>
                                                    </div>
                                                    <div className="overlay-job-meta">
                                                        <span className="overlay-job-date">
                                                            <FiClock /> {new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : t('profile.timeline_present')}
                                                        </span>
                                                        {job.duration && <span className="overlay-duration">{job.duration}</span>}
                                                    </div>
                                                </div>

                                                {index < selectedWorker.employmentHistory.length - 1 && (
                                                    <div className={`overlay-zigzag-connector ${index % 2 === 0 ? 'to-left' : 'to-right'}`}>
                                                        <svg width="100%" height="80" viewBox="0 0 400 80" fill="none" preserveAspectRatio="none">
                                                            {index % 2 === 0 ? (
                                                                <g>
                                                                    <path
                                                                        d="M 350 0 C 420 20, 420 40, 200 40 C 0 40, 0 40, 50 80"
                                                                        stroke="var(--accent-color)"
                                                                        strokeWidth="3"
                                                                        strokeLinecap="round"
                                                                        strokeDasharray="6 8"
                                                                        className="flow-path"
                                                                    />
                                                                    <path d="M 45 75 L 50 80 L 40 78" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" />
                                                                </g>
                                                            ) : (
                                                                <g>
                                                                    <path
                                                                        d="M 50 0 C -20 20, -20 40, 200 40 C 420 40, 420 40, 350 80"
                                                                        stroke="var(--accent-color)"
                                                                        strokeWidth="3"
                                                                        strokeLinecap="round"
                                                                        strokeDasharray="6 8"
                                                                        className="flow-path"
                                                                    />
                                                                    <path d="M 355 75 L 350 80 L 360 78" stroke="var(--accent-color)" strokeWidth="3" strokeLinecap="round" />
                                                                </g>
                                                            )}
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="overlay-empty-timeline">
                                            <FiAlertCircle size={32} />
                                            <p>{t('directory.modal_empty_timeline')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-primary" onClick={() => (window.location.href = `tel:${selectedWorker.phoneNumber}`)}>
                                {t('directory.modal_btn_contact')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="delete-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="delete-modal" onClick={e => e.stopPropagation()}>
                        <div className="delete-modal-icon">
                            <FiAlertTriangle size={40} />
                        </div>
                        <h2>{t('directory.delete_modal_title')}</h2>
                        <p>{t('directory.delete_modal_desc', { name: workerToDelete?.fullName })}</p>
                        <div className="delete-modal-actions">
                            <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>{t('directory.btn_cancel')}</button>
                            <button className="confirm-delete-btn" onClick={confirmDelete}>{t('directory.btn_confirm_delete')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerDirectory;
