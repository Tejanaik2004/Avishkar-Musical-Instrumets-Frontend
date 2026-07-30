import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiEye, FiShoppingCart, FiStar, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

function StarRating({ rating, count }) {
  return (
    <div className="d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={14}
          style={{
            color: star <= Math.round(rating) ? 'var(--primary)' : 'var(--gray-400)',
            fill: star <= Math.round(rating) ? 'var(--primary)' : 'none',
          }}
        />
      ))}
      <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem', marginLeft: '4px' }}>
        ({count || 0})
      </span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imgLoaded, setImgLoaded] = useState(false);

  const id = product?._id || product?.id;
  const name = product?.name || 'Untitled Product';
  const price = product?.price || 0;
  const originalPrice = product?.originalPrice || product?.mrp || 0;
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const image = product?.image || product?.images?.[0]?.imageUrl || product?.imageUrl || '/placeholder.png';
  const rating = product?.rating || product?.averageRating || 0;
  const reviewCount = product?.reviewCount || product?.numReviews || 0;
  const stock = product?.stock ?? product?.quantity ?? 0;
  const inWishlist = isInWishlist(id);

  const stockStatus =
    stock === 0 ? { label: 'Out of Stock', color: 'var(--danger)' }
    : stock <= 5 ? { label: 'Low Stock', color: 'var(--warning)' }
    : { label: 'In Stock', color: 'var(--success)' };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    const result = await addToCart(id);
    if (result.success) {
      toast.success('Added to cart');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to buy items');
      navigate('/login');
      return;
    }
    addToCart(id).then(() => navigate('/checkout'));
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      navigate('/login');
      return;
    }
    await toggleWishlist(id);
  };

  return (
    <Link to={`/products/${id}`} className="text-decoration-none">
      <motion.div
        className="card h-100 product-card"
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ cursor: 'pointer' }}
      >
        <div className="position-relative overflow-hidden" style={{ background: 'var(--gray-100)' }}>
          {!imgLoaded && (
            <div className="skeleton" style={{ width: '100%', height: '250px' }} />
          )}
          <img
            src={image}
            alt={name}
            className="product-card-img"
            style={{ display: imgLoaded ? 'block' : 'none' }}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.target.src = '/placeholder.png';
              setImgLoaded(true);
            }}
          />

          {discount > 0 && (
            <span
              className="badge-gold position-absolute"
              style={{ top: '10px', left: '10px', zIndex: 2 }}
            >
              -{discount}%
            </span>
          )}

          <div
            className="position-absolute d-flex flex-column gap-2"
            style={{ top: '10px', right: '10px', zIndex: 2 }}
          >
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: '34px',
                height: '34px',
                background: inWishlist ? 'var(--danger)' : 'rgba(255,255,255,0.9)',
                color: inWishlist ? '#fff' : 'var(--black)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              onClick={handleWishlistToggle}
              aria-label="Toggle wishlist"
            >
              <FiHeart size={16} style={{ fill: inWishlist ? '#fff' : 'none' }} />
            </motion.button>

            <Link
              to={`/products/${id}`}
              className="d-flex align-items-center justify-content-center rounded-circle text-decoration-none"
              style={{
                width: '34px',
                height: '34px',
                background: 'rgba(255,255,255,0.9)',
                color: 'var(--black)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              onClick={(e) => e.stopPropagation()}
              aria-label="Quick view"
            >
              <FiEye size={16} />
            </Link>
          </div>

          <div
            className="position-absolute d-flex gap-2 px-3 pb-3"
            style={{ bottom: imgLoaded ? '0' : 'auto', left: 0, right: 0, zIndex: 2, transform: 'translateY(100%)', transition: 'transform 0.3s ease' }}
          />
        </div>

        <div className="p-3 d-flex flex-column gap-2">
          <h6
            className="mb-0 fw-semibold"
            style={{
              color: 'var(--black)',
              fontSize: '0.95rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.4',
              minHeight: '2.6em',
            }}
          >
            {name}
          </h6>

          <StarRating rating={rating} count={reviewCount} />

          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold" style={{ color: 'var(--primary)', fontSize: '1.15rem' }}>
              ${price.toFixed(2)}
            </span>
            {discount > 0 && (
              <span
                style={{
                  textDecoration: 'line-through',
                  color: 'var(--gray-500)',
                  fontSize: '0.85rem',
                }}
              >
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <span
            style={{
              color: stockStatus.color,
              fontSize: '0.78rem',
              fontWeight: '600',
            }}
          >
            {stockStatus.label}
          </span>

          <div className="d-flex gap-2 mt-1">
            <button
              className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              style={{ fontSize: '0.85rem', padding: '8px 12px' }}
              onClick={handleAddToCart}
              disabled={stock === 0}
            >
              <FiShoppingCart size={14} />
              Add to Cart
            </button>
            <button
              className="btn btn-gold d-flex align-items-center justify-content-center gap-1"
              style={{ fontSize: '0.85rem', padding: '8px 14px' }}
              onClick={handleBuyNow}
              disabled={stock === 0}
            >
              <FiZap size={14} />
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
