import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { FiLock, FiEye, FiEyeOff, FiLoader, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import api from '../services/api';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const resetSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const otp = searchParams.get('otp') || '';
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { newPassword: '', confirmPassword: '' },
    validationSchema: resetSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await api.post('/auth/resetPassword', {
          email,
          otp,
          newPassword: values.newPassword,
        });
        toast.success('Password reset successful! Please login.');
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to reset password');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputBorder = (field) =>
    formik.touched[field] && formik.errors[field] ? '1px solid var(--danger)' : '1px solid var(--gray-300)';

  return (
    <div
      className="d-flex align-items-center justify-content-center p-4"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #1a1510 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, rgba(200, 164, 77, 0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#fff',
          borderRadius: 'var(--radius)',
          padding: '48px 40px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-4">
          <FiShoppingCart size={24} style={{ color: 'var(--primary)' }} />
          <span className="fw-bold" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>E-Cart</span>
        </Link>

        {/* Icon */}
        <div
          className="d-flex align-items-center justify-content-center mx-auto mb-4"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(200, 164, 77, 0.1)',
            border: '1px solid rgba(200, 164, 77, 0.2)',
          }}
        >
          <FiLock size={28} style={{ color: 'var(--primary)' }} />
        </div>

        <h3 style={{ fontWeight: '700', fontSize: '1.5rem', marginBottom: '8px', textAlign: 'center' }}>
          Reset Password
        </h3>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '32px', textAlign: 'center' }}>
          Enter your new password below.
        </p>

        <form onSubmit={formik.handleSubmit}>
          {/* New Password */}
          <div className="mb-3">
            <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block', color: 'var(--gray-700)' }}>
              New Password
            </label>
            <div className="position-relative">
              <FiLock
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                className="form-control"
                placeholder="Enter new password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
                style={{
                  paddingLeft: '44px',
                  paddingRight: '44px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  border: inputBorder('newPassword'),
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
            {formik.touched.newPassword && formik.errors.newPassword && (
              <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                {formik.errors.newPassword}
              </small>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block', color: 'var(--gray-700)' }}>
              Confirm Password
            </label>
            <div className="position-relative">
              <FiLock
                size={18}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }}
              />
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Re-enter new password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                style={{
                  paddingLeft: '44px',
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  border: inputBorder('confirmPassword'),
                  background: '#fff',
                  fontSize: '0.95rem',
                }}
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>
                {formik.errors.confirmPassword}
              </small>
            )}
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
                <FiLoader className="spin" size={18} /> Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <Link
          to="/login"
          className="d-flex align-items-center justify-content-center gap-2 mt-4 text-decoration-none"
          style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}
        >
          <FiArrowLeft size={16} /> Back to Login
        </Link>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
