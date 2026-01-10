import React, { useState, useEffect } from 'react';
import { ENDPOINTS } from '../../config/api';
import './Settings.css';
import Popup from '../../components/Popup/Popup';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile'); // set the active section
    const [loading, setLoading] = useState(false);

    const [popup, setPopup] = useState({ isOpen: false, message: '', type: '' });

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        address: '',
        currentPassword: '',
        newPassword: ''
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || '',
                email: user.email || '',
                address: user.address || ''
            }));
        }
    }, []);



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(ENDPOINTS.PROFILE_UPDATE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email, // identify user
                    username: formData.username,
                    address: formData.address
                })
            });

            if (response.ok) {
                setPopup({ isOpen: true, message: "Profile Updated Successfully!", type: "success" });
                // update the local storage with new data
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const updatedUser = { ...currentUser, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setTimeout(() => window.location.reload(), 1500); // refresh to show new name in navbar
            } else {
                setPopup({ isOpen: true, message: "Failed to update profile.", type: "error" });
            }
        } catch (error) {
            console.error("Error:", error);
            setPopup({ isOpen: true, message: "Server connection failed.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (formData.newPassword !== formData.confirmPassword) {
            setPopup({ isOpen: true, message: "New passwords do not match!", type: "error" });
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setPopup({ isOpen: true, message: "Password must be at least 6 characters long.", type: "error" });
            setLoading(false);
            return;
        }

        try {

            const passwordEndpoint = ENDPOINTS.PROFILE_UPDATE.replace('/update', '/password');

            const response = await fetch(passwordEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                setPopup({ isOpen: true, message: "Password updated successfully!", type: "success" });
                // Clear password fields
                setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
                setTimeout(() => setActiveTab('profile'), 1500);
            } else {
                setPopup({ isOpen: true, message: "Failed to update password: " + (result.message || "Unknown error"), type: "error" });
            }
        } catch (error) {
            console.error("Error:", error);
            setPopup({ isOpen: true, message: "Server connection failed.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <Popup
                isOpen={popup.isOpen}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, isOpen: false })}
            />
            <div className="settings-sidebar">
                <h3>Settings</h3>
                <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Edit Profile</button>
                <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>Security & Password</button>
            </div>

            <div className="settings-content">
                {/* Edit Profile section */}
                {activeTab === 'profile' && (
                    <form className="profile-form" onSubmit={handleUpdateProfile}>
                        <h2>Edit Profile </h2>

                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} disabled className="disabled-input" />
                        </div>



                        <div className="form-group">
                            <label>Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows="3" placeholder="Shipping address..." />
                        </div>

                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                )}



                {/* Password section */}
                {activeTab === 'security' && (
                    <form className="security-section" onSubmit={handleUpdatePassword}>
                        <h2>Change Password</h2>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                placeholder="Enter current password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={formData.confirmPassword || ''}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Settings;