import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Shield, Truck, RefreshCw, Star, TrendingUp, Flame } from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useOrder } from '../../context/OrderContext';
import { heroSlides } from '../../data/products';
import './Home.css';

const CATEGORIES = [
    { name: 'Running', icon: '🏃', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', count: '120+' },
    { name: 'Lifestyle', icon: '✨', image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&q=80', count: '85+' },
    { name: 'Skateboarding', icon: '🛹', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80', count: '60+' },
    { name: 'Training', icon: '💪', image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=400&q=80', count: '75+' },
];

const FEATURES = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100', color: 'var(--accent)' },
    { icon: RefreshCw, title: 'Free Returns', desc: '30-day hassle-free returns', color: 'var(--success)' },
    { icon: Shield, title: 'Authentic Only', desc: '100% genuine products', color: 'var(--warning)' },
    { icon: Zap, title: 'Fast Delivery', desc: '2-3 business days', color: 'var(--accent-2)' },
];

export default function Home() {
    const [heroIndex, setHeroIndex] = useState(0);
    const [heroAnimating, setHeroAnimating] = useState(false);
    const { adminProducts } = useOrder();
    const navigate = useNavigate();
    const intervalRef = useRef(null);

    const featuredProducts = adminProducts.filter(p => p.tags.includes('bestseller')).slice(0, 4);
    const newArrivals = adminProducts.filter(p => p.tags.includes('new')).slice(0, 4);
    const saleProducts = adminProducts.filter(p => p.discount > 0).slice(0, 4);

    const gotoSlide = (idx) => {
        if (heroAnimating) return;
        setHeroAnimating(true);
        setTimeout(() => {
            setHeroIndex(idx);
            setHeroAnimating(false);
        }, 300);
    };

    const nextSlide = () => gotoSlide((heroIndex + 1) % heroSlides.length);
    const prevSlide = () => gotoSlide((heroIndex - 1 + heroSlides.length) % heroSlides.length);

    useEffect(() => {
        intervalRef.current = setInterval(nextSlide, 5000);
        return () => clearInterval(intervalRef.current);
    }, [heroIndex]);

    const slide = heroSlides[heroIndex];

    return (
        <div className="home page-enter">
            {/* ── Hero ── */}
            <section className="hero">
                <div className={`hero-content ${heroAnimating ? 'hero-exit' : 'hero-enter'}`}>
                    <div className="container hero-grid">
                        <div className="hero-text">
                            <span className="hero-badge animate-pulse">
                                🔥 {slide.badge}
                            </span>
                            <h1 className="hero-title heading-display">
                                {slide.title}
                            </h1>
                            <p className="hero-subtitle">{slide.subtitle}</p>
                            <p className="hero-desc">{slide.description}</p>
                            <div className="hero-cta">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => navigate('/shop')}
                                    id="hero-cta-btn"
                                >
                                    {slide.cta} <ArrowRight size={18} />
                                </button>
                                <button
                                    className="btn btn-secondary btn-lg"
                                    onClick={() => navigate('/shop')}
                                    id="hero-browse-btn"
                                >
                                    Browse All
                                </button>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <span className="stat-number">50K+</span>
                                    <span className="stat-label">Happy Customers</span>
                                </div>
                                <div className="stat-divider" />
                                <div className="stat-item">
                                    <span className="stat-number">500+</span>
                                    <span className="stat-label">Products</span>
                                </div>
                                <div className="stat-divider" />
                                <div className="stat-item">
                                    <span className="stat-number">30+</span>
                                    <span className="stat-label">Top Brands</span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-image-wrap">
                            <div className="hero-image-glow" style={{ '--glow-color': slide.color }} />
                            <img
                                src={slide.image}
                                alt={slide.subtitle}
                                className="hero-image animate-float"
                            />
                            <div className="hero-floating-card card-1">
                                <Star size={14} fill="currentColor" style={{ color: '#ffc107' }} />
                                <span>{adminProducts[0]?.rating}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Rated</span>
                            </div>
                            <div className="hero-floating-card card-2">
                                <TrendingUp size={14} style={{ color: 'var(--success)' }} />
                                <span>Best Seller</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slide Controls */}
                <div className="hero-controls">
                    <button className="hero-ctrl-btn" onClick={prevSlide} id="hero-prev-btn">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="hero-dots">
                        {heroSlides.map((_, i) => (
                            <button
                                key={i}
                                className={`hero-dot ${i === heroIndex ? 'active' : ''}`}
                                onClick={() => gotoSlide(i)}
                                id={`hero-dot-${i}`}
                            />
                        ))}
                    </div>
                    <button className="hero-ctrl-btn" onClick={nextSlide} id="hero-next-btn">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="features-strip">
                <div className="container">
                    <div className="features-grid">
                        {FEATURES.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="feature-item">
                                <div className="feature-icon" style={{ color }}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h4 className="feature-title">{title}</h4>
                                    <p className="feature-desc">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Categories ── */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <p className="section-tag">Explore</p>
                            <h2 className="section-title">Shop by Category</h2>
                        </div>
                        <Link to="/shop" className="btn btn-secondary btn-sm">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="categories-grid">
                        {CATEGORIES.map(cat => (
                            <Link
                                key={cat.name}
                                to={`/shop?category=${cat.name}`}
                                className="category-card"
                                id={`category-${cat.name.toLowerCase()}`}
                            >
                                <div className="category-img-wrap">
                                    <img src={cat.image} alt={cat.name} className="category-img" />
                                    <div className="category-overlay" />
                                </div>
                                <div className="category-info">
                                    <span className="category-icon">{cat.icon}</span>
                                    <h3 className="category-name">{cat.name}</h3>
                                    <p className="category-count">{cat.count} Styles</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Best Sellers ── */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <p className="section-tag">
                                <Flame size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                Trending
                            </p>
                            <h2 className="section-title">Best Sellers</h2>
                            <p className="section-subtitle">Our most-loved shoes, handpicked for you</p>
                        </div>
                        <Link to="/shop" className="btn btn-secondary btn-sm">
                            See All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid-4">
                        {featuredProducts.map((product, i) => (
                            <div key={product.id} style={{ animationDelay: `${i * 0.1}s` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Promo Banner ── */}
            <section className="promo-banner">
                <div className="container">
                    <div className="promo-inner">
                        <div className="promo-text">
                            <span className="promo-tag">Limited Time</span>
                            <h2 className="promo-title heading-display">Up to 30% Off<br />Sale Collection</h2>
                            <p className="promo-desc">Don't miss out on massive discounts across premium brands</p>
                            <Link to="/shop?sale=true" className="btn btn-primary btn-lg" id="promo-cta">
                                Shop Sale <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="promo-image-grid">
                            {saleProducts.slice(0, 2).map(p => (
                                <div key={p.id} className="promo-img-card">
                                    <img src={p.image} alt={p.name} />
                                    <div className="promo-img-label">
                                        <span>{p.name}</span>
                                        <strong>${p.price}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── New Arrivals ── */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <p className="section-tag">Just Dropped</p>
                            <h2 className="section-title">New Arrivals</h2>
                            <p className="section-subtitle">Fresh kicks just added to the collection</p>
                        </div>
                        <Link to="/shop?tag=new" className="btn btn-secondary btn-sm">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid-4">
                        {newArrivals.map((product, i) => (
                            <div key={product.id} style={{ animationDelay: `${i * 0.1}s` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Brands ── */}
            <section className="section brands-section">
                <div className="container">
                    <p className="section-tag text-center" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        Trusted Partners
                    </p>
                    <div className="brands-marquee-wrapper">
                        <div className="brands-marquee">
                            {['Nike', 'Adidas', 'Jordan', 'Converse', 'Vans', 'ASICS', 'PUMA', 'HOKA', 'New Balance', 'Reebok',
                                'Nike', 'Adidas', 'Jordan', 'Converse', 'Vans', 'ASICS', 'PUMA', 'HOKA', 'New Balance', 'Reebok'].map((brand, i) => (
                                    <span key={i} className="brand-chip">{brand}</span>
                                ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
