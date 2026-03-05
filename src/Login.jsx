import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import './Login.css';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [particles, setParticles] = useState([]);
    const navigate = useNavigate();

    // Generate floating particles
    useEffect(() => {
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (password === 'karonahean123@HEAN') {
            localStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Invalid password. Please try again.');
            setIsLoading(false);
        }
    };

    const handleProviderLogin = async (providerName) => {
        setError('');
        setIsLoading(true);
        try {
            let provider;
            if (providerName === 'google') {
                provider = new GoogleAuthProvider();
            } else if (providerName === 'apple') {
                provider = new OAuthProvider('apple.com');
            }

            const result = await signInWithPopup(auth, provider);
            // Assuming successful auth means they should be let in
            if (result.user) {
                if (providerName === 'google' && result.user.email !== 'dumprage@gmail.com') {
                    auth.signOut();
                    throw new Error("This email is not authorized to access the dashboard.");
                }
                localStorage.setItem('isAdminAuthenticated', 'true');
                navigate('/admin');
            }
        } catch (error) {
            console.error("Provider login error:", error);
            setError(error.message || `Failed to sign in with ${providerName}`);
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Back to Portfolio Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => navigate('/')}
                style={{
                    position: 'absolute',
                    top: '40px',
                    left: '40px',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '100px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)'
                }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
            >
                <ArrowLeft size={16} />
                Back to Portfolio
            </motion.button>

            {/* Animated Background */}
            <div className="login-bg-gradient"></div>
            <div className="login-bg-grid"></div>

            {/* Floating Particles */}
            <div className="particles-container">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="particle"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: particle.size,
                            height: particle.size,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: particle.duration,
                            repeat: Infinity,
                            delay: particle.delay,
                        }}
                    />
                ))}
            </div>

            {/* Main Login Card */}
            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Glow Effect */}
                <div className="card-glow"></div>

                {/* Header */}
                <motion.div
                    className="login-header"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="icon-wrapper">
                        <Lock size={32} strokeWidth={1.5} />
                        <motion.div
                            className="icon-sparkle"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles size={16} />
                        </motion.div>
                    </div>
                    <h1 className="login-title">Admin Access</h1>
                    <p className="login-subtitle">Enter your credentials to access the dashboard</p>
                </motion.div>

                {/* Form */}
                <motion.form
                    onSubmit={handleLogin}
                    className="login-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="form-group">
                        <label className="login-label">
                            <Lock size={14} />
                            <span>Password</span>
                        </label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="login-input"
                                placeholder="Enter your password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                className="error-message"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="error-icon">⚠</div>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        className={`btn-login ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || !password}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            <>
                                <motion.div
                                    className="spinner"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <span>Enter Dashboard</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </motion.form>

                {/* Social Login Providers */}
                <motion.div
                    className="provider-login-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                        <span style={{ margin: '0 10px', fontSize: '12px', color: 'var(--zinc-500)', textTransform: 'uppercase', letterSpacing: '2px' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                    </div>

                    <motion.button
                        type="button"
                        className="btn-login provider-btn"
                        onClick={() => handleProviderLogin('google')}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ backgroundColor: 'white', color: 'black', border: 'none' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Sign in with Google</span>
                    </motion.button>

                    <motion.button
                        type="button"
                        className="btn-login provider-btn"
                        onClick={() => handleProviderLogin('apple')}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ backgroundColor: 'white', color: 'black', border: 'none' }}
                    >
                        <span>Sign in with Apple</span>
                    </motion.button>
                </motion.div>

                {/* Footer */}
                <motion.div
                    className="login-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="security-badge">
                        <div className="badge-dot"></div>
                        <span>Secured Connection</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom Branding */}
            <motion.div
                className="login-branding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <span className="brand-text">KAKKHEAN</span>
                <span className="brand-divider">•</span>
                <span className="brand-label">Portfolio Dashboard</span>
            </motion.div>
        </div>
    );
};

export default Login;
