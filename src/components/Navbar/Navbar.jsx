import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Sun, Moon, User, LogOut, LayoutDashboard, Shield, Menu, X, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import './Navbar.css';

export default function Navbar({ onCartOpen }) {
    const { theme, toggleTheme } = useTheme();
    const { cartCount, wishlist } = useCart();
    const { user, logout } = useAuth();
    const { adminProducts } = useOrder();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);

    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setUserMenuOpen(false);
    }, [location]);

    useEffect(() => {
        if (searchQuery.trim()) {
            const results = adminProducts.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 5);
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, adminProducts]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
            setSearchQuery('');
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (product) => {
        navigate(`/product/${product.id}`);
        setSearchOpen(false);
        setSearchQuery('');
        setSuggestions([]);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setUserMenuOpen(false);
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/shop?category=Running', label: 'Running' },
        { path: '/shop?category=Lifestyle', label: 'Lifestyle' },
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
                <div className="navbar-inner">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <div className="logo-icon">
                            <svg viewBox="0 0 28 28" fill="none">
                                <path d="M2 20L12 8L18 14L22 10L26 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="14" cy="22" r="3" fill="currentColor" />
                            </svg>
                        </div>
                        <span className="logo-text">Step<span>Kick</span></span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="navbar-links">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="navbar-actions">
                        {/* Search */}
                        <button
                            className="nav-action-btn tooltip"
                            data-tooltip="Search"
                            onClick={() => setSearchOpen(true)}
                            id="nav-search-btn"
                        >
                            <Search size={19} />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            className="nav-action-btn theme-toggle tooltip"
                            data-tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            onClick={toggleTheme}
                            id="theme-toggle-btn"
                        >
                            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                        </button>

                        {/* Wishlist */}
                        {user && (
                            <button
                                className="nav-action-btn tooltip"
                                data-tooltip="Wishlist"
                                onClick={() => navigate('/dashboard?tab=wishlist')}
                                id="nav-wishlist-btn"
                            >
                                <Heart size={19} />
                                {wishlist.length > 0 && (
                                    <span className="nav-badge">{wishlist.length}</span>
                                )}
                            </button>
                        )}

                        {/* Cart */}
                        <button
                            className="nav-action-btn cart-btn tooltip"
                            data-tooltip="Cart"
                            onClick={onCartOpen}
                            id="nav-cart-btn"
                        >
                            <ShoppingBag size={19} />
                            {cartCount > 0 && (
                                <span className="nav-badge">{cartCount}</span>
                            )}
                        </button>

                        {/* User Menu */}
                        {user ? (
                            <div className="user-menu-wrapper" ref={userMenuRef}>
                                <button
                                    className="user-avatar-btn"
                                    onClick={() => setUserMenuOpen(p => !p)}
                                    id="user-menu-btn"
                                >
                                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                                    <span className="user-name-short">{user.name.split(' ')[0]}</span>
                                </button>
                                {userMenuOpen && (
                                    <div className="user-dropdown animate-slideDown">
                                        <div className="user-dropdown-header">
                                            <img src={user.avatar} alt={user.name} />
                                            <div>
                                                <p className="user-dropdown-name">{user.name}</p>
                                                <p className="user-dropdown-email">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="user-dropdown-divider" />
                                        <Link to="/dashboard" className="user-dropdown-item">
                                            <LayoutDashboard size={15} /> My Dashboard
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="user-dropdown-item admin-item">
                                                <Shield size={15} /> Admin Panel
                                            </Link>
                                        )}
                                        <div className="user-dropdown-divider" />
                                        <button onClick={handleLogout} className="user-dropdown-item logout-item">
                                            <LogOut size={15} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm" id="nav-login-btn">
                                <User size={15} /> Sign In
                            </Link>
                        )}

                        {/* Mobile Menu */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileOpen(p => !p)}
                            id="mobile-menu-btn"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="mobile-nav animate-slideDown">
                        {navLinks.map(link => (
                            <Link key={link.path} to={link.path} className="mobile-nav-link">
                                {link.label}
                            </Link>
                        ))}
                        {!user && (
                            <Link to="/login" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }}>
                                Sign In
                            </Link>
                        )}
                    </div>
                )}
            </nav>

            {/* Search Modal */}
            {searchOpen && (
                <div className="search-overlay" onClick={(e) => {
                    if (e.target === e.currentTarget) setSearchOpen(false);
                }}>
                    <div className="search-modal animate-scaleIn">
                        <form onSubmit={handleSearch} className="search-form">
                            <Search size={20} className="search-icon" />
                            <input
                                ref={searchRef}
                                autoFocus
                                type="text"
                                placeholder="Search shoes, brands, categories..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="search-input"
                                id="search-input"
                            />
                            <button type="button" onClick={() => setSearchOpen(false)} className="search-close">
                                <X size={18} />
                            </button>
                        </form>
                        {suggestions.length > 0 && (
                            <div className="search-suggestions">
                                {suggestions.map(p => (
                                    <button
                                        key={p.id}
                                        className="search-suggestion-item"
                                        onClick={() => handleSuggestionClick(p)}
                                    >
                                        <img src={p.image} alt={p.name} />
                                        <div>
                                            <p className="suggestion-name">{p.name}</p>
                                            <p className="suggestion-brand">{p.brand} · {p.category}</p>
                                        </div>
                                        <span className="suggestion-price">${p.price}</span>
                                    </button>
                                ))}
                                <button
                                    className="search-view-all"
                                    onClick={() => { navigate(`/shop?search=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); }}
                                >
                                    View all results for "{searchQuery}"
                                </button>
                            </div>
                        )}
                        {searchQuery && suggestions.length === 0 && (
                            <div className="search-empty">
                                <p>No results found for "<strong>{searchQuery}</strong>"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
