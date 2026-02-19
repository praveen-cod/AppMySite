import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            toast.success(`Welcome back, ${result.user.name}! 👋`);
            navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
        } else {
            toast.error(result.error);
        }
    };

    const fillDemo = (role) => {
        if (role === 'user') { setEmail('alex@example.com'); setPassword('password123'); }
        else { setEmail('admin@stepkick.com'); setPassword('admin123'); }
    };

    return (
        <div className="auth-page page-enter">
            <div className="auth-bg">
                <div className="auth-bg-shape shape-1" />
                <div className="auth-bg-shape shape-2" />
            </div>
            <div className="auth-card animate-scaleIn">
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <svg viewBox="0 0 28 28" fill="none" width="22" height="22">
                            <path d="M2 20L12 8L18 14L22 10L26 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="14" cy="22" r="3" fill="currentColor" />
                        </svg>
                    </div>
                    <span>StepKick</span>
                </div>

                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to your StepKick account</p>

                {/* Demo Accounts */}
                <div className="demo-accounts">
                    <p className="demo-label">Quick Demo Login:</p>
                    <div className="demo-btns">
                        <button className="demo-btn" onClick={() => fillDemo('user')} id="demo-user-btn">
                            👤 User Account
                        </button>
                        <button className="demo-btn admin-demo" onClick={() => fillDemo('admin')} id="demo-admin-btn">
                            🛡️ Admin Account
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={16} className="input-icon" />
                            <input
                                type="email"
                                className="input input-with-icon"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                id="login-email"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label className="input-label">Password</label>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>
                        <div className="input-wrapper">
                            <Lock size={16} className="input-icon" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                className="input input-with-icon input-with-action"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                id="login-password"
                            />
                            <button type="button" className="input-action" onClick={() => setShowPass(p => !p)} id="toggle-password">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full btn-lg"
                        disabled={loading}
                        id="login-submit-btn"
                    >
                        {loading ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Signing In...</> : 'Sign In'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/register" className="auth-link">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
