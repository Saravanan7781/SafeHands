import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiUser, FiMapPin, FiBriefcase, FiCalendar, FiArrowLeft, FiX, FiTrash2, FiAlertTriangle, FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './WorkerDirectory.css';

const WorkerDirectory = () => {
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
        skills: []
    });

    const availableSkills = [
        'Construction', 'Plumbing', 'Electrical', 'Carpentry',
        'Farming', 'Domestic Help', 'Driver', 'Tailoring', 'Other'
    ];

    const fetchWorkers = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.name) queryParams.append('name', filters.name);
            if (filters.state) queryParams.append('state', filters.state);
            if (filters.minAge) queryParams.append('minAge', filters.minAge);
            if (filters.maxAge) queryParams.append('maxAge', filters.maxAge);
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
            alert('Failed to delete worker');
        }
    };

    const handleDeleteTimelineItem = async (workerId, timelineId) => {
        if (!window.confirm('Are you sure you want to delete this work record?')) return;

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
            alert('Failed to delete work record');
        }
    };

    return (
        <div className="directory-container">
            <div className="directory-content">
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3><FiFilter /> Filters</h3>

                        <div className="filter-item">
                            <label>Worker Name</label>
                            <div className="search-input-wrapper">
                                <FiUser className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={filters.name}
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="filter-item">
                            <label>State</label>
                            <div className="search-input-wrapper">
                                <FiMapPin className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter state..."
                                    value={filters.state}
                                    onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="filter-item">
                            <label>Age Range</label>
                            <div className="age-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minAge}
                                    onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxAge}
                                    onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="filter-item">
                            <label>Skills</label>
                            <div className="skills-grid">
                                {availableSkills.map(skill => (
                                    <button
                                        key={skill}
                                        className={`skill-chip ${filters.skills.includes(skill) ? 'active' : ''}`}
                                        onClick={() => handleSkillToggle(skill)}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="reset-filters" onClick={() => setFilters({ name: '', state: '', minAge: '', maxAge: '', skills: [] })}>
                            Clear All Filters
                        </button>
                    </div>
                </aside>

                <main className="workers-main">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loader"></div>
                            <p>Loading worker directory...</p>
                        </div>
                    ) : workers.length === 0 ? (
                        <div className="empty-state">
                            <FiSearch size={48} />
                            <h3>No workers found</h3>
                            <p>Try adjusting your search or filters to find more result.</p>
                        </div>
                    ) : (
                        <div className="workers-grid">
                            {workers.map(worker => (
                                <div key={worker._id} className="worker-card">
                                    <button className="delete-card-btn" onClick={(e) => handleDeleteClick(e, worker)} title="Remove Worker">
                                        <FiTrash2 />
                                    </button>
                                    <div className="worker-avatar">
                                        <FiUser size={32} />
                                    </div>
                                    <div className="worker-info">
                                        <h3>{worker.fullName}</h3>
                                        <p className="worker-meta"><FiMapPin /> {worker.nativeState}</p>
                                        <p className="worker-meta"><FiCalendar /> {worker.age} years</p>
                                        <div className="worker-skills">
                                            {worker.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="mini-skill">{skill}</span>
                                            ))}
                                            {worker.skills.length > 3 && <span>+{worker.skills.length - 3}</span>}
                                        </div>
                                    </div>
                                    <button className="view-profile-btn" onClick={() => handleViewProfile(worker)}>
                                        View Profile
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
                                <p>Verified SafeHands Worker</p>
                            </div>
                        </div>
                        <div className="modal-body split-modal">
                            {/* Left Side: Personal Details */}
                            <div className="modal-left-pane">
                                <section className="info-section">
                                    <h3>Personal Details</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Age</label>
                                            <p>{selectedWorker.age} years</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Phone Number</label>
                                            <p>{selectedWorker.phoneNumber}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Native State</label>
                                            <p>{selectedWorker.nativeState}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Current District</label>
                                            <p>{selectedWorker.currentDistrict}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Preferred Language</label>
                                            <p>{selectedWorker.preferredLanguage}</p>
                                        </div>
                                        <div className="info-item">
                                            <label>Migrant ID</label>
                                            <p>{selectedWorker.migrantId}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="info-section">
                                    <h3>Skills & Expertise</h3>
                                    <div className="skills-container">
                                        {selectedWorker.skills.map((skill, i) => (
                                            <span key={i} className="skill-badge"><FiBriefcase size={12} /> {skill}</span>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Right Side: Professional Journey Timeline */}
                            <div className="modal-right-pane">
                                <div className="pane-header-flex">
                                    <h3 className="pane-title"><FiTrendingUp /> Work Journey</h3>
                                    <button
                                        className={`timeline-manage-btn ${editHistoryMode ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditHistoryMode(!editHistoryMode);
                                        }}
                                        title={editHistoryMode ? "Done Editing" : "Manage History"}
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
                                                            title="Delete Record"
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
                                                            <FiClock /> {new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}
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
                                            <p>No work history recorded.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-primary" onClick={() => (window.location.href = `tel:${selectedWorker.phoneNumber}`)}>
                                Contact Worker
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
                        <h2>Remove Worker?</h2>
                        <p>Are you sure you want to remove <strong>{workerToDelete?.fullName}</strong> from the directory? This action cannot be undone.</p>
                        <div className="delete-modal-actions">
                            <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="confirm-delete-btn" onClick={confirmDelete}>Remove Worker</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerDirectory;
