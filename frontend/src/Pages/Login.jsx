    import React, { useState } from 'react'
    import email_icon from '../assets/email.png'
    import padlock_icon from '../assets/padlock.png'
    import eye_closed_icon from '../assets/eye_closed.png'
    import eye_opened_icon from '../assets/eye_opened.png'
    import '../CSS/Login.css'

    const Login = ({onFormSwitch, setIsLoggedIn}) => {

        const [showPassword, setShowPassword] = useState(false);
        const [loginMessage, setLoginMessage] = useState('');   
        const handleLoginForm = async (event) =>{
            // Prevent normal form submission so we can use fetch
            event.preventDefault();

            // Create a FormData instance from the form element
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            const url = 'http://localhost:8082/MappingServlets-1.0-SNAPSHOT/login';
            try {
            // 4. Send the POST request using fetch
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    // This header tells the servlet how the data is encoded
                    'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    // Convert the JavaScript data object into URL-encoded format
                    body: new URLSearchParams(data)
            });

            // 5. Parse the JSON response from the servlet
            const result = await response.json();

            // 6. Check if the login was successful based on the response
            if (response.ok && result.success) { // Check both HTTP status and JSON payload
                setLoginMessage('Login successful!');
                console.log('Login successful!', result.message);
                // Add logic here: save token, redirect, update UI state, etc.
                alert('Login successful!'); // Simple feedback for now
            } else {
                setLoginMessage('Login failed: ' + result.message);
                console.error('Login failed:', result.message);
                alert('Login failed: ' + result.message); // Show error to user
            }

        } catch (error) {
            // Handle network errors or other issues
            setLoginMessage('An error occurred. Please try again.');
            console.error('An error occurred during login:', error);
            alert('An error occurred. Please check the console.');
        }
        };
        const togglePasswordVisibility = () => {
            setShowPassword(prev => !prev);
        }

        const handleSignupClick = (e) => {
            e.preventDefault(); 

            if (onFormSwitch) {
                onFormSwitch('signup');
            }
        };

        return (
            
            <div className='login-container'>
                <h2 className='form-title'>Log In Now</h2>

                <form onSubmit={handleLoginForm} className="login-form">{/* this form here will be handled by our back end*/}
                    <div className="input-wrapper">
                        <img src={email_icon} alt="Email" className='email-icon'/>
                        <input name="email" type="email" placeholder="Email Address" className="input-field" required/>
                    </div>

                    <div className="input-wrapper">
                        <img src={padlock_icon} alt="Email" className='padlock-icon'/>
                        <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" className="input-field" required/>
                        <img src={showPassword ? eye_opened_icon : eye_closed_icon} alt="Toggle Password Visibility" className='password-toggle-icon' onClick={togglePasswordVisibility}/>
                    </div>
                    
                    <a href="#" className="forgot-password">Forgot Password?</a>{/* Okay this part we probably wont add ahahh
                    */}

                    <button type="submit" className="login-button">Log In</button>
                </form>

                <p className="signup-text">Don't have an account? <a href="/signup" onClick={handleSignupClick}>Sign up here</a></p>

            </div>
        )
    }

    export default Login