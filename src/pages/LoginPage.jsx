import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiEye, FiEyeOff, FiLoader, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const loginSchema = Yup.object({
  email: Yup.string().required('Username or Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '', rememberMe: false },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const result = await login(values.email, values.password);
      setSubmitting(false);
      if (result.success) {
        toast.success('Login successful! Welcome back.');
        navigate('/home');
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
      }
    },
  });

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Left Panel */}
      <div
        className="d-none d-lg-flex col-lg-5 align-items-center justify-content-center position-relative"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #1a1510 100%)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(200, 164, 77, 0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center p-5"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div
            className="d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(200, 164, 77, 0.1)',
              border: '1px solid rgba(200, 164, 77, 0.2)',
            }}
          >
            <FiShoppingCart size={36} style={{ color: 'var(--primary)' }} />
          </div>
          <h3 style={{ color: '#fff', fontWeight: '700', marginBottom: '12px' }}>E-Cart</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '300px' }}>
            Your premium destination for traditional & modern musical instruments.
          </p>
          <div className="d-flex justify-content-center gap-4 mt-5">
            {['500+ Instruments', 'Free Shipping', '24/7 Support'].map((text) => (
              <span key={text} style={{ color: 'rgba(200, 164, 77, 0.6)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {text}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div
        className="col-12 col-lg-7 d-flex align-items-center justify-content-center p-4"
        style={{ background: 'var(--cream)' }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideRight}
          style={{ width: '100%', maxWidth: '440px' }}
        >
          <div className="d-lg-none text-center mb-4">
            <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none">
              <FiShoppingCart size={28} style={{ color: 'var(--primary)' }} />
              <span className="fw-bold fs-4" style={{ color: 'var(--primary)' }}>E-Cart</span>
            </Link>
          </div>

          <h2 style={{ fontWeight: '700', fontSize: '2rem', marginBottom: '6px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>Sign in to continue to your account</p>

          <form onSubmit={formik.handleSubmit}>
            {/* Email / Username */}
            <div className="mb-3">
              <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block', color: 'var(--gray-700)' }}>
                Username or Email
              </label>
              <div className="position-relative">
                <FiUser
                  size={18}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }}
                />
                <input
                  type="text"
                  name="email"
                  className="form-control"
                  placeholder="Enter username or email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  style={{
                    paddingLeft: '44px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    border: formik.touched.email && formik.errors.email ? '1px solid var(--danger)' : '1px solid var(--gray-300)',
                    background: '#fff',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{formik.errors.email}</small>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block', color: 'var(--gray-700)' }}>
                Password
              </label>
              <div className="position-relative">
                <FiLock
                  size={18}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  style={{
                    paddingLeft: '44px',
                    paddingRight: '44px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    border: formik.touched.password && formik.errors.password ? '1px solid var(--danger)' : '1px solid var(--gray-300)',
                    background: '#fff',
                    fontSize: '0.95rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--gray-500)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{formik.errors.password}</small>
              )}
            </div>

            {/* Remember Me & Forgot */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                />
                Remember Me
              </label>
              <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={formik.isSubmitting}
              style={{
                height: '50px',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {formik.isSubmitting ? (
                <>
                  <FiLoader className="spin" size={18} /> Signing in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-4" style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </p>

          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .spin { animation: spin 1s linear infinite; }
          `}</style>
        </motion.div>
      </div>
    </div>
  );
}
