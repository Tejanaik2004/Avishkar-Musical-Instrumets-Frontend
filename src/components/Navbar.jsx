import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiSun, FiMoon, FiMenu, FiX, FiChevronDown, FiLogOut, FiBox, FiList } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import SearchBar from './SearchBar';

const NAV_LINKS = [
  { label: 'Home', to: '/home' },
  { label: 'Traditional', to: '/products?category=traditional' },
  { label: 'Modern', to: '/products?category=modern' },
  { label: 'Categories', to: '/products' },
  { label: 'Offers', to: '/products?offers=true' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/home');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav
      className="fixed-top"
      style={{
        background: scrolled
          ? 'rgba(26, 26, 26, 0.95)'
          : 'rgba(26, 26, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(200, 164, 77, 0.15)',
        zIndex: 1050,
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container d-flex align-items-center justify-content-between py-2" style={{ minHeight: '64px' }}>
        <Link to="/home" className="d-flex align-items-center gap-2 text-decoration-none">
          <FiShoppingCart size={28} style={{ color: 'var(--primary)' }} />
          <span
            className="fw-bold fs-4"
            style={{ color: 'var(--primary)', letterSpacing: '1px' }}
          >
            E-Cart
          </span>
        </Link>

        <div className="d-none d-lg-flex align-items-center gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-decoration-none px-2 py-1"
              style={{
                color:
                  location.pathname === link.to || location.search.includes(link.to.split('?')[1] || '')
                    ? 'var(--primary)'
                    : 'var(--gray-300)',
                fontWeight: location.pathname === link.to ? '600' : '400',
                fontSize: '0.9rem',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--primary)')}
              onMouseLeave={(e) => {
                if (location.pathname !== link.to) e.target.style.color = 'var(--gray-300)';
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="d-flex align-items-center gap-3">
          <button
            className="btn p-1"
            onClick={() => setSearchOpen(!searchOpen)}
            style={{ color: 'var(--gray-300)', background: 'none', border: 'none' }}
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>

          <button
            className="btn p-1"
            onClick={toggleDarkMode}
            style={{ color: 'var(--gray-300)', background: 'none', border: 'none' }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          <Link
            to="/wishlist"
            className="position-relative btn p-1"
            style={{ color: 'var(--gray-300)', background: 'none', border: 'none' }}
          >
            <FiHeart size={20} />
          </Link>

          <Link
            to="/cart"
            className="position-relative btn p-1"
            style={{ color: 'var(--gray-300)', background: 'none', border: 'none' }}
          >
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="position-relative" ref={dropdownRef}>
              <button
                className="btn d-flex align-items-center gap-1 p-1"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ color: 'var(--gray-300)', background: 'none', border: 'none' }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--primary)',
                    color: 'var(--black)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || <FiUser size={16} />}
                </div>
                <FiChevronDown
                  size={14}
                  style={{
                    transition: 'transform 0.3s',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="position-absolute"
                  style={{
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    minWidth: '220px',
                    background: darkMode ? '#2a2a2a' : '#fff',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1060,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="px-3 py-2"
                    style={{
                      borderBottom: '1px solid var(--gray-200)',
                      background: darkMode ? '#333' : '#f8f9fa',
                    }}
                  >
                    <div className="fw-semibold" style={{ color: 'var(--black)', fontSize: '0.9rem' }}>
                      {user?.name}
                    </div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{user?.email}</div>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                      style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600' }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FiBox size={16} />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/my-orders"
                    className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                    style={{ color: 'var(--black)', fontSize: '0.9rem' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiList size={16} />
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                    style={{ color: 'var(--black)', fontSize: '0.9rem' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiUser size={16} />
                    Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                    style={{ color: 'var(--black)', fontSize: '0.9rem' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiHeart size={16} />
                    Wishlist
                  </Link>

                  <button
                    className="d-flex align-items-center gap-2 px-3 py-2 w-100 text-start"
                    style={{
                      color: 'var(--danger)',
                      fontSize: '0.9rem',
                      background: 'none',
                      border: 'none',
                      borderTop: '1px solid var(--gray-200)',
                      cursor: 'pointer',
                    }}
                    onClick={handleLogout}
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="d-flex align-items-center gap-1 text-decoration-none"
              style={{ color: 'var(--gray-300)', fontSize: '0.9rem' }}
            >
              <FiUser size={20} />
              <span className="d-none d-md-inline">Login</span>
            </Link>
          )}

          <button
            className="btn p-1 d-lg-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: 'var(--gray-300)', background: 'none', border: 'none' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div
          className="px-3 pb-3"
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <SearchBar onSearch={() => setSearchOpen(false)} />
        </div>
      )}

      {mobileOpen && (
        <div
          className="d-lg-none px-3 pb-4"
          style={{
            background: 'rgba(26, 26, 26, 0.98)',
            borderTop: '1px solid rgba(200, 164, 77, 0.1)',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="d-block py-2 text-decoration-none"
              style={{
                color:
                  location.pathname === link.to ? 'var(--primary)' : 'var(--gray-300)',
                fontWeight: location.pathname === link.to ? '600' : '400',
                fontSize: '1rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {link.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              className="d-block py-2 text-decoration-none"
              style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem' }}
            >
              Admin Dashboard
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className="d-block py-2 text-decoration-none"
              style={{ color: 'var(--gray-300)', fontSize: '1rem' }}
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
