import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiChevronLeft, FiStar, FiHeart, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const heroSlides = [
  {
    heading: 'Premium Traditional Instruments',
    subtext: 'Discover handcrafted instruments with authentic sound and timeless craftsmanship.',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    heading: 'Modern Music Revolution',
    subtext: 'Experience cutting-edge instruments engineered for the modern musician.',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  },
  {
    heading: 'Accessories & Essentials',
    subtext: 'Everything you need to tune, maintain, and enhance your musical journey.',
    gradient: 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)',
  },
];

const categories = [
  { id: 1, name: 'String Instruments', description: 'Guitars, Violins, Sitar & more', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400' },
  { id: 2, name: 'Percussion', description: 'Drums, Tablas, Mridangam', image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400' },
  { id: 3, name: 'Wind Instruments', description: 'Flutes, Saxophones, Shehnai', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400' },
  { id: 4, name: 'Keyboards', description: 'Pianos, Synthesizers, Harmonium', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400' },
  { id: 5, name: 'Traditional', description: 'Sarangi, Veena, Dholak', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { id: 6, name: 'Accessories', description: 'Strings, Cases, Tuners', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400' },
];

const testimonials = [
  { name: 'Ravi Shankar', role: 'Professional Musician', text: 'The quality of instruments here is unmatched. My sitar from this store has the most authentic tone.', rating: 5 },
  { name: 'Priya Menon', role: 'Music Teacher', text: 'I recommend this store to all my students. Great variety and excellent customer service.', rating: 5 },
  { name: 'Arjun Das', role: 'College Band Member', text: 'Found everything I needed for our band at incredible prices. Fast delivery too!', rating: 4 },
];

const LoadingSkeleton = ({ count = 4, type = 'product' }) => (
  <div className="row g-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={type === 'product' ? 'col-lg-3 col-md-4 col-6' : 'col'}>
        <div className="card h-100 border-0 shadow-sm" style={{ background: '#2a2a2a' }}>
          <div className="skeleton-pulse" style={{ height: type === 'product' ? '200px' : '300px', background: 'linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%)', backgroundSize: '200% 100%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div className="card-body">
            <div className="skeleton-pulse mb-2" style={{ height: '16px', width: '70%', background: '#3a3a3a', borderRadius: '4px' }} />
            <div className="skeleton-pulse" style={{ height: '12px', width: '50%', background: '#3a3a3a', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
    ))}
    <style>{`@keyframes pulse { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }`}</style>
  </div>
);

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [traditionalProducts, setTraditionalProducts] = useState([]);
  const [modernProducts, setModernProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [latestArrivals, setLatestArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [featured, trad, modern, best, recent] = await Promise.allSettled([
          api.get('/products?size=8'),
          api.get('/products?category=1'),
          api.get('/products?category=2'),
          api.get('/products/bestsellers?limit=8'),
          api.get('/products/recent?limit=8'),
        ]);
        if (featured.status === 'fulfilled') setFeaturedProducts(featured.value.data?.content || featured.value.data || []);
        if (trad.status === 'fulfilled') setTraditionalProducts(trad.value.data?.content || trad.value.data || []);
        if (modern.status === 'fulfilled') setModernProducts(modern.value.data?.content || modern.value.data || []);
        if (best.status === 'fulfilled') setBestSellers(best.value.data?.content || best.value.data || []);
        if (recent.status === 'fulfilled') setLatestArrivals(recent.value.data?.content || recent.value.data || []);
      } catch {
        toast.error('Failed to load some content');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const renderProductRow = (products) => (
    <div className="row g-4">
      {products.map((product) => (
        <div key={product.id} className="col-lg-3 col-md-4 col-6">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );

  const renderHorizontalScroll = (products) => (
    <div className="d-flex gap-4 overflow-auto pb-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#c9a84c #1a1a1a' }}>
      {products.map((product) => (
        <div key={product.id} style={{ minWidth: '260px', flexShrink: 0 }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <style>{`
        .hero-slide { transition: opacity 0.8s ease-in-out; }
        .hero-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid #c9a84c; background: transparent; cursor: pointer; transition: all 0.3s; }
        .hero-dot.active { background: #c9a84c; }
        .category-card { overflow: hidden; border-radius: 12px; cursor: pointer; position: relative; }
        .category-card img { transition: transform 0.5s ease; }
        .category-card:hover img { transform: scale(1.1); }
        .category-card .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; align-items: flex-end; padding: 1.5rem; }
        .testimonial-card { background: #2a2a2a; border-radius: 12px; padding: 2rem; border-left: 4px solid #c9a84c; }
        .offers-banner { background: linear-gradient(135deg, #c9a84c 0%, #a8893a 100%); border-radius: 16px; padding: 3rem; color: #1a1a1a; }
        .section-heading { color: #f5f0e1; font-weight: 700; position: relative; display: inline-block; }
        .section-heading::after { content: ''; position: absolute; bottom: -8px; left: 0; width: 60px; height: 3px; background: #c9a84c; }
        .d-flex::-webkit-scrollbar { height: 6px; }
        .d-flex::-webkit-scrollbar-thumb { background: #c9a84c; border-radius: 3px; }
        .d-flex::-webkit-scrollbar-track { background: #1a1a1a; }
      `}</style>

      {/* Hero Slider */}
      <section style={{ position: 'relative', height: '85vh', overflow: 'hidden' }}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="hero-slide"
            style={{
              position: 'absolute',
              inset: 0,
              background: slide.gradient,
              opacity: currentSlide === index ? 1 : 0,
              zIndex: currentSlide === index ? 1 : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={currentSlide === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="text-center px-4"
            >
              <h1 className="display-2 fw-bold mb-4" style={{ color: '#f5f0e1', fontFamily: 'Georgia, serif' }}>
                {slide.heading}
              </h1>
              <p className="lead mb-4 mx-auto" style={{ color: '#d4c9a8', maxWidth: '600px' }}>
                {slide.subtext}
              </p>
              <Link
                to="/products"
                className="btn btn-lg px-5 py-3 fw-semibold"
                style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '50px' }}
              >
                Shop Now <FiArrowRight className="ms-2" />
              </Link>
            </motion.div>
          </div>
        ))}

        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="btn position-absolute top-50 start-0 translate-middle-y ms-3"
          style={{ zIndex: 2, background: 'rgba(201,168,76,0.2)', color: '#c9a84c', width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #c9a84c' }}
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="btn position-absolute top-50 end-0 translate-middle-y me-3"
          style={{ zIndex: 2, background: 'rgba(201,168,76,0.2)', color: '#c9a84c', width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #c9a84c' }}
        >
          <FiChevronRight size={24} />
        </button>

        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-3" style={{ zIndex: 2 }}>
          {heroSlides.map((_, i) => (
            <button key={i} className={`hero-dot ${currentSlide === i ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
      </section>

      <div className="container py-5">
        {/* Featured Products */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
          <h2 className="section-heading mb-4">Featured Products</h2>
          {loading ? <LoadingSkeleton /> : renderProductRow(featuredProducts)}
        </motion.section>

        {/* Traditional Instruments */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-heading">Traditional Instruments</h2>
            <Link to="/products?category=1" className="btn btn-outline-warning btn-sm" style={{ borderColor: '#c9a84c', color: '#c9a84c' }}>
              View All <FiArrowRight className="ms-1" />
            </Link>
          </div>
          {loading ? <LoadingSkeleton count={4} /> : renderHorizontalScroll(traditionalProducts)}
        </motion.section>

        {/* Modern Instruments */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-heading">Modern Instruments</h2>
            <Link to="/products?category=2" className="btn btn-outline-warning btn-sm" style={{ borderColor: '#c9a84c', color: '#c9a84c' }}>
              View All <FiArrowRight className="ms-1" />
            </Link>
          </div>
          {loading ? <LoadingSkeleton count={4} /> : renderHorizontalScroll(modernProducts)}
        </motion.section>

        {/* Categories Grid */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
          <h2 className="section-heading mb-4">Shop by Category</h2>
          <div className="row g-4">
            {categories.map((cat) => (
              <div key={cat.id} className="col-lg-4 col-md-6">
                <Link to={`/products?categoryId=${cat.id}`} className="text-decoration-none">
                  <div className="category-card" style={{ height: '250px' }}>
                    <img src={cat.image} alt={cat.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    <div className="overlay">
                      <div>
                        <h5 className="fw-bold mb-1" style={{ color: '#f5f0e1' }}>{cat.name}</h5>
                        <small style={{ color: '#d4c9a8' }}>{cat.description}</small>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Best Sellers */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
          <h2 className="section-heading mb-4">Best Sellers</h2>
          {loading ? <LoadingSkeleton /> : renderProductRow(bestSellers)}
        </motion.section>

        {/* Offers Banner */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
          <div className="offers-banner text-center">
            <h2 className="display-5 fw-bold mb-3">Mega Sale — Up to 40% Off!</h2>
            <p className="lead mb-4" style={{ color: '#3d3420' }}>
              Limited time offer on selected premium instruments. Don't miss out!
            </p>
            <Link
              to="/products"
              className="btn btn-lg px-5 py-3 fw-bold"
              style={{ background: '#1a1a1a', color: '#c9a84c', borderRadius: '50px' }}
            >
              Grab the Deal <FiArrowRight className="ms-2" />
            </Link>
          </div>
        </motion.section>

        {/* Latest Arrivals */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
          <h2 className="section-heading mb-4">Latest Arrivals</h2>
          {loading ? <LoadingSkeleton /> : renderProductRow(latestArrivals)}
        </motion.section>

        {/* Testimonials */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-5">
          <h2 className="section-heading mb-4">What Our Customers Say</h2>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <div className="testimonial-card h-100">
                  <div className="mb-3">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <FiStar
                        key={si}
                        size={18}
                        style={{ color: si < t.rating ? '#c9a84c' : '#555', fill: si < t.rating ? '#c9a84c' : 'none' }}
                      />
                    ))}
                  </div>
                  <p className="mb-3" style={{ color: '#d4c9a8', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div>
                    <strong style={{ color: '#f5f0e1' }}>{t.name}</strong>
                    <br />
                    <small style={{ color: '#888' }}>{t.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;
