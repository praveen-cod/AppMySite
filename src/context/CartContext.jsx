import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('stepkick-cart')) || [];
        } catch {
            return [];
        }
    });

    const [wishlist, setWishlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('stepkick-wishlist')) || [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('stepkick-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('stepkick-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToCart = useCallback((product, size, color, quantity = 1) => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(
                item => item.id === product.id && item.size === size && item.color === color
            );
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }
            return [...prev, { ...product, size, color, quantity, cartId: `${product.id}-${size}-${color}-${Date.now()}` }];
        });
    }, []);

    const removeFromCart = useCallback((cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    }, []);

    const updateQuantity = useCallback((cartId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(cartId);
            return;
        }
        setCartItems(prev =>
            prev.map(item => item.cartId === cartId ? { ...item, quantity } : item)
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const toggleWishlist = useCallback((productId) => {
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    }, []);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems, cartCount, cartTotal,
            wishlist, addToCart, removeFromCart,
            updateQuantity, clearCart, toggleWishlist
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
