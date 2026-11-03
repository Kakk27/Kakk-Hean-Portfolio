import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Eye, EyeOff, Sparkles, ArrowLeft, ShieldCheck, Database } from 'lucide-react';
import { login } from './services/api';
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

        try {
            const res = await login(password);
            if (res.success) {
                localStorage.setItem('isAdminAuthenticated', 'true');
                navigate('/admin');
            } else {
                setError(res.message || 'Invalid password. Please try again.');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Authentication error. Please check your connection.');
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
                    <p className="login-subtitle">Enter your password to manage your portfolio</p>
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
                                placeholder="Enter admin password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                autoFocus
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
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

                {/* Database Security Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{
                        marginTop: '24px',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.5)'
                    }}
                >
                    <Database size={16} style={{ color: '#3b82f6', flexShrink: 0 }} />
                    <span>Protected by Local SQLite Database Engine</span>
                </motion.div>

                {/* Footer */}
                <motion.div
                    className="login-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                >
                    <div className="security-badge">
                        <div className="badge-dot"></div>
                        <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
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
