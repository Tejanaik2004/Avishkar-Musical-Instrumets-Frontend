import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLoader } from 'react-icons/fi';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '60vh', gap: '16px' }}
      >
        <FiLoader
          size={40}
          style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }}
        />
        <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
