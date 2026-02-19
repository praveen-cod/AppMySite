import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const MOCK_USERS = [
    {
        id: 'usr-001',
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'password123',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY 10001',
        joinDate: '2023-03-15',
        orders: ['ORD-001', 'ORD-002', 'ORD-005'],
    },
    {
        id: 'adm-001',
        name: 'Admin Sarah',
        email: 'admin@stepkick.com',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        phone: '+1 (555) 999-0001',
        address: '456 Admin Ave, San Francisco, CA 94105',
        joinDate: '2022-01-01',
        orders: [],
    },
];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('stepkick-user')) || null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('stepkick-user', JSON.stringify(user));
    }, [user]);

    const login = async (email, password) => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        const found = MOCK_USERS.find(u => u.email === email && u.password === password);
        setLoading(false);
        if (found) {
            const { password: _, ...safeUser } = found;
            setUser(safeUser);
            return { success: true, user: safeUser };
        }
        return { success: false, error: 'Invalid email or password' };
    };

    const register = async (name, email, password) => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        const exists = MOCK_USERS.find(u => u.email === email);
        setLoading(false);
        if (exists) {
            return { success: false, error: 'Email already exists' };
        }
        const newUser = {
            id: `usr-${Date.now()}`,
            name, email, role: 'user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            phone: '', address: '',
            joinDate: new Date().toISOString().split('T')[0],
            orders: [],
        };
        setUser(newUser);
        return { success: true, user: newUser };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('stepkick-user');
    };

    const updateProfile = (updates) => {
        setUser(prev => ({ ...prev, ...updates }));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
