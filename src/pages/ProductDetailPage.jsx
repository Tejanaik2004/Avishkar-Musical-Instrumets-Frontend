import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiMinus, FiPlus, FiChevronRight, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const LoadingSkeleton = () => (
  <div className="row g-5">
    <div className="col-lg-6">
      <div style={{ height: '450px', background: 'linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%)', backgroundSize: '200% 100%', animation: 'pulse 1.5s ease-in-out infinite', borderRadius: '12px' }} />
      <div className="d-flex gap-2 mt-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ width: '80px', height: '80px', background: '#2a2a2a', borderRadius: '8px' }} />
        ))}
      </div>
    </div>
    <div className="col-lg-6">
      <div style={{ height: '32px', width: '60%', background: '#2a2a2a', borderRadius: '4px', marginBottom: '16px' }} />
      <div style={{ height: '20px', width: '40%', background: '#2a2a2a', borderRadius: '4px', marginBottom: '24px' }} />
      <div style={{ height: '40px', width: '30%', background: '#2a2a2a', borderRadius: '4px', marginBottom: '24px' }} />
      <div style={{ height: '80px', background: '#2a2a2a', borderRadius: '4px', marginBottom: '16px' }} />
      <div style={{ height: '50px', width: '200px', background: '#2a2a2a', borderRadius: '8px' }} />
    </div>
    <style>{`@keyframes pulse { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }`}</style>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        const data = res.data;
        setProduct(data);
        if (data.categoryId) {
          try {
            const relRes = await api.get(`/products/category/${data.categoryId}?size=4`);
            const related = (relRes.data?.content || relRes.data || []).filter((p) => p.id !== Number(id));
            setRelatedProducts(related.slice(0, 4));
          } catch { /* silent */ }
        }
        if (data.reviews) setReviews(data.reviews);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product.id, quantity);
      navigate('/cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${product.id}`);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/wishlist/toggle/${product.id}`);
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', { productId: Number(id), rating: reviewRating, comment: reviewComment });
      setReviews((prev) => [res.data, ...prev]);
      setReviewComment('');
      setReviewRating(5);
      toast.success('Review submitted!');
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const imageUrls = product?.images?.length > 0 ? product.images.map(img => img.imageUrl || img) : [product?.imageUrl || 'https://via.placeholder.com/600'];

  const renderStars = (rating, size = 16) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FiStar key={i} size={size} style={{ color: i < Math.round(rating) ? '#c9a84c' : '#555', fill: i < Math.round(rating) ? '#c9a84c' : 'none' }} />
    ));

  if (loading) {
    return (
      <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
        <div className="container py-5"><LoadingSkeleton /></div>
      </div>
    );
  }

  if (!product) return null;

  const specs = [
    { label: 'Brand', value: product.brand },
    { label: 'Material', value: product.material },
    { label: 'Instrument Type', value: product.instrumentType || product.category?.name },
    { label: 'Origin', value: product.origin },
    { label: 'Weight', value: product.weight ? `${product.weight} kg` : null },
    { label: 'Dimensions', value: product.dimensions },
  ].filter((s) => s.value);

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <style>{`
        .img-thumb { border: 2px solid transparent; cursor: pointer; transition: all 0.3s; border-radius: 8px; overflow: hidden; }
        .img-thumb.active, .img-thumb:hover { border-color: #c9a84c; }
        .spec-row { border-bottom: 1px solid #333; }
        .review-card { background: #222; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }
        .qty-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; cursor: pointer; font-size: 1.1rem; }
      `}</style>

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" style={{ color: '#c9a84c' }}>Home</Link></li>
            <li className="breadcrumb-item"><Link to="/products" style={{ color: '#c9a84c' }}>Products</Link></li>
            <li className="breadcrumb-item active" style={{ color: '#d4c9a8' }}>{product.name}</li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Image Gallery */}
          <div className="col-lg-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="mb-3"
                style={{ borderRadius: '12px', overflow: 'hidden', background: '#2a2a2a' }}
              >
                <img
                  src={imageUrls[selectedImage]}
                  alt={product.name}
                  className="w-100"
                  style={{ height: '450px', objectFit: 'contain', padding: '1rem' }}
                />
              </motion.div>
            </AnimatePresence>
            {imageUrls.length > 1 && (
              <div className="d-flex gap-2">
                {imageUrls.map((img, i) => (
                  <div
                    key={i}
                    className={`img-thumb ${selectedImage === i ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="col-lg-6">
            <h1 className="fw-bold mb-2" style={{ color: '#f5f0e1', fontSize: '2rem' }}>{product.name}</h1>

            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="d-flex align-items-center gap-1">
                {renderStars(avgRating || product.rating || 0)}
              </div>
              <span style={{ color: '#888' }}>({reviews.length || product.reviewCount || 0} reviews)</span>
            </div>

            <div className="d-flex align-items-baseline gap-3 mb-4">
              <span className="fw-bold" style={{ color: '#c9a84c', fontSize: '2rem' }}>
                ${product.discountedPrice || product.price}
              </span>
              {product.discountedPrice && product.discountedPrice < product.price && (
                <>
                  <span className="text-decoration-line-through" style={{ color: '#888', fontSize: '1.2rem' }}>
                    ${product.price}
                  </span>
                  <span className="badge" style={{ background: '#27ae60', color: '#fff' }}>
                    {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p style={{ color: '#d4c9a8', lineHeight: '1.7' }}>{product.description}</p>

            {/* Specifications */}
            {specs.length > 0 && (
              <div className="mb-4 mt-4">
                <h5 className="fw-bold mb-3" style={{ color: '#f5f0e1' }}>Specifications</h5>
                <div style={{ background: '#222', borderRadius: '12px', overflow: 'hidden' }}>
                  {specs.map((spec, i) => (
                    <div key={i} className="d-flex spec-row" style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ color: '#888', width: '140px', flexShrink: 0 }}>{spec.label}</span>
                      <span style={{ color: '#f5f0e1' }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-4">
              <span
                className="badge px-3 py-2"
                style={{
                  background: product.stock > 0 ? 'rgba(39,174,96,0.15)' : 'rgba(231,76,60,0.15)',
                  color: product.stock > 0 ? '#27ae60' : '#e74c3c',
                  fontSize: '0.85rem',
                }}
              >
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <span style={{ color: '#d4c9a8' }}>Quantity:</span>
              <div className="d-flex align-items-center" style={{ background: '#2a2a2a', borderRadius: '8px', border: '1px solid #444' }}>
                <button
                  className="qty-btn"
                  style={{ color: '#c9a84c', background: 'none', border: 'none' }}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="px-3 fw-semibold" style={{ color: '#f5f0e1', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                <button
                  className="qty-btn"
                  style={{ color: '#c9a84c', background: 'none', border: 'none' }}
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
              <button
                className="btn btn-lg flex-grow-1 py-3 fw-bold"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '12px', minWidth: '200px' }}
              >
                <FiShoppingCart className="me-2" /> Add to Cart
              </button>
              <button
                className="btn btn-lg flex-grow-1 py-3 fw-bold"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                style={{ background: '#27ae60', color: '#fff', borderRadius: '12px', minWidth: '200px' }}
              >
                Buy Now
              </button>
              <button
                className="btn btn-lg py-3"
                onClick={handleWishlist}
                style={{
                  background: isWishlisted ? 'rgba(231,76,60,0.15)' : '#2a2a2a',
                  color: isWishlisted ? '#e74c3c' : '#d4c9a8',
                  border: `1px solid ${isWishlisted ? '#e74c3c' : '#444'}`,
                  borderRadius: '12px',
                }}
              >
                <FiHeart style={{ fill: isWishlisted ? '#e74c3c' : 'none' }} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="d-flex gap-4 flex-wrap">
              {[
                { icon: <FiTruck />, text: 'Free Shipping over $100' },
                { icon: <FiShield />, text: 'Secure Payment' },
                { icon: <FiRefreshCw />, text: '7-Day Returns' },
              ].map((badge, i) => (
                <div key={i} className="d-flex align-items-center gap-2" style={{ color: '#888', fontSize: '0.85rem' }}>
                  <span style={{ color: '#c9a84c' }}>{badge.icon}</span> {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-5 pt-5" style={{ borderTop: '1px solid #333' }}>
          <h3 className="fw-bold mb-4" style={{ color: '#f5f0e1' }}>
            Customer Reviews
            {reviews.length > 0 && (
              <span className="ms-2 badge" style={{ background: '#c9a84c', color: '#1a1a1a', fontSize: '0.9rem' }}>
                {avgRating} ★
              </span>
            )}
          </h3>

          {/* Review Summary */}
          {reviews.length > 0 && (
            <div className="d-flex align-items-center gap-4 mb-4 p-4" style={{ background: '#222', borderRadius: '12px' }}>
              <div className="text-center">
                <div className="fw-bold" style={{ color: '#c9a84c', fontSize: '2.5rem' }}>{avgRating}</div>
                <div className="d-flex gap-1 justify-content-center mb-1">{renderStars(avgRating, 18)}</div>
                <small style={{ color: '#888' }}>{reviews.length} reviews</small>
              </div>
            </div>
          )}

          {/* Add Review Form */}
          {user ? (
            <form onSubmit={handleSubmitReview} className="mb-4 p-4" style={{ background: '#222', borderRadius: '12px' }}>
              <h5 className="fw-semibold mb-3" style={{ color: '#f5f0e1' }}>Write a Review</h5>
              <div className="mb-3">
                <label className="form-label" style={{ color: '#d4c9a8' }}>Rating</label>
                <div className="d-flex gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReviewRating(r)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <FiStar
                        size={24}
                        style={{ color: r <= reviewRating ? '#c9a84c' : '#555', fill: r <= reviewRating ? '#c9a84c' : 'none' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: '#d4c9a8' }}>Comment</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  style={{ background: '#2a2a2a', color: '#f5f0e1', border: '1px solid #444' }}
                />
              </div>
              <button
                type="submit"
                className="btn px-4"
                disabled={submittingReview}
                style={{ background: '#c9a84c', color: '#1a1a1a' }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="mb-4 p-4 text-center" style={{ background: '#222', borderRadius: '12px' }}>
              <p style={{ color: '#888' }}>
                <Link to="/login" style={{ color: '#c9a84c' }}>Login</Link> to write a review
              </p>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-center py-4" style={{ color: '#888' }}>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review, i) => (
              <div key={review.id || i} className="review-card">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <strong style={{ color: '#f5f0e1' }}>{review.userName || review.user?.name || 'Anonymous'}</strong>
                    <div className="d-flex gap-1 mt-1">{renderStars(review.rating)}</div>
                  </div>
                  <small style={{ color: '#888' }}>
                    {new Date(review.createdAt || review.date).toLocaleDateString()}
                  </small>
                </div>
                <p className="mb-0 mt-2" style={{ color: '#d4c9a8' }}>{review.comment}</p>
              </div>
            ))
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-5 pt-5" style={{ borderTop: '1px solid #333' }}>
            <h3 className="fw-bold mb-4" style={{ color: '#f5f0e1' }}>Related Products</h3>
            <div className="row g-4">
              {relatedProducts.map((p) => (
                <div key={p.id} className="col-lg-3 col-md-4 col-6">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
