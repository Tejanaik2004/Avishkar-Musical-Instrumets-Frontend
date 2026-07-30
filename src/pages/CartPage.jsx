import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const LoadingSkeleton = () => (
  <div className="row g-4">
    <div className="col-lg-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="d-flex gap-3 mb-3 p-3" style={{ background: '#222', borderRadius: '12px' }}>
          <div style={{ width: '100px', height: '100px', background: '#2a2a2a', borderRadius: '8px' }} />
          <div className="flex-grow-1">
            <div style={{ height: '16px', width: '60%', background: '#2a2a2a', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '14px', width: '40%', background: '#2a2a2a', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '12px', width: '30%', background: '#2a2a2a', borderRadius: '4px' }} />
          </div>
        </div>
      ))}
    </div>
    <div className="col-lg-4">
      <div style={{ height: '300px', background: '#222', borderRadius: '12px' }} />
    </div>
  </div>
);

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart, updateCartItem, removeFromCart, cartCount } = useCart();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchCart();
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchCart]);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    setUpdating(itemId);
    try {
      await updateCartItem(itemId, newQty);
    } catch {
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discountedPrice || item.product?.price || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const gst = subtotal * 0.18;
  const deliveryCharge = subtotal > 100 ? 0 : 10;
  const grandTotal = subtotal + gst + deliveryCharge;

  if (loading) {
    return (
      <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
        <div className="container py-5"><LoadingSkeleton /></div>
      </div>
    );
  }

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <style>{`
        .cart-item { background: #222; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; transition: all 0.3s; }
        .cart-item:hover { background: #2a2a2a; }
        .cart-img { width: 100px; height: 100px; object-fit: cover; border-radius: 8px; }
        .qty-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; cursor: pointer; background: #1a1a1a; border: 1px solid #444; color: #c9a84c; }
        .qty-btn:hover { background: #333; }
        .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .summary-card { background: #222; border-radius: 12px; padding: 1.5rem; position: sticky; top: 100px; }
        .remove-btn { background: none; border: none; color: #e74c3c; cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.3s; }
        .remove-btn:hover { background: rgba(231,76,60,0.15); }
      `}</style>

      <div className="container py-4">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" style={{ color: '#c9a84c' }}>Home</Link></li>
            <li className="breadcrumb-item active" style={{ color: '#d4c9a8' }}>Shopping Cart</li>
          </ol>
        </nav>

        <h2 className="fw-bold mb-4" style={{ color: '#f5f0e1' }}>
          <FiShoppingBag className="me-2" style={{ color: '#c9a84c' }} />
          Shopping Cart
          <span className="ms-2 badge" style={{ background: '#c9a84c', color: '#1a1a1a', fontSize: '0.9rem' }}>
            {cartCount} item{cartCount !== 1 ? 's' : ''}
          </span>
        </h2>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-5"
          >
            <FiShoppingBag size={80} style={{ color: '#444' }} className="mb-4" />
            <h3 style={{ color: '#f5f0e1' }}>Your cart is empty</h3>
            <p style={{ color: '#888' }} className="mb-4">Looks like you haven't added anything to your cart yet.</p>
            <Link
              to="/products"
              className="btn btn-lg px-5 py-3"
              style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '50px' }}
            >
              <FiArrowLeft className="me-2" /> Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              {cartItems.map((item) => {
                const price = item.product?.discountedPrice || item.product?.price || item.price || 0;
                const originalPrice = item.product?.price || item.price || 0;
                const lineTotal = price * (item.quantity || 1);
                const product = item.product || {};

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="cart-item"
                  >
                    <div className="d-flex gap-3 align-items-start flex-wrap flex-md-nowrap">
                      <Link to={`/products/${product.id || item.productId}`}>
                        <img
                          src={product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/100'}
                          alt={product.name || 'Product'}
                          className="cart-img"
                        />
                      </Link>

                      <div className="flex-grow-1">
                        <Link
                          to={`/products/${product.id || item.productId}`}
                          className="text-decoration-none"
                        >
                          <h6 className="fw-semibold mb-1" style={{ color: '#f5f0e1' }}>
                            {product.name || 'Product'}
                          </h6>
                        </Link>
                        <small style={{ color: '#888' }}>{product.brand}</small>

                        <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                          <span className="fw-bold" style={{ color: '#c9a84c', fontSize: '1.1rem' }}>
                            ${price.toFixed(2)}
                          </span>
                          {originalPrice > price && (
                            <span className="text-decoration-line-through" style={{ color: '#888', fontSize: '0.85rem' }}>
                              ${originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="d-flex flex-column align-items-end gap-2">
                        <button
                          className="remove-btn"
                          onClick={() => handleRemove(item.id)}
                          title="Remove item"
                        >
                          <FiTrash2 size={18} />
                        </button>

                        <div className="d-flex align-items-center" style={{ background: '#1a1a1a', borderRadius: '8px', border: '1px solid #444' }}>
                          <button
                            className="qty-btn"
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                            disabled={item.quantity <= 1 || updating === item.id}
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3 fw-semibold" style={{ color: '#f5f0e1', minWidth: '40px', textAlign: 'center', fontSize: '0.95rem' }}>
                            {updating === item.id ? '...' : item.quantity || 1}
                          </span>
                          <button
                            className="qty-btn"
                            onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                            disabled={updating === item.id}
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        <span className="fw-bold" style={{ color: '#f5f0e1' }}>
                          ${lineTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Summary Sidebar */}
            <div className="col-lg-4">
              <div className="summary-card">
                <h5 className="fw-bold mb-4" style={{ color: '#f5f0e1' }}>Order Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#d4c9a8' }}>Subtotal ({cartCount} items)</span>
                  <span style={{ color: '#f5f0e1' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#d4c9a8' }}>GST (18%)</span>
                  <span style={{ color: '#f5f0e1' }}>${gst.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ color: '#d4c9a8' }}>Delivery</span>
                  <span style={{ color: deliveryCharge === 0 ? '#27ae60' : '#f5f0e1' }}>
                    {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>

                {subtotal < 100 && (
                  <div className="mb-3 p-2" style={{ background: 'rgba(201,168,76,0.1)', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.3)' }}>
                    <small style={{ color: '#c9a84c' }}>
                      Add ${(100 - subtotal).toFixed(2)} more for free delivery!
                    </small>
                  </div>
                )}

                <hr style={{ borderColor: '#444' }} />

                <div className="d-flex justify-content-between mb-4">
                  <strong style={{ color: '#f5f0e1', fontSize: '1.1rem' }}>Grand Total</strong>
                  <strong style={{ color: '#c9a84c', fontSize: '1.3rem' }}>${grandTotal.toFixed(2)}</strong>
                </div>

                <button
                  className="btn w-100 py-3 fw-bold mb-3"
                  onClick={() => navigate('/checkout')}
                  style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '12px', fontSize: '1.05rem' }}
                >
                  Proceed to Checkout <FiArrowRight className="ms-2" />
                </button>

                <Link
                  to="/products"
                  className="btn w-100 py-2"
                  style={{ background: 'transparent', color: '#c9a84c', border: '1px solid #c9a84c', borderRadius: '12px' }}
                >
                  <FiArrowLeft className="me-2" /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
