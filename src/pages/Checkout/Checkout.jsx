import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { Check, CreditCard, MapPin, Package, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Review', 'Confirm'];

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { placeOrder } = useOrder();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);

    const [shipping, setShipping] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
    });

    const [payment, setPayment] = useState({
        cardNumber: '4242 4242 4242 4242',
        cardName: user?.name || '',
        expiry: '12/26',
        cvv: '***',
        saveCard: false,
    });

    const shippingFee = cartTotal > 100 ? 0 : 9.99;
    const total = cartTotal + shippingFee;

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        if (!shipping.name || !shipping.address || !shipping.city || !shipping.zip) {
            toast.error('Please fill in all required fields');
            return;
        }
        setStep(1);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 2000));
        const newOrder = placeOrder(cartItems, cartTotal, shipping);
        clearCart();
        setOrder(newOrder);
        setStep(3);
        setLoading(false);
    };

    const updateShipping = (field, value) => setShipping(prev => ({ ...prev, [field]: value }));
    const updatePayment = (field, value) => setPayment(prev => ({ ...prev, [field]: value }));

    if (cartItems.length === 0 && step !== 3) {
        return (
            <div className="checkout-empty">
                <Package size={48} strokeWidth={1} />
                <h2>Your cart is empty</h2>
                <button className="btn btn-primary" onClick={() => navigate('/shop')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="checkout-page page-enter">
            <div className="container">
                <h1 className="checkout-title heading-display">Checkout</h1>

                {/* Steps */}
                <div className="steps-bar">
                    {STEPS.map((s, i) => (
                        <div key={s} className={`step-item ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                            <div className="step-circle">
                                {i < step ? <Check size={14} /> : <span>{i + 1}</span>}
                            </div>
                            <span className="step-label">{s}</span>
                            {i < STEPS.length - 1 && <div className="step-line" />}
                        </div>
                    ))}
                </div>

                <div className="checkout-layout">
                    <div className="checkout-main">
                        {/* Step 0: Shipping */}
                        {step === 0 && (
                            <div className="checkout-card animate-fadeIn">
                                <div className="checkout-card-header">
                                    <MapPin size={20} style={{ color: 'var(--accent)' }} />
                                    <h2>Shipping Address</h2>
                                </div>
                                <form onSubmit={handleShippingSubmit} className="checkout-form">
                                    <div className="form-row">
                                        <div className="input-group">
                                            <label className="input-label">Full Name *</label>
                                            <input className="input" value={shipping.name} onChange={e => updateShipping('name', e.target.value)} required id="shipping-name" />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Email *</label>
                                            <input className="input" type="email" value={shipping.email} onChange={e => updateShipping('email', e.target.value)} required id="shipping-email" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="input-group">
                                            <label className="input-label">Phone</label>
                                            <input className="input" value={shipping.phone} onChange={e => updateShipping('phone', e.target.value)} id="shipping-phone" />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Country</label>
                                            <select className="select" value={shipping.country} onChange={e => updateShipping('country', e.target.value)} id="shipping-country">
                                                <option value="US">United States</option>
                                                <option value="CA">Canada</option>
                                                <option value="GB">United Kingdom</option>
                                                <option value="IN">India</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Street Address *</label>
                                        <input className="input" placeholder="123 Main St, Apt 4" value={shipping.address} onChange={e => updateShipping('address', e.target.value)} required id="shipping-address" />
                                    </div>
                                    <div className="form-row form-row-3">
                                        <div className="input-group">
                                            <label className="input-label">City *</label>
                                            <input className="input" value={shipping.city} onChange={e => updateShipping('city', e.target.value)} required id="shipping-city" />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">State</label>
                                            <input className="input" value={shipping.state} onChange={e => updateShipping('state', e.target.value)} id="shipping-state" />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">ZIP Code *</label>
                                            <input className="input" value={shipping.zip} onChange={e => updateShipping('zip', e.target.value)} required id="shipping-zip" />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-full btn-lg" id="shipping-next-btn">
                                        Continue to Payment <ChevronRight size={16} />
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Step 1: Payment */}
                        {step === 1 && (
                            <div className="checkout-card animate-fadeIn">
                                <div className="checkout-card-header">
                                    <CreditCard size={20} style={{ color: 'var(--accent)' }} />
                                    <h2>Payment Details</h2>
                                </div>
                                <form onSubmit={handlePaymentSubmit} className="checkout-form">
                                    <div className="input-group">
                                        <label className="input-label">Card Number</label>
                                        <input className="input" value={payment.cardNumber} onChange={e => updatePayment('cardNumber', e.target.value)} placeholder="1234 5678 9012 3456" id="card-number" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Cardholder Name</label>
                                        <input className="input" value={payment.cardName} onChange={e => updatePayment('cardName', e.target.value)} id="card-name" />
                                    </div>
                                    <div className="form-row">
                                        <div className="input-group">
                                            <label className="input-label">Expiry Date</label>
                                            <input className="input" placeholder="MM/YY" value={payment.expiry} onChange={e => updatePayment('expiry', e.target.value)} id="card-expiry" />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">CVV</label>
                                            <input className="input" type="password" placeholder="***" value={payment.cvv} onChange={e => updatePayment('cvv', e.target.value)} id="card-cvv" maxLength={4} />
                                        </div>
                                    </div>
                                    <div className="payment-secure-notice">
                                        🔒 Your payment details are encrypted and secure
                                    </div>
                                    <div className="form-row">
                                        <button type="button" className="btn btn-secondary" onClick={() => setStep(0)} id="payment-back-btn">
                                            Back
                                        </button>
                                        <button type="submit" className="btn btn-primary flex-1 btn-lg" id="payment-next-btn">
                                            Review Order <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Step 2: Review */}
                        {step === 2 && (
                            <div className="checkout-card animate-fadeIn">
                                <h2 className="review-title">Review Your Order</h2>
                                <div className="review-items">
                                    {cartItems.map(item => (
                                        <div key={item.cartId} className="review-item">
                                            <img src={item.image} alt={item.name} />
                                            <div className="review-item-info">
                                                <p className="review-item-brand">{item.brand}</p>
                                                <p className="review-item-name">{item.name}</p>
                                                <p className="review-item-meta">Size {item.size} · Qty {item.quantity}</p>
                                            </div>
                                            <span className="review-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="review-shipping-info">
                                    <h4>Ships to:</h4>
                                    <p>{shipping.name} · {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                                </div>
                                <div className="form-row" style={{ marginTop: '1.5rem' }}>
                                    <button className="btn btn-secondary" onClick={() => setStep(1)} id="review-back-btn">Back</button>
                                    <button
                                        className="btn btn-primary flex-1 btn-lg"
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        id="place-order-btn"
                                    >
                                        {loading ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Processing...</> : 'Place Order 🎉'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirm */}
                        {step === 3 && order && (
                            <div className="checkout-card confirm-card animate-scaleIn">
                                <div className="confirm-icon">
                                    <Check size={40} />
                                </div>
                                <h2>Order Confirmed!</h2>
                                <p className="confirm-desc">
                                    Thank you for your purchase! Your order <strong>{order.id}</strong> has been placed successfully.
                                </p>
                                <div className="confirm-details">
                                    <div className="confirm-detail-row">
                                        <span>Order ID</span>
                                        <strong>{order.id}</strong>
                                    </div>
                                    <div className="confirm-detail-row">
                                        <span>Total</span>
                                        <strong>${order.total.toFixed(2)}</strong>
                                    </div>
                                    <div className="confirm-detail-row">
                                        <span>Estimated Delivery</span>
                                        <strong>2-3 Business Days</strong>
                                    </div>
                                </div>
                                <div className="confirm-actions">
                                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')} id="view-orders-btn">
                                        Track Order
                                    </button>
                                    <button className="btn btn-secondary btn-lg" onClick={() => navigate('/shop')} id="continue-shopping-btn">
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    {step < 3 && (
                        <div className="order-summary">
                            <div className="summary-card">
                                <h3 className="summary-title">Order Summary</h3>
                                <div className="summary-items">
                                    {cartItems.map(item => (
                                        <div key={item.cartId} className="summary-item">
                                            <div className="summary-item-img">
                                                <img src={item.image} alt={item.name} />
                                                <span className="summary-item-qty">{item.quantity}</span>
                                            </div>
                                            <div className="summary-item-info">
                                                <p>{item.name}</p>
                                                <p className="summary-item-meta">Size {item.size}</p>
                                            </div>
                                            <span className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="summary-totals">
                                    <div className="summary-row-sm">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row-sm">
                                        <span>Shipping</span>
                                        <span className={shippingFee === 0 ? 'free-text' : ''}>
                                            {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="summary-divider-sm" />
                                    <div className="summary-row-sm summary-total">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
