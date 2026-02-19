import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './CartSidebar.css';

export default function CartSidebar({ isOpen, onClose }) {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            toast.error('Please sign in to checkout');
            onClose();
            navigate('/login');
            return;
        }
        onClose();
        navigate('/checkout');
    };

    const shipping = cartTotal > 100 ? 0 : 9.99;
    const total = cartTotal + shipping;

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
            <div className={`sidebar cart-sidebar ${isOpen ? 'cart-sidebar-open' : ''}`}>
                {/* Header */}
                <div className="cart-header">
                    <div className="cart-title">
                        <ShoppingBag size={20} />
                        <h2>Your Cart</h2>
                        {cartItems.length > 0 && (
                            <span className="cart-count-badge">{cartItems.length}</span>
                        )}
                    </div>
                    <div className="cart-header-actions">
                        {cartItems.length > 0 && (
                            <button className="clear-cart-btn" onClick={() => { clearCart(); toast.success('Cart cleared'); }}>
                                Clear all
                            </button>
                        )}
                        <button className="btn btn-ghost btn-icon" onClick={onClose} id="close-cart-btn">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Items */}
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">
                                <ShoppingBag size={48} strokeWidth={1} />
                            </div>
                            <h3>Your cart is empty</h3>
                            <p>Discover our amazing shoe collection</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => { navigate('/shop'); onClose(); }}
                            >
                                Shop Now <ArrowRight size={16} />
                            </button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.cartId} className="cart-item">
                                <div className="cart-item-img-wrap">
                                    <img src={item.image} alt={item.name} className="cart-item-img" />
                                </div>
                                <div className="cart-item-details">
                                    <p className="cart-item-brand">{item.brand}</p>
                                    <h4 className="cart-item-name">{item.name}</h4>
                                    <div className="cart-item-meta">
                                        <span>Size: <strong>{item.size}</strong></span>
                                        <span
                                            className="cart-item-color"
                                            style={{ backgroundColor: item.color }}
                                        />
                                    </div>
                                    <div className="cart-item-bottom">
                                        <div className="quantity-control">
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                id={`qty-minus-${item.cartId}`}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                id={`qty-plus-${item.cartId}`}
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <div className="cart-item-price-row">
                                            <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                            <button
                                                className="remove-btn"
                                                onClick={() => { removeFromCart(item.cartId); toast.success('Item removed'); }}
                                                id={`remove-${item.cartId}`}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className={shipping === 0 ? 'free-shipping' : ''}>
                                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            {shipping > 0 && (
                                <p className="free-shipping-note">
                                    Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                                </p>
                            )}
                            <div className="summary-divider" />
                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary w-full checkout-btn"
                            onClick={handleCheckout}
                            id="checkout-btn"
                        >
                            Proceed to Checkout <ArrowRight size={16} />
                        </button>
                        <button
                            className="btn btn-secondary w-full"
                            onClick={() => { navigate('/shop'); onClose(); }}
                            style={{ marginTop: '0.5rem' }}
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
