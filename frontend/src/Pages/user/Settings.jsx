import React, { useState, useEffect } from 'react';
import { ENDPOINTS } from '../../config/api';
import './Settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile'); // set the active section
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
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
                phone: user.phone || '',
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
                    phone: formData.phone,
                    address: formData.address
                })
            });

            if (response.ok) {
                alert("Profile Updated Successfully!");
                // update the local storage with new data
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const updatedUser = { ...currentUser, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.location.reload(); // refresh to show new name in navbar
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Server connection failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-container">
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
                            <input type="email" name="email" value={formData.email} disabled className="disabled-input"/>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+601..." />
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
                    <div className="security-section">
                        <h2>Change Password</h2>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" placeholder="Enter new password" />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" placeholder="Confirm new password" />
                        </div>
                        <button className="save-btn">Update Password</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;