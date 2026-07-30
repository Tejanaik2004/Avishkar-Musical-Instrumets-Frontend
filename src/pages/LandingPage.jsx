import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiStar, FiShield, FiHeadphones, FiChevronLeft, FiChevronRight, FiMessageSquare } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const FEATURES = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'Free delivery on orders over $99' },
  { icon: FiStar, title: 'Premium Quality', desc: 'Handpicked instruments of finest quality' },
  { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout process' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Expert help whenever you need it' },
];

const CATEGORIES = [
  { name: 'Guitars', slug: 'guitars', gradient: 'linear-gradient(135deg, #2c1810 0%, #5a3520 100%)' },
  { name: 'Pianos & Keys', slug: 'pianos', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' },
  { name: 'Traditional Drums', slug: 'drums', gradient: 'linear-gradient(135deg, #3d2b1f 0%, #6b4226 100%)' },
  { name: 'Wind Instruments', slug: 'wind', gradient: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)' },
  { name: 'String Instruments', slug: 'strings', gradient: 'linear-gradient(135deg, #4a1a2e 0%, #7b2d4e 100%)' },
  { name: 'Accessories', slug: 'accessories', gradient: 'linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 100%)' },
];

const TESTIMONIALS = [
  { name: 'Sarah Mitchell', role: 'Professional Violinist', text: 'The craftsmanship of the instruments here is extraordinary. Every piece tells a story of dedication and artistry. My Stradivarius replica exceeded all expectations.', rating: 5 },
  { name: 'James Rodriguez', role: 'Music Producer', text: 'From vintage synthesizers to classic drums, this collection bridges generations of music. The quality is unmatched and the customer service is phenomenal.', rating: 5 },
  { name: 'Ananya Sharma', role: 'Classical Dancer & Musician', text: 'Finding authentic traditional instruments used to be impossible. E-Cart made it effortless. The sitar I purchased is tuned to perfection.', rating: 5 },
  { name: 'Michael Chen', role: 'Jazz Guitarist', text: 'The attention to detail in every instrument is remarkable. My handcrafted jazz guitar has the warmest, richest tone I have ever played.', rating: 5 },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #1a1510 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 70% 50%, rgba(200, 164, 77, 0.08) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200, 164, 77, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-8">
              <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                <motion.div variants={slideUp}>
                  <span
                    className="d-inline-block px-3 py-1 mb-4"
                    style={{
                      color: 'var(--primary)',
                      border: '1px solid rgba(200, 164, 77, 0.3)',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Premium Musical Instruments
                  </span>
                </motion.div>

                <motion.h1
                  variants={slideUp}
                  style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    fontWeight: '700',
                    color: '#fff',
                    lineHeight: '1.1',
                    marginBottom: '1.5rem',
                  }}
                >
                  Discover the{' '}
                  <span style={{ color: 'var(--primary)' }}>Soul</span>
                  <br />
                  of Music
                </motion.h1>

                <motion.p
                  variants={slideUp}
                  style={{
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    color: 'rgba(255,255,255,0.6)',
                    maxWidth: '550px',
                    lineHeight: '1.8',
                    marginBottom: '2.5rem',
                  }}
                >
                  Traditional & Modern Musical Instruments. Explore our curated collection of
                  premium instruments that blend timeless artistry with contemporary innovation.
                </motion.p>

                <motion.div variants={slideUp} className="d-flex flex-wrap gap-3">
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() => navigate('/home')}
                    style={{ padding: '14px 36px', fontSize: '1rem' }}
                  >
                    Shop Now <FiArrowRight size={18} />
                  </button>
                  <Link
                    to="/products"
                    className="btn d-flex align-items-center gap-2"
                    style={{
                      padding: '14px 36px',
                      fontSize: '1rem',
                      color: 'var(--primary)',
                      border: '1px solid rgba(200, 164, 77, 0.4)',
                      background: 'transparent',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    Explore Collections
                  </Link>
                </motion.div>

                <motion.div variants={slideUp} className="d-flex gap-5 mt-5">
                  {[
                    { val: '500+', label: 'Instruments' },
                    { val: '50+', label: 'Artisans' },
                    { val: '10K+', label: 'Musicians' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div style={{ color: 'var(--primary)', fontSize: '1.8rem', fontWeight: '700' }}>
                        {stat.val}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 0', background: 'var(--cream)' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="row g-4"
          >
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={slideUp} className="col-md-6 col-lg-3">
                <div
                  className="text-center p-4 h-100"
                  style={{
                    background: '#fff',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--gray-200)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    e.currentTarget.style.borderColor = 'rgba(200, 164, 77, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'var(--gray-200)';
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(200, 164, 77, 0.1)',
                    }}
                  >
                    <feature.icon size={28} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>{feature.title}</h5>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', margin: 0 }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-5"
          >
            <motion.span
              variants={slideUp}
              className="d-inline-block px-3 py-1 mb-3"
              style={{
                color: 'var(--primary)',
                border: '1px solid rgba(200, 164, 77, 0.3)',
                borderRadius: '20px',
                fontSize: '0.85rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Our Collection
            </motion.span>
            <motion.h2
              variants={slideUp}
              style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}
            >
              Browse by Category
            </motion.h2>
            <motion.p variants={slideUp} style={{ color: 'var(--gray-600)', maxWidth: '600px', margin: '0 auto' }}>
              From timeless classics to cutting-edge modern instruments, find the perfect sound for every genre.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="row g-4"
          >
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.slug} variants={slideUp} className="col-md-4">
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="d-block text-decoration-none"
                  style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}
                >
                  <div
                    className="position-relative d-flex align-items-end p-4"
                    style={{
                      height: '280px',
                      background: cat.gradient,
                      borderRadius: 'var(--radius)',
                      transition: 'all 0.4s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.7) 100%)',
                      }}
                    />
                    <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                      <h4 className="fw-bold text-white mb-2">{cat.name}</h4>
                      <span
                        className="d-inline-flex align-items-center gap-1"
                        style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500' }}
                      >
                        Explore <FiArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '100px 0', background: '#1a1a1a' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-5"
          >
            <motion.span
              variants={slideUp}
              className="d-inline-block px-3 py-1 mb-3"
              style={{
                color: 'var(--primary)',
                border: '1px solid rgba(200, 164, 77, 0.3)',
                borderRadius: '20px',
                fontSize: '0.85rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Testimonials
            </motion.span>
            <motion.h2
              variants={slideUp}
              style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', marginBottom: '1rem' }}
            >
              What Musicians Say
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="row justify-content-center"
          >
            <div className="col-lg-8">
              <div
                className="text-center p-5"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid rgba(200, 164, 77, 0.15)',
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <FiMessageSquare
                  size={48}
                  style={{ color: 'rgba(200, 164, 77, 0.2)', marginBottom: '20px', margin: '0 auto 20px' }}
                />

                <p
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '1.15rem',
                    lineHeight: '1.8',
                    fontStyle: 'italic',
                    marginBottom: '24px',
                  }}
                >
                  "{TESTIMONIALS[currentTestimonial].text}"
                </p>

                <div className="d-flex justify-content-center gap-1 mb-3">
                  {Array.from({ length: TESTIMONIALS[currentTestimonial].rating }).map((_, i) => (
                    <FiStar
                      key={i}
                      size={16}
                      style={{ color: 'var(--primary)', fill: 'var(--primary)' }}
                    />
                  ))}
                </div>

                <h6 style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '4px' }}>
                  {TESTIMONIALS[currentTestimonial].name}
                </h6>
                <small style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {TESTIMONIALS[currentTestimonial].role}
                </small>

                <div
                  className="d-flex justify-content-center gap-3 mt-4"
                  style={{ position: 'absolute', bottom: '20px', right: '20px' }}
                >
                  <button
                    onClick={prevTestimonial}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '1px solid rgba(200, 164, 77, 0.3)',
                      background: 'transparent',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary)';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: '1px solid rgba(200, 164, 77, 0.3)',
                      background: 'transparent',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--primary)';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>

                <div className="d-flex justify-content-center gap-2 mt-4">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      style={{
                        width: i === currentTestimonial ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: i === currentTestimonial ? 'var(--primary)' : 'rgba(200, 164, 77, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '100px 0',
          background: 'linear-gradient(135deg, #1a1510 0%, #2c1810 50%, #1a1a1a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(200, 164, 77, 0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={slideUp}
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              Ready to Find Your <span style={{ color: 'var(--primary)' }}>Sound</span>?
            </motion.h2>
            <motion.p
              variants={slideUp}
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '1.1rem',
                maxWidth: '500px',
                margin: '0 auto 2.5rem',
              }}
            >
              Join thousands of musicians who have discovered their perfect instrument with us.
            </motion.p>
            <motion.div variants={slideUp} className="d-flex justify-content-center gap-3 flex-wrap">
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => navigate('/home')}
                style={{ padding: '14px 40px', fontSize: '1rem' }}
              >
                Start Shopping <FiArrowRight size={18} />
              </button>
              <Link
                to="/signup"
                className="btn d-flex align-items-center gap-2"
                style={{
                  padding: '14px 40px',
                  fontSize: '1rem',
                  color: 'var(--primary)',
                  border: '1px solid rgba(200, 164, 77, 0.4)',
                  background: 'transparent',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                Create Account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
