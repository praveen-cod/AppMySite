import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) { toast.error('Passwords do not match'); return; }
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        const result = await register(name, email, password);
        if (result.success) {
            toast.success(`Welcome to StepKick, ${result.user.name}! 🎉`);
            navigate('/shop');
        } else {
            toast.error(result.error);
        }
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

                <h1 className="auth-title">Create account</h1>
                <p className="auth-subtitle">Join thousands of shoe enthusiasts</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <div className="input-wrapper">
                            <User size={16} className="input-icon" />
                            <input
                                className="input input-with-icon"
                                placeholder="John Doe"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                id="register-name"
                            />
                        </div>
                    </div>

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
                                id="register-email"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            <Lock size={16} className="input-icon" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                className="input input-with-icon input-with-action"
                                placeholder="Min 6 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                id="register-password"
                            />
                            <button type="button" className="input-action" onClick={() => setShowPass(p => !p)}>
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock size={16} className="input-icon" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                className="input input-with-icon"
                                placeholder="Repeat password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                required
                                id="register-confirm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full btn-lg"
                        disabled={loading}
                        id="register-submit-btn"
                    >
                        {loading ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Creating Account...</> : 'Create Account 🎉'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
