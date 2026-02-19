import { createContext, useContext, useState } from 'react';
import { products as initialProducts } from '../data/products';

const OrderContext = createContext();

const MOCK_ORDERS = [
    {
        id: 'ORD-001',
        userId: 'usr-001',
        date: '2024-01-15',
        status: 'Delivered',
        total: 329.98,
        items: [
            { id: 1, name: 'Air Max Pulse', brand: 'Nike', price: 149.99, quantity: 1, size: 10, color: '#f5f5f5', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' },
            { id: 3, name: 'Jordan 1 Retro High OG', brand: 'Jordan', price: 179.99, quantity: 1, size: 10, color: '#cc0000', image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=200&q=80' },
        ],
        shipping: { name: 'Alex Johnson', address: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'US' },
        tracking: 'TRK-1234567890',
    },
    {
        id: 'ORD-002',
        userId: 'usr-001',
        date: '2024-02-03',
        status: 'Shipped',
        total: 189.99,
        items: [
            { id: 2, name: 'Ultraboost 23', brand: 'Adidas', price: 189.99, quantity: 1, size: 9, color: '#111111', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&q=80' },
        ],
        shipping: { name: 'Alex Johnson', address: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'US' },
        tracking: 'TRK-9876543210',
    },
    {
        id: 'ORD-003',
        userId: 'usr-002',
        date: '2024-02-10',
        status: 'Processing',
        total: 174.98,
        items: [
            { id: 4, name: 'Chuck Taylor All Star', brand: 'Converse', price: 65.00, quantity: 1, size: 8, color: '#f5f5f5', image: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=200&q=80' },
            { id: 5, name: 'Old Skool Pro', brand: 'Vans', price: 74.99, quantity: 1, size: 8, color: '#111111', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&q=80' },
        ],
        shipping: { name: 'Maria Garcia', address: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'US' },
        tracking: null,
    },
    {
        id: 'ORD-004',
        userId: 'usr-003',
        date: '2024-02-14',
        status: 'Pending',
        total: 145.00,
        items: [
            { id: 12, name: 'Clifton 9', brand: 'HOKA', price: 145.00, quantity: 1, size: 11, color: '#ff6600', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=200&q=80' },
        ],
        shipping: { name: 'John Smith', address: '789 Pine Rd', city: 'Chicago', state: 'IL', zip: '60601', country: 'US' },
        tracking: null,
    },
    {
        id: 'ORD-005',
        userId: 'usr-001',
        date: '2024-02-18',
        status: 'Pending',
        total: 110.00,
        items: [
            { id: 11, name: 'Air Force 1 \'07', brand: 'Nike', price: 110.00, quantity: 1, size: 10, color: '#f5f5f5', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&q=80' },
        ],
        shipping: { name: 'Alex Johnson', address: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'US' },
        tracking: null,
    },
];

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [adminProducts, setAdminProducts] = useState(initialProducts);

    const placeOrder = (cartItems, cartTotal, shippingInfo) => {
        const newOrder = {
            id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
            userId: 'usr-001',
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            total: cartTotal + 9.99,
            items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                brand: item.brand,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: item.image,
            })),
            shipping: shippingInfo,
            tracking: null,
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    const updateOrderStatus = (orderId, status) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    };

    const getUserOrders = (userId) => orders.filter(o => o.userId === userId);

    const updateProduct = (productId, updates) => {
        setAdminProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
    };

    const deleteProduct = (productId) => {
        setAdminProducts(prev => prev.filter(p => p.id !== productId));
    };

    const addProduct = (product) => {
        const newProduct = { ...product, id: Date.now() };
        setAdminProducts(prev => [newProduct, ...prev]);
        return newProduct;
    };

    return (
        <OrderContext.Provider value={{
            orders, placeOrder, updateOrderStatus, getUserOrders,
            adminProducts, updateProduct, deleteProduct, addProduct
        }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder() {
    return useContext(OrderContext);
}
