import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import email_icon from '../../assets/email.png';
import './ForgotPassword.css';
import Popup from '../../components/Popup/Popup';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [popup, setPopup] = useState({ isOpen: false, message: '', type: '' });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate API call
        setTimeout(() => {
            setPopup({
                isOpen: true,
                message: `Password reset link has been sent to ${email}`,
                type: 'success'
            });

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }, 1000);
    };

    return (
        <div className="forgot-password-container">
            <Popup
                isOpen={popup.isOpen}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, isOpen: false })}
            />

            <h2 className="form-title">Forgot Password?</h2>
            <p className="description">
                Enter your email address below and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="input-wrapper">
                    <img src={email_icon} alt="Email" className="email-icon" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">
                    Send Reset Link
                </button>
            </form>

            <div className="back-to-login">
                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
