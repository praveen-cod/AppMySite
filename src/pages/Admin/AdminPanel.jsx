import { useState } from 'react';
import {
    LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
    TrendingUp, DollarSign, Eye, Edit3, Trash2, Plus, Search,
    ChevronDown, X, Save, ArrowUpRight
} from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import toast from 'react-hot-toast';
import './AdminPanel.css';

const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const MOCK_USERS_LIST = [
    { id: 'usr-001', name: 'Alex Johnson', email: 'alex@example.com', orders: 3, spent: 629.97, status: 'Active', joined: '2023-03-15' },
    { id: 'usr-002', name: 'Maria Garcia', email: 'maria@example.com', orders: 2, spent: 174.98, status: 'Active', joined: '2023-07-22' },
    { id: 'usr-003', name: 'John Smith', email: 'john@example.com', orders: 1, spent: 145.00, status: 'Active', joined: '2024-01-10' },
    { id: 'usr-004', name: 'Emily Chen', email: 'emily@example.com', orders: 5, spent: 892.45, status: 'Active', joined: '2022-11-05' },
];

export default function AdminPanel() {
    const { adminProducts, orders, updateOrderStatus, updateProduct, deleteProduct, addProduct } = useOrder();
    const [activeTab, setActiveTab] = useState('overview');
    const [productSearch, setProductSearch] = useState('');
    const [editProduct, setEditProduct] = useState(null);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', brand: '', category: 'Running', price: '', stock: '', description: '' });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

    const filteredProducts = adminProducts.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(productSearch.toLowerCase())
    );

    const handleStatusChange = (orderId, status) => {
        updateOrderStatus(orderId, status);
        toast.success(`Order ${orderId} updated to ${status}`);
    };

    const handleDeleteProduct = (id, name) => {
        if (window.confirm(`Delete "${name}"?`)) {
            deleteProduct(id);
            toast.success('Product deleted');
        }
    };

    const handleSaveProduct = () => {
        if (editProduct) {
            updateProduct(editProduct.id, editProduct);
            toast.success('Product updated!');
            setEditProduct(null);
        }
    };

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.brand || !newProduct.price) {
            toast.error('Please fill required fields');
            return;
        }
        addProduct({
            ...newProduct,
            price: parseFloat(newProduct.price),
            originalPrice: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock) || 50,
            rating: 4.5,
            reviews: 0,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
            images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
            colors: ['#f5f5f5', '#111111'],
            sizes: [7, 8, 9, 10, 11, 12],
            tags: ['new'],
            discount: 0,
        });
        toast.success('Product added!');
        setShowAddProduct(false);
        setNewProduct({ name: '', brand: '', category: 'Running', price: '', stock: '', description: '' });
    };

    const STAT_CARDS = [
        { label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, trend: '+14.2%', color: 'var(--success)' },
        { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, trend: '+8.1%', color: 'var(--accent)' },
        { label: 'Pending Orders', value: pendingOrders, icon: Package, trend: '-3.4%', color: 'var(--warning)' },
        { label: 'Products', value: adminProducts.length, icon: TrendingUp, trend: '+2', color: 'var(--accent-2)' },
    ];

    return (
        <div className="admin-page page-enter">
            <div className="container">
                {/* Header */}
                <div className="admin-header">
                    <div>
                        <h1 className="admin-title heading-display">Admin Panel</h1>
                        <p className="admin-sub">Manage your store, orders, products and more</p>
                    </div>
                    <div className="admin-header-badge">
                        <div className="admin-dot" />
                        <span>Live Dashboard</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            className={`admin-tab ${activeTab === id ? 'active' : ''}`}
                            onClick={() => setActiveTab(id)}
                            id={`admin-tab-${id}`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {activeTab === 'overview' && (
                    <div className="animate-fadeIn">
                        <div className="stats-grid">
                            {STAT_CARDS.map(({ label, value, icon: Icon, trend, color }) => (
                                <div key={label} className="stat-card">
                                    <div className="stat-card-header">
                                        <div className="stat-icon" style={{ color, background: `${color}15` }}>
                                            <Icon size={22} />
                                        </div>
                                        <span className={`stat-trend ${trend.startsWith('+') ? 'up' : 'down'}`}>
                                            <ArrowUpRight size={13} /> {trend}
                                        </span>
                                    </div>
                                    <div className="stat-number">{value}</div>
                                    <div className="stat-label">{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Orders */}
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h2>Recent Orders</h2>
                                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('orders')}>
                                    View All <ArrowUpRight size={13} />
                                </button>
                            </div>
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).map(order => (
                                            <tr key={order.id}>
                                                <td><code className="order-code">{order.id}</code></td>
                                                <td>{order.shipping.name}</td>
                                                <td>{order.items.length} item(s)</td>
                                                <td><strong>${order.total.toFixed(2)}</strong></td>
                                                <td>
                                                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h2>Top Products</h2>
                                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('products')}>
                                    Manage <ArrowUpRight size={13} />
                                </button>
                            </div>
                            <div className="top-products-grid">
                                {adminProducts
                                    .sort((a, b) => b.reviews - a.reviews)
                                    .slice(0, 4)
                                    .map(p => (
                                        <div key={p.id} className="top-product-card">
                                            <img src={p.image} alt={p.name} className="top-product-img" />
                                            <div className="top-product-info">
                                                <p className="top-product-brand">{p.brand}</p>
                                                <p className="top-product-name">{p.name}</p>
                                                <div className="top-product-stats">
                                                    <span className="top-product-price">${p.price}</span>
                                                    <span className="top-product-reviews">⭐ {p.rating} ({p.reviews.toLocaleString()})</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Products */}
                {activeTab === 'products' && (
                    <div className="animate-fadeIn">
                        <div className="admin-section-header" style={{ marginBottom: '1.25rem' }}>
                            <div className="search-bar-shop" style={{ minWidth: '300px' }}>
                                <Search size={16} className="search-bar-icon" />
                                <input
                                    className="search-bar-input"
                                    placeholder="Search products..."
                                    value={productSearch}
                                    onChange={e => setProductSearch(e.target.value)}
                                    id="admin-product-search"
                                />
                            </div>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setShowAddProduct(true)}
                                id="add-product-btn"
                            >
                                <Plus size={16} /> Add Product
                            </button>
                        </div>

                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Brand</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Rating</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="product-table-cell">
                                                    <img src={product.image} alt={product.name} className="product-table-img" />
                                                    <span className="product-table-name">{product.name}</span>
                                                </div>
                                            </td>
                                            <td>{product.brand}</td>
                                            <td>{product.category}</td>
                                            <td><strong>${product.price}</strong></td>
                                            <td>
                                                <span className={product.stock < 20 ? 'low-stock-text' : ''}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td>⭐ {product.rating}</td>
                                            <td>
                                                <div className="action-btns">
                                                    <button
                                                        className="action-icon-btn edit-btn"
                                                        onClick={() => setEditProduct({ ...product })}
                                                        id={`edit-product-${product.id}`}
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        className="action-icon-btn delete-btn"
                                                        onClick={() => handleDeleteProduct(product.id, product.name)}
                                                        id={`delete-product-${product.id}`}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Orders */}
                {activeTab === 'orders' && (
                    <div className="animate-fadeIn">
                        <div className="admin-section">
                            <h2 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '700' }}>All Orders ({orders.length})</h2>
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Date</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Update Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td><code className="order-code">{order.id}</code></td>
                                                <td>{order.shipping.name}</td>
                                                <td>{order.date}</td>
                                                <td>
                                                    <div className="order-items-mini">
                                                        {order.items.slice(0, 2).map(item => (
                                                            <img key={item.id} src={item.image} alt={item.name} className="mini-thumb" />
                                                        ))}
                                                        {order.items.length > 2 && <span className="more-items">+{order.items.length - 2}</span>}
                                                    </div>
                                                </td>
                                                <td><strong>${order.total.toFixed(2)}</strong></td>
                                                <td>
                                                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        className="status-select"
                                                        value={order.status}
                                                        onChange={e => handleStatusChange(order.id, e.target.value)}
                                                        id={`order-status-${order.id}`}
                                                    >
                                                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics */}
                {activeTab === 'analytics' && (
                    <div className="animate-fadeIn">
                        <div className="analytics-grid">
                            {/* Revenue Chart */}
                            <div className="analytics-card">
                                <h3 className="analytics-card-title">Monthly Revenue</h3>
                                <div className="bar-chart">
                                    {[
                                        { month: 'Sep', value: 4200 }, { month: 'Oct', value: 6800 },
                                        { month: 'Nov', value: 5400 }, { month: 'Dec', value: 9200 },
                                        { month: 'Jan', value: 7100 }, { month: 'Feb', value: 8500 },
                                    ].map(({ month, value }) => (
                                        <div key={month} className="bar-item">
                                            <div className="bar-label-top">${(value / 1000).toFixed(1)}k</div>
                                            <div className="bar-wrap">
                                                <div className="bar" style={{ height: `${(value / 9200) * 100}%` }} />
                                            </div>
                                            <div className="bar-label">{month}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Category Breakdown */}
                            <div className="analytics-card">
                                <h3 className="analytics-card-title">Sales by Category</h3>
                                <div className="category-breakdown">
                                    {[
                                        { name: 'Running', pct: 42, color: 'var(--accent)' },
                                        { name: 'Lifestyle', pct: 31, color: 'var(--accent-2)' },
                                        { name: 'Training', pct: 16, color: 'var(--success)' },
                                        { name: 'Skate', pct: 11, color: 'var(--warning)' },
                                    ].map(({ name, pct, color }) => (
                                        <div key={name} className="breakdown-row">
                                            <div className="breakdown-label">
                                                <span className="breakdown-dot" style={{ background: color }} />
                                                <span>{name}</span>
                                            </div>
                                            <div className="breakdown-bar-wrap">
                                                <div className="breakdown-bar" style={{ width: `${pct}%`, background: color }} />
                                            </div>
                                            <span className="breakdown-pct">{pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Brands */}
                            <div className="analytics-card">
                                <h3 className="analytics-card-title">Top Brands</h3>
                                <div className="brand-analytics">
                                    {[
                                        { brand: 'Nike', sales: 234, revenue: 28456 },
                                        { brand: 'Adidas', sales: 187, revenue: 22340 },
                                        { brand: 'Jordan', sales: 143, revenue: 25712 },
                                        { brand: 'Converse', sales: 98, revenue: 6370 },
                                        { brand: 'Vans', sales: 76, revenue: 5700 },
                                    ].map(({ brand, sales, revenue }) => (
                                        <div key={brand} className="brand-row">
                                            <span className="brand-name">{brand}</span>
                                            <div className="brand-metrics">
                                                <span className="brand-sales">{sales} sales</span>
                                                <span className="brand-revenue">${revenue.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Users */}
                            <div className="analytics-card">
                                <h3 className="analytics-card-title">Top Customers</h3>
                                <div className="customer-list">
                                    {MOCK_USERS_LIST.sort((a, b) => b.spent - a.spent).map(u => (
                                        <div key={u.id} className="customer-row">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                                                alt={u.name}
                                                className="customer-avatar"
                                            />
                                            <div className="customer-info">
                                                <p className="customer-name">{u.name}</p>
                                                <p className="customer-email">{u.email}</p>
                                            </div>
                                            <div className="customer-stats">
                                                <span className="customer-orders">{u.orders} orders</span>
                                                <span className="customer-spent">${u.spent.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Product Modal */}
            {editProduct && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditProduct(null); }}>
                    <div className="modal-content" style={{ width: '520px' }}>
                        <div className="modal-header">
                            <h3>Edit Product</h3>
                            <button className="modal-close" onClick={() => setEditProduct(null)}><X size={18} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="input-group">
                                    <label className="input-label">Name</label>
                                    <input className="input" value={editProduct.name} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))} id="edit-name" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Price ($)</label>
                                    <input className="input" type="number" value={editProduct.price} onChange={e => setEditProduct(p => ({ ...p, price: parseFloat(e.target.value) }))} id="edit-price" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label className="input-label">Brand</label>
                                    <input className="input" value={editProduct.brand} onChange={e => setEditProduct(p => ({ ...p, brand: e.target.value }))} id="edit-brand" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Stock</label>
                                    <input className="input" type="number" value={editProduct.stock} onChange={e => setEditProduct(p => ({ ...p, stock: parseInt(e.target.value) }))} id="edit-stock" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setEditProduct(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveProduct} id="save-edit-btn">
                                <Save size={15} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddProduct && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAddProduct(false); }}>
                    <div className="modal-content" style={{ width: '520px' }}>
                        <div className="modal-header">
                            <h3>Add New Product</h3>
                            <button className="modal-close" onClick={() => setShowAddProduct(false)}><X size={18} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="input-group">
                                    <label className="input-label">Product Name *</label>
                                    <input className="input" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} id="new-name" placeholder="e.g. Air Max Pro" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Brand *</label>
                                    <input className="input" value={newProduct.brand} onChange={e => setNewProduct(p => ({ ...p, brand: e.target.value }))} id="new-brand" placeholder="e.g. Nike" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <label className="input-label">Category</label>
                                    <select className="select" value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} id="new-category">
                                        {['Running', 'Lifestyle', 'Skateboarding', 'Training'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Price ($) *</label>
                                    <input className="input" type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} id="new-price" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Initial Stock</label>
                                <input className="input" type="number" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} id="new-stock" placeholder="50" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowAddProduct(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddProduct} id="submit-new-product">
                                <Plus size={15} /> Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
