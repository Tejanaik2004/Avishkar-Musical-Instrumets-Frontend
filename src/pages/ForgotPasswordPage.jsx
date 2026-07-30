import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader, FiArrowLeft, FiCheck, FiShoppingCart } from 'react-icons/fi';
import api from '../services/api';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const emailSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const otpSchema = Yup.object({
  otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
});

const resetSchema = Yup.object({
  newPassword: Yup.string().min(6, 'At least 6 characters').required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailForm = useFormik({
    initialValues: { email: '' },
    validationSchema: emailSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await api.post('/auth/forgotPassword', { email: values.email });
        setEmail(values.email);
        toast.success('OTP sent to your email!');
        setStep(2);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send OTP');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const otpForm = useFormik({
    initialValues: { otp: '' },
    validationSchema: otpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await api.post('/auth/verifyOtp', { email, otp: values.otp });
        setOtp(values.otp);
        toast.success('OTP verified!');
        setStep(3);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Invalid OTP');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const resetForm = useFormik({
    initialValues: { newPassword: '', confirmPassword: '' },
    validationSchema: resetSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await api.post('/auth/resetPassword', {
          email,
          otp,
          newPassword: values.newPassword,
        });
        toast.success('Password reset successful!');
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to reset password');
      } finally {
        setSubmitting(false);
      }
    },
  });

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

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <h3 style={{ fontWeight: '700', fontSize: '1.5rem', marginBottom: '8px' }}>Forgot Password</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '28px' }}>
              Enter your email to receive an OTP for password reset.
            </p>

            <form onSubmit={emailForm.handleSubmit}>
              <div className="mb-4">
                <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block', color: 'var(--gray-700)' }}>
                  Email Address
                </label>
                <div className="position-relative">
                  <FiMail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    onChange={emailForm.handleChange}
                    onBlur={emailForm.handleBlur}
                    value={emailForm.values.email}
                    style={{
                      paddingLeft: '44px',
                      height: '48px',
                      borderRadius: 'var(--radius-sm)',
                      border: emailForm.touched.email && emailForm.errors.email ? '1px solid var(--danger)' : '1px solid var(--gray-300)',
                      background: '#fff',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
                {emailForm.touched.email && emailForm.errors.email && (
                  <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{emailForm.errors.email}</small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={emailForm.isSubmitting}
                style={{ height: '48px', fontSize: '0.95rem', fontWeight: '600', borderRadius: 'var(--radius-sm)' }}
              >
                {emailForm.isSubmitting ? (
                  <><FiLoader className="spin" size={18} /> Sending OTP...</>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          </>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <>
            <h3 style={{ fontWeight: '700', fontSize: '1.5rem', marginBottom: '8px' }}>Enter OTP</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '28px' }}>
              We've sent a 6-digit code to{' '}
              <strong style={{ color: 'var(--black)' }}>{email}</strong>
            </p>

            <form onSubmit={otpForm.handleSubmit}>
              <div className="mb-4">
                <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block', color: 'var(--gray-700)' }}>
                  Verification Code
                </label>
                <input
                  type="text"
                  name="otp"
                  className="form-control"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  onChange={otpForm.handleChange}
                  onBlur={otpForm.handleBlur}
                  value={otpForm.values.otp}
                  style={{
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    border: otpForm.touched.otp && otpForm.errors.otp ? '1px solid var(--danger)' : '1px solid var(--gray-300)',
                    background: '#fff',
                    fontSize: '1.2rem',
                    letterSpacing: '8px',
                    textAlign: 'center',
                    fontWeight: '700',
                  }}
                />
                {otpForm.touched.otp && otpForm.errors.otp && (
                  <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{otpForm.errors.otp}</small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={otpForm.isSubmitting}
                style={{ height: '48px', fontSize: '0.95rem', fontWeight: '600', borderRadius: 'var(--radius-sm)' }}
              >
                {otpForm.isSubmitting ? (
                  <><FiLoader className="spin" size={18} /> Verifying...</>
                ) : (
                  <><FiCheck size={18} /> Verify OTP</>
                )}
              </button>

              <button
                type="button"
                className="btn w-100 mt-3"
                onClick={() => setStep(1)}
                style={{
                  color: 'var(--gray-600)',
                  fontSize: '0.9rem',
                  background: 'none',
                  border: '1px solid var(--gray-300)',
                  height: '44px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                Change Email
              </button>
            </form>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <h3 style={{ fontWeight: '700', fontSize: '1.5rem', marginBottom: '8px' }}>Reset Password</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '28px' }}>
              Create a new password for your account.
            </p>

            <form onSubmit={resetForm.handleSubmit}>
              <div className="mb-3">
                <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block', color: 'var(--gray-700)' }}>
                  New Password
                </label>
                <div className="position-relative">
                  <FiLock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    className="form-control"
                    placeholder="Enter new password"
                    onChange={resetForm.handleChange}
                    onBlur={resetForm.handleBlur}
                    value={resetForm.values.newPassword}
                    style={{
                      paddingLeft: '44px',
                      paddingRight: '44px',
                      height: '48px',
                      borderRadius: 'var(--radius-sm)',
                      border: resetForm.touched.newPassword && resetForm.errors.newPassword ? '1px solid var(--danger)' : '1px solid var(--gray-300)',
                      background: '#fff',
                      fontSize: '0.95rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer', padding: 0 }}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {resetForm.touched.newPassword && resetForm.errors.newPassword && (
                  <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{resetForm.errors.newPassword}</small>
                )}
              </div>

              <div className="mb-4">
                <label style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', display: 'block', color: 'var(--gray-700)' }}>
                  Confirm Password
                </label>
                <div className="position-relative">
                  <FiLock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Re-enter new password"
                    onChange={resetForm.handleChange}
                    onBlur={resetForm.handleBlur}
                    value={resetForm.values.confirmPassword}
                    style={{
                      paddingLeft: '44px',
                      height: '48px',
                      borderRadius: 'var(--radius-sm)',
                      border: resetForm.touched.confirmPassword && resetForm.errors.confirmPassword ? '1px solid var(--danger)' : '1px solid var(--gray-300)',
                      background: '#fff',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
                {resetForm.touched.confirmPassword && resetForm.errors.confirmPassword && (
                  <small style={{ color: 'var(--danger)', marginTop: '4px', display: 'block' }}>{resetForm.errors.confirmPassword}</small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={resetForm.isSubmitting}
                style={{ height: '48px', fontSize: '0.95rem', fontWeight: '600', borderRadius: 'var(--radius-sm)' }}
              >
                {resetForm.isSubmitting ? (
                  <><FiLoader className="spin" size={18} /> Resetting...</>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </>
        )}

        {/* Back to Login */}
        <Link
          to="/login"
          className="d-flex align-items-center justify-content-center gap-2 mt-4 text-decoration-none"
          style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}
        >
          <FiArrowLeft size={16} /> Back to Login
        </Link>

        {/* Step indicator */}
        <div className="d-flex justify-content-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: s <= step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: s <= step ? 'var(--primary)' : 'var(--gray-200)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}
