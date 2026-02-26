import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiAlertCircle, FiNavigation, FiCheckCircle, FiShield, FiActivity } from 'react-icons/fi';
import './SOSSection.css';

const SOSSection = () => {
    const [status, setStatus] = useState('idle'); // idle, locating, sending, sent, error
    const [errorMsg, setErrorMsg] = useState('');
    const [alertId, setAlertId] = useState(null);
    const token = localStorage.getItem('token');
    const watchId = useRef(null);

    useEffect(() => {
        // Cleanup watcher on unmount
        return () => {
            if (watchId.current) {
                navigator.geolocation.clearWatch(watchId.current);
            }
        };
    }, []);

    const startLiveTracking = (id) => {
        if (!navigator.geolocation) return;

        watchId.current = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                try {
                    await axios.patch(`http://localhost:5000/api/sos/update-location/${id}`,
                        { location: { latitude, longitude, accuracy } },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log('Location updated live');
                } catch (error) {
                    console.error('Live update failed:', error);
                }
            },
            (error) => console.error('Watch error:', error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const triggerSOS = async () => {
        if (!navigator.geolocation) {
            setStatus('error');
            setErrorMsg('Geolocation is not supported by your browser.');
            return;
        }

        setStatus('locating');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setStatus('sending');

                try {
                    const response = await axios.post('http://localhost:5000/api/sos/trigger',
                        { location: { latitude, longitude, accuracy } },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const newAlertId = response.data.alertId;
                    setAlertId(newAlertId);
                    setStatus('sent');

                    // Start live tracking after successful trigger
                    startLiveTracking(newAlertId);

                    // Reset UI status after 10s but keep tracking
                    setTimeout(() => setStatus('active'), 10000);
                } catch (error) {
                    console.error('SOS Trigger Error:', error);
                    setStatus('error');
                    setErrorMsg('Server error. Please try calling emergency services.');
                }
            },
            (error) => {
                console.error('Geolocation Error:', error);
                setStatus('error');
                setErrorMsg('Location access denied. SOS requires location to help you.');
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    return (
        <div className="sos-container">
            <div className="sos-card">
                <div className="sos-header">
                    <FiShield className="sos-logo" />
                    <h2>Emergency SOS</h2>
                    <p>Press the button below only in case of a real emergency. Your location and profile will be shared with the district manager immediately.</p>
                </div>

                <div className="sos-button-wrapper">
                    <button
                        className={`sos-btn ${status === 'active' || status === 'sent' ? 'sent' : status}`}
                        onClick={triggerSOS}
                        disabled={status === 'sending' || status === 'locating' || status === 'sent' || status === 'active'}
                    >
                        <div className="sos-btn-inner">
                            {status === 'idle' && <span>SOS</span>}
                            {(status === 'locating' || status === 'sending') && <div className="loader-small"></div>}
                            {(status === 'sent' || status === 'active') && <FiCheckCircle size={40} />}
                            {status === 'error' && <FiAlertCircle size={40} />}
                        </div>
                        {status === 'idle' && <div className="sos-pulse"></div>}
                    </button>
                    <p className="status-text">
                        {status === 'idle' && "Press for emergency"}
                        {status === 'locating' && "Getting your location..."}
                        {status === 'sending' && "Notifying Manager..."}
                        {status === 'sent' && "Alert Sent! Stay where you are."}
                        {status === 'active' && "Live tracking active. Help is on the way."}
                        {status === 'error' && errorMsg}
                    </p>
                </div>

                {(status === 'sent' || status === 'active') && (
                    <div className="sos-success-msg">
                        <FiActivity className="live-icon" /> Live tracking is ON.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SOSSection;
