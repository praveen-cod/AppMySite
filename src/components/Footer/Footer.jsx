import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube, Facebook, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="footer-grid">
                        {/* Brand */}
                        <div className="footer-brand">
                            <Link to="/" className="footer-logo">
                                <div className="footer-logo-icon">
                                    <svg viewBox="0 0 28 28" fill="none">
                                        <path d="M2 20L12 8L18 14L22 10L26 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="14" cy="22" r="3" fill="currentColor" />
                                    </svg>
                                </div>
                                <span>Step<strong>Kick</strong></span>
                            </Link>
                            <p className="footer-tagline">
                                Premium footwear for every step of your journey. Shop the world's finest sneakers and lifestyle shoes.
                            </p>
                            <div className="footer-socials">
                                {[
                                    { Icon: Instagram, href: '#', label: 'Instagram' },
                                    { Icon: Twitter, href: '#', label: 'Twitter' },
                                    { Icon: Youtube, href: '#', label: 'YouTube' },
                                    { Icon: Facebook, href: '#', label: 'Facebook' },
                                ].map(({ Icon, href, label }) => (
                                    <a key={label} href={href} className="social-link" aria-label={label}>
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Shop */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">Shop</h4>
                            <ul className="footer-links">
                                {['New Arrivals', 'Running', 'Lifestyle', 'Skateboarding', 'Training', 'Sale'].map(item => (
                                    <li key={item}>
                                        <Link to="/shop" className="footer-link">
                                            <ChevronRight size={13} /> {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Brands */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">Brands</h4>
                            <ul className="footer-links">
                                {['Nike', 'Adidas', 'Jordan', 'Converse', 'Vans', 'HOKA'].map(brand => (
                                    <li key={brand}>
                                        <Link to={`/shop?brand=${brand}`} className="footer-link">
                                            <ChevronRight size={13} /> {brand}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">Contact Us</h4>
                            <div className="footer-contact">
                                <div className="contact-item">
                                    <Mail size={15} />
                                    <span>support@stepkick.com</span>
                                </div>
                                <div className="contact-item">
                                    <Phone size={15} />
                                    <span>+1 (800) STEP-KICK</span>
                                </div>
                                <div className="contact-item">
                                    <MapPin size={15} />
                                    <span>123 Sneaker Lane, NY 10001</span>
                                </div>
                            </div>
                            <div className="newsletter">
                                <p>Get exclusive drops & offers</p>
                                <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                                    <input type="email" placeholder="Your email" className="newsletter-input" />
                                    <button type="submit" className="newsletter-btn">→</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-inner">
                        <p>© {currentYear} StepKick. All rights reserved.</p>
                        <div className="footer-legal">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                        <div className="footer-payments">
                            {['VISA', 'MC', 'AMEX', 'PP'].map(pay => (
                                <span key={pay} className="payment-badge">{pay}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
