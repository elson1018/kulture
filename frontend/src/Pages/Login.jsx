import React, { useState } from 'react'
import email_icon from '../../src/assets/email.png'
import padlock_icon from '../../src/assets/padlock.png'
import eye_closed_icon from '../../src/assets/eye_closed.png'
import eye_opened_icon from '../../src/assets/eye_opened.png'
import './Login.css'

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const handleLoginForm = async (event) =>{
        
    }
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <div className='login-container'>
            <h2 className='form-title'>Log In Now</h2>

            <form action="#" className="login-form">{/* this form here will be handled by our back end*/}
                <div className="input-wrapper">
                    <img src={email_icon} alt="Email" className='email-icon'/>
                    <input type="email" placeholder="Email Address" className="input-field" required/>
                </div>

                <div className="input-wrapper">
                    <img src={padlock_icon} alt="Email" className='padlock-icon'/>
                    <input type={showPassword ? "text" : "password"} placeholder="Password" className="input-field" required/>
                    <img src={showPassword ? eye_opened_icon : eye_closed_icon} alt="Toggle Password Visibility" className='password-toggle-icon' onClick={togglePasswordVisibility}/>
                </div>
                
                <a href="#" className="forgot-password">Forgot Password?</a>{/* Okay this part we probably wont add ahahh
                */}

                <button className="login-button">Log In</button>
            </form>

            <p className="signup-text">Don't have an account? <a href="#">Sign up here</a></p>

        </div>
    )
}

export default Login