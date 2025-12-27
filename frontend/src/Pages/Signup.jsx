import React, { useState } from "react";
import { ENDPOINTS } from "../config/api";
import user_icon from "../assets/user_icon.png";
import email_icon from "../assets/email.png";
import padlock_icon from "../assets/padlock.png";
import eye_closed_icon from "../assets/eye_closed.png";
import eye_opened_icon from "../assets/eye_opened.png";
import "../CSS/Signup.css";

const Signup = ({ onFormSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (onFormSwitch) {
      onFormSwitch("login");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const dataToSend = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      address: "Malaysia", // Placeholder
      role: "CUSTOMER",
      user_fname: formData.fname,
      user_lname: formData.lname,
    };

    try {
      const response = await fetch(ENDPOINTS.AUTH_REGISTER,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        alert("Registration successful! Please log in.");
        onFormSwitch("login");
      } else {
        alert("Registration failed: " + result.message);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Failed to connect to server.");
    }
  };

  return (
    <div className="signup-container">
      <h2>
        Create Your <span>Kulture</span> Account
      </h2>
      <form onSubmit={handleSignup} className="signup-form">
        <div className="input-wrapper">
          <img src={user_icon} alt="First Name" className="email-icon" />
          <input
            name="fname"
            type="text"
            placeholder="First Name"
            className="input-field"
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <img src={user_icon} alt="Last Name" className="email-icon" />
          <input
            name="lname"
            type="text"
            placeholder="Last Name"
            className="input-field"
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <img src={user_icon} alt="User" className="email-icon" />
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="input-field"
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <img src={email_icon} alt="Email" className="email-icon" />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="input-field"
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <img src={padlock_icon} alt="Password" className="padlock-icon" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create Password"
            className="input-field"
            onChange={handleChange}
            required
          />
          <img
            src={showPassword ? eye_opened_icon : eye_closed_icon}
            alt="Toggle"
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          />
        </div>

        <div className="agreement-wrapper">
          <input
            type="checkbox"
            id="terms-agree"
            checked={agreedToTerms}
            onChange={() => setAgreedToTerms(!agreedToTerms)}
            required
          />
          <label htmlFor="terms-agree">
            I agree to Kulture's <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </label>
        </div>

        <button className="signup-button" disabled={!agreedToTerms}>
          Sign Up
        </button>
      </form>

      <p className="login-text">
        Already have an account?{" "}
        <a href="/login" onClick={handleLoginClick}>
          Log In here
        </a>
      </p>
    </div>
  );
};

export default Signup;
