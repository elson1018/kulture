import React, { useState, useEffect } from 'react';
import '../CSS/Settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile'); // set the active section
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    
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
            fetchUserHistory(user.email);
        }
    }, []);

    // Function to fetch all service records
    const fetchUserHistory = async (email) => {
        try {
            const response = await fetch(`http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/bookings?email=${email}`);
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/profile/update', {
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
                <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}>My History</button>
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

                {/* History Section (Purchases and Bookings) */}
                {activeTab === 'history' && (
                    <div className="history-section">
                        <h2>My Service History</h2>
                        {history.length > 0 ? (
                            <div className="history-list">
                                {history.map((item) => (
                                    <div key={item.id} className="history-item">
                                        <div className="history-header">
                                            <span className={`status-badge ${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                            <h3>{item.tutorialName}</h3>
                                        </div>
                                        <div className="history-details">
                                            <p><strong>Type:</strong> {item.scheduledDate ? "Live Class" : "Recorded Tutorial"}</p>
                                            {item.scheduledDate && <p><strong>Scheduled:</strong> {new Date(item.scheduledDate).toLocaleString()}</p>}
                                            <p><strong>Price Paid:</strong> RM{item.price.toFixed(2)}</p>
                                        </div>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>You haven't purchased or booked any tutorials yet.</p>
                        )}
                    </div>
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