import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const { addToCart, toggleWishlist, wishlist } = useCart();
    const navigate = useNavigate();
    const isWishlisted = wishlist.includes(product.id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)];
        const defaultColor = product.colors[0];
        addToCart(product, defaultSize, defaultColor);
        toast.success(`${product.name} added to cart!`);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
    };

    const tagColors = {
        bestseller: 'badge-accent',
        new: 'badge-success',
        limited: 'badge-error',
        sale: 'badge-warning',
        premium: 'badge-info',
        classic: 'badge-info',
    };

    return (
        <div className="product-card" id={`product-card-${product.id}`}>
            <Link to={`/product/${product.id}`} className="product-card-link">
                <div className="product-image-wrapper">
                    <img src={product.image} alt={product.name} className="product-image" loading="lazy" />

                    {/* Tags */}
                    <div className="product-tags">
                        {product.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={`badge ${tagColors[tag] || 'badge-accent'}`}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Discount Badge */}
                    {product.discount > 0 && (
                        <div className="discount-badge">-{product.discount}%</div>
                    )}

                    {/* Hover Actions */}
                    <div className="product-actions">
                        <button
                            className={`action-btn wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                            onClick={handleWishlist}
                            aria-label="Toggle wishlist"
                            id={`wishlist-btn-${product.id}`}
                        >
                            <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            className="action-btn cart-btn-card"
                            onClick={handleAddToCart}
                            aria-label="Add to cart"
                            id={`cart-btn-${product.id}`}
                        >
                            <ShoppingBag size={17} />
                        </button>
                        <button
                            className="action-btn view-btn"
                            onClick={(e) => { e.preventDefault(); navigate(`/product/${product.id}`); }}
                            aria-label="Quick view"
                            id={`view-btn-${product.id}`}
                        >
                            <Eye size={17} />
                        </button>
                    </div>

                    {/* Color Swatches */}
                    <div className="color-swatches">
                        {product.colors.slice(0, 4).map((color, i) => (
                            <span
                                key={i}
                                className="color-swatch"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-meta">
                        <div className="product-rating">
                            <Star size={12} fill="currentColor" className="star-icon" />
                            <span className="rating-value">{product.rating}</span>
                            <span className="review-count">({product.reviews.toLocaleString()})</span>
                        </div>
                        <div className="product-stock">
                            {product.stock < 20 ? (
                                <span className="low-stock">Only {product.stock} left</span>
                            ) : (
                                <span className="in-stock">In Stock</span>
                            )}
                        </div>
                    </div>
                    <div className="product-pricing">
                        <span className="product-price">${product.price.toFixed(2)}</span>
                        {product.originalPrice > product.price && (
                            <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
