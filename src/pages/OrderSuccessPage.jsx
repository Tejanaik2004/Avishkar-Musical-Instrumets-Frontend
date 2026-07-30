import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiShoppingBag, FiPackage } from 'react-icons/fi';

const ConfettiPiece = ({ delay, left, color }) => (
  <motion.div
    initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
    animate={{
      y: [0, -100, 400],
      x: [0, (Math.random() - 0.5) * 200],
      opacity: [1, 1, 0],
      rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
    }}
    transition={{ duration: 2 + Math.random(), delay, ease: 'easeOut' }}
    style={{
      position: 'absolute',
      left: `${left}%`,
      top: '40%',
      width: '10px',
      height: '10px',
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      background: color,
      pointerEvents: 'none',
    }}
  />
);

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || `ORD-${Date.now().toString(36).toUpperCase()}`;
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const colors = ['#c9a84c', '#f5f0e1', '#27ae60', '#e74c3c', '#3498db', '#f39c12', '#9b59b6'];
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 0.5,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="text-center position-relative"
            style={{ maxWidth: '500px' }}
          >
            {/* Confetti */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              {confetti.map((piece) => (
                <ConfettiPiece key={piece.id} {...piece} />
              ))}
            </div>

            {/* Success Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="d-inline-flex align-items-center justify-content-center mb-4"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                boxShadow: '0 0 40px rgba(39,174,96,0.3)',
              }}
            >
              <FiCheck size={60} color="#fff" strokeWidth={3} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="fw-bold mb-3"
              style={{ color: '#f5f0e1' }}
            >
              Order Placed Successfully!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ color: '#d4c9a8', fontSize: '1.1rem' }}
            >
              Thank you for your purchase. Your order has been confirmed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="my-4 p-4"
              style={{ background: '#222', borderRadius: '12px', border: '1px solid #333' }}
            >
              <small style={{ color: '#888' }}>Order Number</small>
              <h4 className="fw-bold mb-0 mt-1" style={{ color: '#c9a84c', letterSpacing: '2px' }}>
                {orderId}
              </h4>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mb-4"
              style={{ color: '#888', fontSize: '0.9rem' }}
            >
              A confirmation email has been sent to your registered email address.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="d-flex gap-3 justify-content-center flex-wrap"
            >
              <Link
                to="/products"
                className="btn px-4 py-3 fw-semibold"
                style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '12px', minWidth: '180px' }}
              >
                <FiShoppingBag className="me-2" /> Continue Shopping
              </Link>
              <Link
                to="/my-orders"
                className="btn px-4 py-3 fw-semibold"
                style={{ background: '#2a2a2a', color: '#c9a84c', border: '1px solid #c9a84c', borderRadius: '12px', minWidth: '180px' }}
              >
                <FiPackage className="me-2" /> View Orders
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
