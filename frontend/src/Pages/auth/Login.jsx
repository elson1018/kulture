import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../config/api";
import email_icon from "../../assets/email.png";
import padlock_icon from "../../assets/padlock.png";
import eye_closed_icon from "../../assets/eye_closed.png";
import eye_opened_icon from "../../assets/eye_opened.png";
import "./Login.css";
import Popup from "../../components/Popup/Popup";

const Login = ({ onFormSwitch, setUser }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //State to manage popup
  const [popup, setPopup] = useState({ show: false, msg: "", type: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const closePopup = () => {
    setPopup({ ...popup, show: false });

    // If it was a success, navigate after the user clicks "Close"
    if (popup.type === "success") {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  };

  const handleLoginForm = async (event) => {
    event.preventDefault();

    const datatoSend = {
      email: formData.email,
      password: formData.password,
    };

    const url = ENDPOINTS.AUTH_LOGIN;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(datatoSend),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {


        const userData = {
          ...result.user,
          role: result.role,
        };

        setUser(userData);
        //Using localStorage to store data , so refreshing wont log out the user
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", result.role);

        setPopup({
          show: true,
          msg: " Login successful!",
          type: "success"
        });

      } else {
        setPopup({
          show: true,
          msg: "Login failed: " + (result.message || "Invalid credentials"),
          type: "error"
        });
      }
    } catch (error) {
      setPopup({
        show: true,
        msg: "An error occurred. Please check your connection.",
        type: "error"
      });
    }
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    if (onFormSwitch) {
      onFormSwitch("signup");
    }
  };

  return (
    <div className="login-container">
      <Popup
        isOpen={popup.show}
        message={popup.msg}
        type={popup.type}
        onClose={closePopup}
      />
      <h2 className="form-title">Log In Now</h2>

      <form onSubmit={handleLoginForm} className="login-form">
        {/* this form here will be handled by our back end*/}
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
          <img src={padlock_icon} alt="Email" className="padlock-icon" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input-field"
            onChange={handleChange}
            required
          />
          <img
            src={showPassword ? eye_opened_icon : eye_closed_icon}
            alt="Toggle Password Visibility"
            className="password-toggle-icon"
            onClick={togglePasswordVisibility}
          />
        </div>

        <div
          className="forgot-password"
          onClick={() => navigate("/forgot-password")}
          style={{ cursor: "pointer" }}
        >
          Forgot Password?
        </div>

        <button type="submit" className="login-button">
          Log In
        </button>

      </form>

      <p className="signup-text">
        Don't have an account?{" "}
        <a href="/signup" onClick={handleSignupClick}>
          Sign up here
        </a>
      </p>
    </div>
  );
};

export default Login;
