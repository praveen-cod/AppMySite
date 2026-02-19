import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, ArrowLeft, Truck, Shield, RefreshCw, Share2, Minus, Plus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, toggleWishlist, wishlist } = useCart();
    const { adminProducts } = useOrder();

    const product = adminProducts.find(p => p.id === parseInt(id));

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
    const [quantity, setQuantity] = useState(1);
    const [activeImg, setActiveImg] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);

    if (!product) {
        return (
            <div className="not-found-page">
                <h2>Product not found</h2>
                <button className="btn btn-primary" onClick={() => navigate('/shop')}>
                    Back to Shop
                </button>
            </div>
        );
    }

    const isWishlisted = wishlist.includes(product.id);
    const related = adminProducts.filter(p => p.id !== product.id && (p.brand === product.brand || p.category === product.category)).slice(0, 4);

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Please select a size!');
            return;
        }
        addToCart(product, selectedSize, selectedColor, quantity);
        setAddedToCart(true);
        toast.success(`${product.name} (Size ${selectedSize}) added to cart!`);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => {
            const filled = i < Math.floor(rating);
            const half = !filled && i < rating;
            return (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#ffc107' : half ? 'url(#half)' : 'none'} stroke="#ffc107" strokeWidth="1.5">
                    <defs>
                        <linearGradient id="half"><stop offset="50%" stopColor="#ffc107" /><stop offset="50%" stopColor="none" /></linearGradient>
                    </defs>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        });
    };

    return (
        <div className="product-detail page-enter">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <span className="breadcrumb-sep">/</span>
                    <button onClick={() => navigate('/shop')} className="breadcrumb-link">Shop</button>
                    <span className="breadcrumb-sep">/</span>
                    <span className="breadcrumb-current">{product.name}</span>
                </div>

                <div className="detail-grid">
                    {/* Images */}
                    <div className="detail-images">
                        <div className="main-image-wrap">
                            <img
                                src={product.images[activeImg]}
                                alt={product.name}
                                className="main-image"
                            />
                            {product.discount > 0 && (
                                <div className="detail-discount-badge">-{product.discount}%</div>
                            )}
                            <button
                                className={`detail-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                                onClick={() => { toggleWishlist(product.id); toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!'); }}
                                id="detail-wishlist-btn"
                            >
                                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                        <div className="thumb-gallery">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    className={`thumb ${i === activeImg ? 'active' : ''}`}
                                    onClick={() => setActiveImg(i)}
                                    id={`thumb-${i}`}
                                >
                                    <img src={img} alt={`${product.name} view ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="detail-info">
                        <div className="detail-brand">{product.brand}</div>
                        <h1 className="detail-name">{product.name}</h1>

                        <div className="detail-rating-row">
                            <div className="stars">{renderStars(product.rating)}</div>
                            <span className="rating-num">{product.rating}</span>
                            <span className="review-num">({product.reviews.toLocaleString()} reviews)</span>
                            <span className="detail-sep">·</span>
                            {product.stock < 20 ? (
                                <span className="low-stock-tag">Only {product.stock} left!</span>
                            ) : (
                                <span className="in-stock-tag">In Stock</span>
                            )}
                        </div>

                        <div className="detail-price-row">
                            <span className="detail-price">${product.price.toFixed(2)}</span>
                            {product.originalPrice > product.price && (
                                <>
                                    <span className="detail-original">${product.originalPrice.toFixed(2)}</span>
                                    <span className="detail-save">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                                </>
                            )}
                        </div>

                        <div className="detail-divider" />

                        {/* Colors */}
                        <div className="detail-option-group">
                            <div className="option-label">
                                <span>Color</span>
                                <span className="option-value">Selected</span>
                            </div>
                            <div className="color-options">
                                {product.colors.map((color, i) => (
                                    <button
                                        key={i}
                                        className={`color-option ${selectedColor === color ? 'active' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                        id={`color-option-${i}`}
                                    >
                                        {selectedColor === color && <Check size={14} color={color === '#f5f5f5' || color === '#ffffff' ? '#333' : 'white'} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="detail-option-group">
                            <div className="option-label">
                                <span>Size</span>
                                {selectedSize && <span className="option-value">US {selectedSize}</span>}
                            </div>
                            <div className="size-options">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`size-option ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                        id={`size-${size}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {!selectedSize && (
                                <p className="size-hint">⬆ Please select a size to continue</p>
                            )}
                        </div>

                        {/* Quantity & Cart */}
                        <div className="detail-actions">
                            <div className="qty-selector">
                                <button
                                    className="qty-btn-lg"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    id="qty-minus"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="qty-display">{quantity}</span>
                                <button
                                    className="qty-btn-lg"
                                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                    id="qty-plus"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <button
                                className={`btn btn-primary add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                onClick={handleAddToCart}
                                id="add-to-cart-btn"
                            >
                                {addedToCart ? (
                                    <><Check size={18} /> Added to Cart!</>
                                ) : (
                                    <><ShoppingBag size={18} /> Add to Cart</>
                                )}
                            </button>
                            <button
                                className={`btn btn-ghost btn-icon wishlist-btn-lg ${isWishlisted ? 'wishlisted' : ''}`}
                                onClick={() => { toggleWishlist(product.id); }}
                                id="wishlist-icon-btn"
                            >
                                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Guarantees */}
                        <div className="detail-guarantees">
                            {[
                                { icon: Truck, text: 'Free shipping on orders over $100' },
                                { icon: RefreshCw, text: 'Free 30-day returns' },
                                { icon: Shield, text: '100% authentic guaranteed' },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="guarantee-item">
                                    <Icon size={15} />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="detail-description">
                            <h3 className="desc-title">About this shoe</h3>
                            <p className="desc-text">{product.description}</p>
                        </div>

                        {/* Tags */}
                        <div className="detail-tags">
                            <span className="detail-category">Category: <strong>{product.category}</strong></span>
                            {product.tags.map(tag => (
                                <span key={tag} className="badge badge-accent">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section className="related-section">
                        <div className="section-header">
                            <div>
                                <p className="section-tag">You Might Like</p>
                                <h2 className="section-title">Related Products</h2>
                            </div>
                        </div>
                        <div className="grid-4">
                            {related.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
