import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import {
    Package, Heart, User, Settings, Bell, ChevronRight,
    ShoppingBag, MapPin, Star, Clock, Check, Truck, RefreshCw
} from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import toast from 'react-hot-toast';
import './UserDashboard.css';

const STATUS_ICONS = {
    Delivered: Check,
    Shipped: Truck,
    Processing: RefreshCw,
    Pending: Clock,
    Cancelled: Clock,
};

export default function UserDashboard() {
    const { user, updateProfile } = useAuth();
    const { wishlist, toggleWishlist } = useCart();
    const { getUserOrders, adminProducts } = useOrder();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');
    const [editMode, setEditMode] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    const orders = getUserOrders('usr-001');
    const wishlistProducts = adminProducts.filter(p => wishlist.includes(p.id));

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const handleProfileSave = () => {
        updateProfile(profileForm);
        toast.success('Profile updated!');
        setEditMode(false);
    };

    const orderStats = {
        total: orders.length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        active: orders.filter(o => ['Pending', 'Processing', 'Shipped'].includes(o.status)).length,
    };

    const statusClass = (status) => ({
        Delivered: 'success',
        Shipped: 'info',
        Processing: 'warning',
        Pending: 'info',
        Cancelled: 'error',
    }[status] || 'info');

    return (
        <div className="dashboard-page page-enter">
            <div className="container">
                {/* Header */}
                <div className="dashboard-header">
                    <div className="dashboard-user-info">
                        <img src={user?.avatar} alt={user?.name} className="dashboard-avatar" />
                        <div>
                            <h1 className="dashboard-greeting">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
                            <p className="dashboard-email">{user?.email}</p>
                            <span className="dashboard-joined">Member since {user?.joinDate}</span>
                        </div>
                    </div>
                    <div className="dashboard-stats">
                        <div className="dash-stat">
                            <span className="dash-stat-num">{orderStats.total}</span>
                            <span className="dash-stat-label">Total Orders</span>
                        </div>
                        <div className="dash-stat">
                            <span className="dash-stat-num">{orderStats.delivered}</span>
                            <span className="dash-stat-label">Delivered</span>
                        </div>
                        <div className="dash-stat">
                            <span className="dash-stat-num">{orderStats.active}</span>
                            <span className="dash-stat-label">Active</span>
                        </div>
                        <div className="dash-stat">
                            <span className="dash-stat-num">{wishlist.length}</span>
                            <span className="dash-stat-label">Wishlist</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-layout">
                    {/* Sidebar Tabs */}
                    <aside className="dashboard-sidebar">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                className={`dash-tab ${activeTab === id ? 'active' : ''}`}
                                onClick={() => setActiveTab(id)}
                                id={`dash-tab-${id}`}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                                <ChevronRight size={15} className="tab-arrow" />
                            </button>
                        ))}
                    </aside>

                    {/* Content */}
                    <div className="dashboard-content animate-fadeIn" key={activeTab}>
                        {/* ---- Orders ---- */}
                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="content-title">My Orders</h2>
                                {orders.length === 0 ? (
                                    <div className="empty-state">
                                        <ShoppingBag size={40} strokeWidth={1} />
                                        <h3>No orders yet</h3>
                                        <p>Start shopping to see your orders here</p>
                                        <Link to="/shop" className="btn btn-primary">Shop Now</Link>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {orders.map(order => {
                                            const StatusIcon = STATUS_ICONS[order.status] || Clock;
                                            return (
                                                <div key={order.id} className="order-card">
                                                    <div className="order-card-header">
                                                        <div>
                                                            <p className="order-id-label">Order</p>
                                                            <p className="order-id">{order.id}</p>
                                                        </div>
                                                        <div className={`order-status status-${statusClass(order.status)}`}>
                                                            <StatusIcon size={13} />
                                                            {order.status}
                                                        </div>
                                                    </div>
                                                    <div className="order-items-preview">
                                                        {order.items.map(item => (
                                                            <img key={item.id} src={item.image} alt={item.name} className="order-item-thumb" />
                                                        ))}
                                                        <div className="order-items-info">
                                                            <p className="order-items-names">
                                                                {order.items.map(i => i.name).join(', ')}
                                                            </p>
                                                            <p className="order-date">{order.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="order-card-footer">
                                                        <div>
                                                            <p className="order-total-label">Total</p>
                                                            <p className="order-total">${order.total.toFixed(2)}</p>
                                                        </div>
                                                        {order.tracking && (
                                                            <div>
                                                                <p className="order-tracking-label">Tracking</p>
                                                                <p className="order-tracking">{order.tracking}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ---- Wishlist ---- */}
                        {activeTab === 'wishlist' && (
                            <div>
                                <h2 className="content-title">My Wishlist ({wishlistProducts.length})</h2>
                                {wishlistProducts.length === 0 ? (
                                    <div className="empty-state">
                                        <Heart size={40} strokeWidth={1} />
                                        <h3>Your wishlist is empty</h3>
                                        <p>Save items you love for later</p>
                                        <Link to="/shop" className="btn btn-primary">Discover Shoes</Link>
                                    </div>
                                ) : (
                                    <div className="grid-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                        {wishlistProducts.map(p => <ProductCard key={p.id} product={p} />)}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ---- Profile ---- */}
                        {activeTab === 'profile' && (
                            <div>
                                <div className="content-header-row">
                                    <h2 className="content-title">My Profile</h2>
                                    <button
                                        className={`btn ${editMode ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
                                        onClick={() => { setEditMode(p => !p); if (editMode) setProfileForm({ name: user?.name, phone: user?.phone, address: user?.address }); }}
                                        id="edit-profile-btn"
                                    >
                                        {editMode ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                </div>

                                <div className="profile-card">
                                    <div className="profile-avatar-section">
                                        <img src={user?.avatar} alt={user?.name} className="profile-avatar-large" />
                                        <div>
                                            <h3 className="profile-name">{user?.name}</h3>
                                            <p className="profile-email-text">{user?.email}</p>
                                            <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-success'}`}>
                                                {user?.role === 'admin' ? '⚡ Admin' : '✓ Verified'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-form-card">
                                    <div className="profile-field">
                                        <label className="input-label">Full Name</label>
                                        {editMode ? (
                                            <input className="input" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} id="profile-name-input" />
                                        ) : (
                                            <p className="profile-field-value">{user?.name}</p>
                                        )}
                                    </div>
                                    <div className="profile-field">
                                        <label className="input-label">Email</label>
                                        <p className="profile-field-value">{user?.email}</p>
                                    </div>
                                    <div className="profile-field">
                                        <label className="input-label">Phone</label>
                                        {editMode ? (
                                            <input className="input" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} id="profile-phone-input" />
                                        ) : (
                                            <p className="profile-field-value">{user?.phone || 'Not set'}</p>
                                        )}
                                    </div>
                                    <div className="profile-field">
                                        <label className="input-label">Address</label>
                                        {editMode ? (
                                            <textarea className="input" style={{ resize: 'vertical', minHeight: '80px' }} value={profileForm.address} onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))} id="profile-address-input" />
                                        ) : (
                                            <p className="profile-field-value">{user?.address || 'Not set'}</p>
                                        )}
                                    </div>
                                    {editMode && (
                                        <button className="btn btn-primary" onClick={handleProfileSave} id="save-profile-btn">
                                            Save Changes
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ---- Settings ---- */}
                        {activeTab === 'settings' && (
                            <div>
                                <h2 className="content-title">Settings</h2>
                                <div className="settings-list">
                                    {[
                                        { icon: Bell, title: 'Email Notifications', desc: 'Get updates on orders and offers', toggle: true, defaultOn: true },
                                        { icon: Bell, title: 'Push Notifications', desc: 'Receive alerts on your device', toggle: true, defaultOn: false },
                                        { icon: MapPin, title: 'Save Addresses', desc: 'Remember shipping addresses', toggle: true, defaultOn: true },
                                    ].map(({ icon: Icon, title, desc, toggle, defaultOn }) => (
                                        <div key={title} className="settings-row">
                                            <div className="settings-row-left">
                                                <div className="settings-icon">
                                                    <Icon size={18} />
                                                </div>
                                                <div>
                                                    <p className="settings-title">{title}</p>
                                                    <p className="settings-desc">{desc}</p>
                                                </div>
                                            </div>
                                            {toggle && (
                                                <ToggleSwitch defaultOn={defaultOn} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToggleSwitch({ defaultOn }) {
    const [on, setOn] = useState(defaultOn);
    return (
        <div className={`filter-toggle ${on ? 'on' : ''}`} onClick={() => setOn(p => !p)} style={{ cursor: 'pointer' }}>
            <div className="filter-toggle-knob" />
        </div>
    );
}
