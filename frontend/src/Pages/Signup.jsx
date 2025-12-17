import React, { useState } from 'react';
import user_icon from '../assets/user_icon.png'; 
import email_icon from '../assets/email.png';
import padlock_icon from '../assets/padlock.png';
import eye_closed_icon from '../assets/eye_closed.png';
import eye_opened_icon from '../assets/eye_opened.png';
import '../CSS/Signup.css';


const Signup = ({onFormSwitch}) => {
    const [role, setRole] = useState("CUSTOMER"); // Default role
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        companyName: '', 
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        if(onFormSwitch) {
            onFormSwitch('login');
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        
        const dataToSend = {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            address: "Malaysia", // Placeholder
            role: role === 'supplier' ? 'SUPPLIER' : 'CUSTOMER'
        };

        // --- 3. Add Role-Specific Fields ---
        if (role === 'supplier') {
            // Supplier needs Company Name
            dataToSend.companyName = formData.companyName;
        } else {
         
            dataToSend.user_fname = formData.fname; // <--- The Translation
            dataToSend.user_lname = formData.lname;

        }

        try {
            const response = await fetch('http://localhost:8082/MappingServlets-1.0-SNAPSHOT/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            
            const result = await response.json();

            if (result.status === 'success') {
                alert(`Registration successful as a ${role}! Please log in.`);
                onFormSwitch('login');
            } else {
                alert("Registration failed: " + result.message);
            }


        } catch (error) {
            console.error("Signup Error:", error);
            alert("Failed to connect to server.");
        }
    };

    return (
        <div className='signup-container'>
            <h2>Create Your <span>Kulture</span> Account</h2>
            <form onSubmit={handleSignup} className='signup-form'>

                {/* let user select the role first */}
                <div className="input-wrapper" style={{border: 'none', padding: '0', marginBottom:'10px'}}>
                    <label style={{fontSize:'14px', fontWeight:'bold', color:'#4A3C34', marginLeft:'5px'}}>I am a:</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        className="input-field"
                        style={{border: '1px solid #9E5E4E', padding: '10px', borderRadius: '10px', backgroundColor:'white'}}
                    >
                        <option value="user">Customer (Buyer)</option>
                        <option value="supplier">Supplier (Artisan/Seller)</option>
                    </select>
                </div>

                {role === 'user' ? (
                    <>
                        <div className="input-wrapper">
                            <img src={user_icon} alt="First Name" className='email-icon'/> 
                            <input name="fname" type="text" placeholder="First Name" className="input-field" onChange={handleChange} required/>
                        </div>

                        <div className="input-wrapper">
                            <img src={user_icon} alt="Last Name" className='email-icon'/> 
                            <input name="lname" type="text" placeholder="Last Name" className="input-field" onChange={handleChange} required/>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="input-wrapper">
                            <img src={user_icon} alt="Company" className='email-icon'/> 
                            <input name="companyName" type="text" placeholder="Company Name (e.g. Batik House)" className="input-field" onChange={handleChange} required/>
                        </div>
                    </>
                )}

                <div className="input-wrapper">
                    <img src={user_icon} alt="User" className='email-icon'/> 
                    <input name="username" type="text" placeholder={role === 'supplier' ? "Supplier Name (Display Name)" : "Username"} className="input-field" onChange={handleChange} required/>
                </div>

                <div className="input-wrapper">
                    <img src={email_icon} alt="Email" className='email-icon'/>
                    <input name="email" type="email" placeholder="Email Address" className="input-field" onChange={handleChange} required/>
                </div>

                <div className="input-wrapper"> 
                    <img src={padlock_icon} alt="Password" className='padlock-icon'/>
                    <input name="password" type={showPassword ? "text" : "password"} placeholder="Create Password" className="input-field" onChange={handleChange} required/>
                    <img src={showPassword ? eye_opened_icon : eye_closed_icon} alt="Toggle" className='password-toggle-icon' onClick={togglePasswordVisibility}/>
                </div>

                <div className="agreement-wrapper">
                    <input type="checkbox" id="terms-agree" checked={agreedToTerms} onChange={() => setAgreedToTerms(!agreedToTerms)} required/>
                    <label htmlFor="terms-agree">I agree to Kulture's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</label>
                </div>

                <button className="signup-button" disabled={!agreedToTerms}>Sign Up</button>
            </form>

            <p className="login-text">Already have an account? <a href="/login" onClick={handleLoginClick}>Log In here</a></p>
        </div>
    )
}

export default Signup;