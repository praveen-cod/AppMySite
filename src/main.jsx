import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    boxShadow: 'var(--shadow-lg)',
                  },
                  success: {
                    iconTheme: { primary: '#00e676', secondary: 'transparent' },
                  },
                  error: {
                    iconTheme: { primary: '#ff5252', secondary: 'transparent' },
                  },
                }}
              />
            </CartProvider>
          </OrderProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
