import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiLoader, FiShoppingCart, FiX, FiCheck,
} from 'react-icons/fi';
import api from '../services/api';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const signupSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  username: Yup.string().min(3, 'At least 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]{10}$/, 'Must be 10 digits').required('Phone is required'),
  gender: Yup.string().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Select a gender').required('Gender is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  acceptTerms: Yup.boolean().oneOf([true], 'You must accept the terms'),
});

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
const STRENGTH_COLORS = ['', '#dc3545', '#ffc107', '#17a2b8', '#28a745', '#28a745'];

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      gender: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          name: `${values.firstName} ${values.lastName}`,
          username: values.username,
          email: values.email,
          phone: values.phone,
          gender: values.gender,
          password: values.password,
        };
        await api.post('/auth/register', payload);
        toast.success('Account created! Please verify your email.');
        setRegisteredEmail(values.email);
        setShowOtpModal(true);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const passwordStrength = getPasswordStrength(formik.values.password);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pasted.split('').concat(Array(6 - pasted.length).fill(''));
    setOtpValues(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    const next = document.getElementById(`otp-${focusIndex}`);
    if (next) next.focus();
  };

  const handleVerifyOtp = async () => {
    const otp = otpValues.join('');
    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }
    setVerifying(true);
    try {
      await api.post('/auth/verifyOtp', { email: registeredEmail, otp });
      toast.success('Email verified! Please login.');
      setShowOtpModal(false);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const inputStyle = (field) => ({
    paddingLeft: '44px',
    height: '44px',
    borderRadius: 'var(--radius-sm)',
    border: formik.touched[field] && formik.errors[field] ? '1px solid var(--danger)' : '1px solid var(--gray-300)',
    background: '#fff',
    fontSize: '0.9rem',
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
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center p-5" style={{ position: 'relative', zIndex: 1 }}>
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
            Join our community of musicians and discover instruments crafted with passion.
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
      <div className="col-12 col-lg-7 d-flex align-items-center justify-content-center p-4 py-5" style={{ background: 'var(--cream)', overflowY: 'auto' }}>
        <motion.div initial="hidden" animate="visible" variants={slideRight} style={{ width: '100%', maxWidth: '500px' }}>
          <div className="d-lg-none text-center mb-3">
            <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none">
              <FiShoppingCart size={28} style={{ color: 'var(--primary)' }} />
              <span className="fw-bold fs-4" style={{ color: 'var(--primary)' }}>E-Cart</span>
            </Link>
          </div>

          <h2 style={{ fontWeight: '700', fontSize: '1.9rem', marginBottom: '4px' }}>Create Account</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Join us and explore premium musical instruments
          </p>

          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3">
              {/* First Name */}
              <div className="col-sm-6">
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block', color: 'var(--gray-700)' }}>First Name</label>
                <div className="position-relative">
                  <FiUser size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input
                    type="text" name="firstName" placeholder="John"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.firstName}
                    style={inputStyle('firstName')}
                    className="form-control"
                  />
                </div>
                {formik.touched.firstName && formik.errors.firstName && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{formik.errors.firstName}</small>
                )}
              </div>

              {/* Last Name */}
              <div className="col-sm-6">
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block', color: 'var(--gray-700)' }}>Last Name</label>
                <div className="position-relative">
                  <FiUser size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input
                    type="text" name="lastName" placeholder="Doe"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastName}
                    style={inputStyle('lastName')}
                    className="form-control"
                  />
                </div>
                {formik.touched.lastName && formik.errors.lastName && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{formik.errors.lastName}</small>
                )}
              </div>

              {/* Username */}
              <div className="col-12">
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block', color: 'var(--gray-700)' }}>Username</label>
                <div className="position-relative">
                  <FiUser size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input
                    type="text" name="username" placeholder="johndoe"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username}
                    style={inputStyle('username')}
                    className="form-control"
                  />
                </div>
                {formik.touched.username && formik.errors.username && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{formik.errors.username}</small>
                )}
              </div>

              {/* Email */}
              <div className="col-12">
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block', color: 'var(--gray-700)' }}>Email</label>
                <div className="position-relative">
                  <FiMail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input
                    type="email" name="email" placeholder="john@example.com"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                    style={inputStyle('email')}
                    className="form-control"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{formik.errors.email}</small>
                )}
              </div>

              {/* Phone & Gender */}
              <div className="col-sm-6">
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block', color: 'var(--gray-700)' }}>Phone</label>
                <div className="position-relative">
                  <FiPhone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input
                    type="tel" name="phone" placeholder="1234567890"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone}
                    style={inputStyle('phone')}
                    className="form-control"
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{formik.errors.phone}</small>
                )}
              </div>

              <div className="col-sm-6">
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block', color: 'var(--gray-700)' }}>Gender</label>
                <select
                  name="gender"
                  className="form-select"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gender}
                  style={{
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    border: formik.touched.gender && formik.errors.gender ? '1px solid var(--danger)' : '1px solid var(--gray-300)',
                    background: '#fff',
                    fontSize: '0.9rem',
                    color: formik.values.gender ? 'var(--black)' : 'var(--gray-500)',
                  }}
                >
                  <option value="" disabled>Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{formik.errors.gender}</small>
                )}
              </div>

              {/* Password */}
              <div className="col-12">
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block', color: 'var(--gray-700)' }}>Password</label>
                <div className="position-relative">
                  <FiLock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password" placeholder="Create a strong password"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
                    style={{ ...inputStyle('password'), paddingRight: '44px' }}
                    className="form-control"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer', padding: 0 }}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{formik.errors.password}</small>
                )}

                {/* Strength Indicator */}
                {formik.values.password && (
                  <div className="mt-2">
                    <div className="d-flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            background: i <= passwordStrength ? STRENGTH_COLORS[passwordStrength] : 'var(--gray-200)',
                            transition: 'background 0.3s',
                          }}
                        />
                      ))}
                    </div>
                    <small style={{ color: STRENGTH_COLORS[passwordStrength], fontSize: '0.75rem', fontWeight: '500' }}>
                      {STRENGTH_LABELS[passwordStrength]}
                    </small>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="col-12">
                <label style={{ fontSize: '0.82rem', fontWeight: '600', marginBottom: '4px', display: 'block', color: 'var(--gray-700)' }}>Confirm Password</label>
                <div className="position-relative">
                  <FiLock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword" placeholder="Re-enter password"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword}
                    style={{ ...inputStyle('confirmPassword'), paddingRight: '44px' }}
                    className="form-control"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer', padding: 0 }}
                  >
                    {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{formik.errors.confirmPassword}</small>
                )}
              </div>

              {/* Terms */}
              <div className="col-12">
                <label className="d-flex align-items-start gap-2" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formik.values.acceptTerms}
                    onChange={formik.handleChange}
                    style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', marginTop: '2px' }}
                  />
                  <span>
                    I agree to the{' '}
                    <a href="#" style={{ color: 'var(--primary)', fontWeight: '600' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" style={{ color: 'var(--primary)', fontWeight: '600' }}>Privacy Policy</a>
                  </span>
                </label>
                {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                  <small style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{formik.errors.acceptTerms}</small>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 mt-4"
              disabled={formik.isSubmitting}
              style={{ height: '50px', fontSize: '1rem', fontWeight: '600', borderRadius: 'var(--radius-sm)' }}
            >
              {formik.isSubmitting ? (
                <><FiLoader className="spin" size={18} /> Creating Account...</>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="text-center mt-3" style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
          </p>

          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .spin { animation: spin 1s linear infinite; }
          `}</style>
        </motion.div>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius)',
                padding: '40px',
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                textAlign: 'center',
              }}
            >
              <button
                onClick={() => setShowOtpModal(false)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'none', border: 'none', color: 'var(--gray-500)', cursor: 'pointer',
                }}
              >
                <FiX size={20} />
              </button>

              <div
                className="d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'rgba(200, 164, 77, 0.1)',
                }}
              >
                <FiMail size={26} style={{ color: 'var(--primary)' }} />
              </div>

              <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Verify Your Email</h4>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '24px' }}>
                We've sent a 6-digit code to<br />
                <strong style={{ color: 'var(--black)' }}>{registeredEmail}</strong>
              </p>

              <div className="d-flex justify-content-center gap-2 mb-4" onPaste={handleOtpPaste}>
                {otpValues.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    style={{
                      width: '48px',
                      height: '56px',
                      textAlign: 'center',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      borderRadius: 'var(--radius-sm)',
                      border: val ? '1px solid var(--primary)' : '1px solid var(--gray-300)',
                      background: val ? 'rgba(200, 164, 77, 0.05)' : '#fff',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </div>

              <button
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleVerifyOtp}
                disabled={verifying}
                style={{ height: '48px', fontSize: '0.95rem', fontWeight: '600', borderRadius: 'var(--radius-sm)' }}
              >
                {verifying ? (
                  <><FiLoader className="spin" size={18} /> Verifying...</>
                ) : (
                  <><FiCheck size={18} /> Verify Email</>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
