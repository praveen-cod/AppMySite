import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 72px)',
            textAlign: 'center',
            padding: '2rem',
            gap: '1rem'
        }}>
            <h1 style={{ fontSize: '8rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                404
            </h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Page Not Found</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 400 }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary btn-lg" id="go-home-btn">
                Go Back Home
            </Link>
        </div>
    );
}
