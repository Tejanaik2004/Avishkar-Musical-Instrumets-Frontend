import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const LoadingSkeleton = () => (
  <div className="row g-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="col-lg-3 col-md-4 col-6">
        <div className="card h-100 border-0" style={{ background: '#2a2a2a', borderRadius: '12px' }}>
          <div style={{ height: '220px', background: 'linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%)', backgroundSize: '200% 100%', animation: 'pulse 1.5s ease-in-out infinite', borderRadius: '12px 12px 0 0' }} />
          <div className="card-body">
            <div style={{ height: '14px', width: '80%', background: '#3a3a3a', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '12px', width: '50%', background: '#3a3a3a', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
    ))}
    <style>{`@keyframes pulse { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }`}</style>
  </div>
);

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const { addToCart } = useCart();

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      setWishlistItems(res.data?.content || res.data || []);
    } catch {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (itemId, productName) => {
    setRemoving(itemId);
    try {
      await api.delete(`/wishlist/${itemId}`);
      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success(`${productName} removed from wishlist`);
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id || product.productId, 1);
      toast.success(`${product.name || 'Product'} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <style>{`
        .wishlist-card { background: #222; border-radius: 12px; overflow: hidden; transition: all 0.3s; height: 100%; display: flex; flex-direction: column; }
        .wishlist-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
        .wishlist-img { width: 100%; height: 220px; object-fit: cover; }
        .wishlist-actions { display: flex; gap: 0.5rem; }
        .wishlist-actions .btn { flex: 1; }
      `}</style>

      <div className="container py-4">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" style={{ color: '#c9a84c' }}>Home</Link></li>
            <li className="breadcrumb-item active" style={{ color: '#d4c9a8' }}>Wishlist</li>
          </ol>
        </nav>

        <h2 className="fw-bold mb-4" style={{ color: '#f5f0e1' }}>
          <FiHeart className="me-2" style={{ color: '#e74c3c', fill: '#e74c3c' }} /> My Wishlist
          {wishlistItems.length > 0 && (
            <span className="ms-2 badge" style={{ background: '#c9a84c', color: '#1a1a1a', fontSize: '0.9rem' }}>
              {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
            </span>
          )}
        </h2>

        {loading ? (
          <LoadingSkeleton />
        ) : wishlistItems.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-5">
            <FiHeart size={80} style={{ color: '#444' }} className="mb-4" />
            <h3 style={{ color: '#f5f0e1' }}>Your wishlist is empty</h3>
            <p style={{ color: '#888' }} className="mb-4">Save your favorite items here for later.</p>
            <Link
              to="/products"
              className="btn px-5 py-3 fw-semibold"
              style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '50px' }}
            >
              Explore Products
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="row g-4">
              {wishlistItems.map((item) => {
                const product = item.product || item;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="col-lg-3 col-md-4 col-6"
                  >
                    <div className="wishlist-card">
                      <Link to={`/products/${product.id || product.productId}`}>
                        <img
                          src={product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/300'}
                          alt={product.name || 'Product'}
                          className="wishlist-img"
                        />
                      </Link>
                      <div className="p-3 flex-grow-1 d-flex flex-column">
                        <Link
                          to={`/products/${product.id || product.productId}`}
                          className="text-decoration-none mb-1"
                        >
                          <h6 className="fw-semibold mb-1" style={{ color: '#f5f0e1', lineHeight: '1.3' }}>
                            {product.name || 'Product'}
                          </h6>
                        </Link>
                        <small style={{ color: '#888' }} className="mb-2">{product.brand}</small>

                        <div className="mb-3">
                          <span className="fw-bold" style={{ color: '#c9a84c', fontSize: '1.15rem' }}>
                            ${product.discountedPrice || product.price}
                          </span>
                          {product.discountedPrice && product.discountedPrice < product.price && (
                            <span className="text-decoration-line-through ms-2" style={{ color: '#888', fontSize: '0.85rem' }}>
                              ${product.price}
                            </span>
                          )}
                        </div>

                        <div className="wishlist-actions mt-auto">
                          <button
                            className="btn btn-sm py-2 fw-semibold"
                            onClick={() => handleAddToCart(product)}
                            style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '8px' }}
                          >
                            <FiShoppingCart className="me-1" /> Add
                          </button>
                          <button
                            className="btn btn-sm py-2"
                            onClick={() => handleRemove(item.id, product.name)}
                            disabled={removing === item.id}
                            style={{
                              background: 'rgba(231,76,60,0.1)',
                              color: '#e74c3c',
                              border: '1px solid rgba(231,76,60,0.3)',
                              borderRadius: '8px',
                            }}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
