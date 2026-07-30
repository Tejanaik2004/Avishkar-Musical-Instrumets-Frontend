import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--cream)', flexDirection: 'column', textAlign: 'center', padding: 20,
    }}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <h1 style={{ fontSize: '8rem', fontWeight: 800, color: '#C8A44D', lineHeight: 1, marginBottom: 0 }}>404</h1>
        <h2 style={{ fontWeight: 600, marginBottom: 12 }}>Page Not Found</h2>
        <p style={{ color: '#666', marginBottom: 32, maxWidth: 400 }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/home" style={{
            padding: '12px 32px', background: '#C8A44D', color: '#1a1a1a', borderRadius: 8,
            fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(200,164,77,0.4)'; }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
          >Go Home</Link>
          <Link to="/products" style={{
            padding: '12px 32px', border: '2px solid #1a1a1a', color: '#1a1a1a', borderRadius: 8,
            fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.target.style.background = '#1a1a1a'; e.target.style.color = '#fff'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#1a1a1a'; }}
          >Browse Products</Link>
        </div>
      </motion.div>
    </div>
  );
}
