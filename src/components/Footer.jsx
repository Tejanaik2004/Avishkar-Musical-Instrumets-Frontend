import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <h5 style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '20px' }}>About E-Cart</h5>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              Your premier destination for curated products blending traditional
              elegance with modern design. We bring quality craftsmanship right to
              your doorstep.
            </p>
            <div className="d-flex gap-3 mt-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: '38px',
                    height: '38px',
                    background: 'rgba(200, 164, 77, 0.1)',
                    color: 'var(--primary)',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--black)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(200, 164, 77, 0.1)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '20px' }}>Quick Links</h5>
            <ul className="list-unstyled">
              {[
                { label: 'Home', to: '/home' },
                { label: 'Shop', to: '/products' },
                { label: 'Categories', to: '/products' },
                { label: 'About', to: '/about' },
              ].map((item) => (
                <li key={item.label} className="mb-2">
                  <Link
                    to={item.to}
                    className="d-flex align-items-center gap-2 text-decoration-none"
                    style={{ color: 'var(--gray-500)', fontSize: '0.9rem', transition: 'all 0.3s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-500)')}
                  >
                    <FiArrowRight size={12} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '20px' }}>Categories</h5>
            <ul className="list-unstyled">
              {['Traditional', 'Modern', 'Accessories'].map((cat) => (
                <li key={cat} className="mb-2">
                  <Link
                    to={`/products?category=${cat.toLowerCase()}`}
                    className="d-flex align-items-center gap-2 text-decoration-none"
                    style={{ color: 'var(--gray-500)', fontSize: '0.9rem', transition: 'all 0.3s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gray-500)')}
                  >
                    <FiArrowRight size={12} />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h5 style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '20px' }}>Contact Us</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-start gap-3">
                <FiMapPin size={18} style={{ color: 'var(--primary)', marginTop: '3px', flexShrink: 0 }} />
                <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                  123 Commerce Street, Tech City, TC 56789
                </span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <FiPhone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>+1 (555) 123-4567</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <FiMail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>support@ecart.com</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(200, 164, 77, 0.15)', margin: '40px 0 20px' }} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="mb-0" style={{ color: 'var(--gray-600)', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} E-Cart. All rights reserved.
          </p>
          <div className="d-flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Return Policy'].map((item) => (
              <a
                key={item}
                href="#"
                style={{ color: 'var(--gray-600)', fontSize: '0.85rem', transition: 'color 0.3s' }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--gray-600)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
