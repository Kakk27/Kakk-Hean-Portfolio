import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded check for demonstration
        if (password === 'kakkforall') {
            localStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-bg-glow"></div>
            <div className="login-card">
                <h1 className="login-title">Admin Access</h1>
                <p className="login-subtitle">Please enter your credentials to continue</p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label className="login-label">Password</label>
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Enter password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-login">
                        Enter Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
