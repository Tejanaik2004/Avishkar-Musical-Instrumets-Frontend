import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiCheck, FiCreditCard, FiMapPin, FiPackage, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const steps = [
  { label: 'Shipping', icon: FiMapPin },
  { label: 'Payment', icon: FiCreditCard },
  { label: 'Review', icon: FiPackage },
];

const shippingValidation = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string().required('Pincode is required').matches(/^\d{6}$/, 'Must be 6 digits'),
  phone: Yup.string().required('Phone is required').matches(/^\d{10}$/, 'Must be 10 digits'),
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
    },
    validationSchema: shippingValidation,
    onSubmit: (values) => {
      setShippingAddress(values);
      setCurrentStep(1);
    },
  });

  const paymentMethods = [
    { id: 'CREDIT_CARD', label: 'Credit Card' },
    { id: 'DEBIT_CARD', label: 'Debit Card' },
    { id: 'UPI', label: 'UPI' },
    { id: 'COD', label: 'Cash on Delivery' },
  ];

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discountedPrice || item.product?.price || item.price || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const gst = subtotal * 0.18;
  const deliveryCharge = subtotal > 100 ? 0 : 10;
  const grandTotal = subtotal + gst + deliveryCharge;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderData = {
        address: `${shippingAddress.fullName}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}, Phone: ${shippingAddress.phone}`,
        paymentMethod,
      };
      const res = await api.post('/orders/place', orderData);
      toast.success('Order placed successfully!');
      navigate('/order-success', { state: { orderId: res.data?.orderId || res.data?.id } });
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
        <div className="container py-5 text-center">
          <h3 style={{ color: '#f5f0e1' }}>Your cart is empty</h3>
          <p style={{ color: '#888' }}>Add items to your cart before checking out.</p>
          <Link to="/products" className="btn mt-3 px-4 py-2" style={{ background: '#c9a84c', color: '#1a1a1a' }}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <style>{`
        .step-indicator { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 2.5rem; }
        .step { display: flex; align-items: center; gap: 8px; }
        .step-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; transition: all 0.3s; }
        .step-line { width: 80px; height: 2px; background: #444; transition: background 0.3s; }
        .step-line.active { background: #c9a84c; }
        .form-label-custom { color: #d4c9a8; font-weight: 500; margin-bottom: 0.4rem; }
        .form-control-custom { background: #2a2a2a; color: #f5f0e1; border: 1px solid #444; border-radius: 8px; padding: 0.7rem 1rem; }
        .form-control-custom:focus { border-color: #c9a84c; box-shadow: 0 0 0 0.2rem rgba(201,168,76,0.15); }
        .form-control-custom.is-invalid { border-color: #e74c3c; }
        .payment-option { background: #222; border: 2px solid #444; border-radius: 12px; padding: 1rem 1.25rem; cursor: pointer; transition: all 0.3s; }
        .payment-option:hover { border-color: #666; }
        .payment-option.selected { border-color: #c9a84c; background: rgba(201,168,76,0.08); }
        .review-section { background: #222; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
      `}</style>

      <div className="container py-4">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" style={{ color: '#c9a84c' }}>Home</Link></li>
            <li className="breadcrumb-item"><Link to="/cart" style={{ color: '#c9a84c' }}>Cart</Link></li>
            <li className="breadcrumb-item active" style={{ color: '#d4c9a8' }}>Checkout</li>
          </ol>
        </nav>

        {/* Step Indicator */}
        <div className="step-indicator">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = i <= currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={i} className="d-flex align-items-center">
                <div className="step">
                  <div
                    className="step-circle"
                    style={{
                      background: isActive ? '#c9a84c' : '#333',
                      color: isActive ? '#1a1a1a' : '#888',
                      border: isCurrent ? '3px solid #c9a84c' : '2px solid #444',
                    }}
                  >
                    {i < currentStep ? <FiCheck size={18} /> : <StepIcon size={18} />}
                  </div>
                  <span className="d-none d-md-inline" style={{ color: isActive ? '#f5f0e1' : '#888', fontWeight: isCurrent ? 600 : 400, fontSize: '0.9rem' }}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`step-line ${i < currentStep ? 'active' : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Shipping */}
              {currentStep === 0 && (
                <div className="p-4" style={{ background: '#222', borderRadius: '12px' }}>
                  <h4 className="fw-bold mb-4" style={{ color: '#f5f0e1' }}>
                    <FiMapPin className="me-2" style={{ color: '#c9a84c' }} /> Shipping Address
                  </h4>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row g-3">
                      {[
                        { name: 'fullName', label: 'Full Name', col: 12 },
                        { name: 'address', label: 'Address', col: 12, type: 'textarea' },
                        { name: 'city', label: 'City', col: 'md-6' },
                        { name: 'state', label: 'State', col: 'md-6' },
                        { name: 'pincode', label: 'Pincode', col: 'md-6', placeholder: '6-digit pincode' },
                        { name: 'phone', label: 'Phone', col: 'md-6', placeholder: '10-digit number' },
                      ].map((field) => (
                        <div key={field.name} className={`col-12 ${field.col === 'md-6' ? 'col-md-6' : ''}`}>
                          <label className="form-label-custom">{field.label}</label>
                          {field.type === 'textarea' ? (
                            <textarea
                              name={field.name}
                              className={`form-control form-control-custom ${formik.touched[field.name] && formik.errors[field.name] ? 'is-invalid' : ''}`}
                              rows="3"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values[field.name]}
                            />
                          ) : (
                            <input
                              type="text"
                              name={field.name}
                              className={`form-control form-control-custom ${formik.touched[field.name] && formik.errors[field.name] ? 'is-invalid' : ''}`}
                              placeholder={field.placeholder || ''}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values[field.name]}
                            />
                          )}
                          {formik.touched[field.name] && formik.errors[field.name] && (
                            <small className="text-danger">{formik.errors[field.name]}</small>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                      <button type="submit" className="btn px-4 py-2 fw-semibold" style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '8px' }}>
                        Continue to Payment <FiArrowRight className="ms-2" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 1 && (
                <div className="p-4" style={{ background: '#222', borderRadius: '12px' }}>
                  <h4 className="fw-bold mb-4" style={{ color: '#f5f0e1' }}>
                    <FiCreditCard className="me-2" style={{ color: '#c9a84c' }} /> Payment Method
                  </h4>
                  <div className="row g-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="col-md-6">
                        <div
                          className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: `2px solid ${paymentMethod === method.id ? '#c9a84c' : '#666'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {paymentMethod === method.id && (
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#c9a84c' }} />
                              )}
                            </div>
                            <span style={{ color: '#f5f0e1', fontWeight: 500 }}>{method.label}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      className="btn px-4 py-2"
                      onClick={() => setCurrentStep(0)}
                      style={{ background: 'transparent', color: '#c9a84c', border: '1px solid #c9a84c', borderRadius: '8px' }}
                    >
                      <FiArrowLeft className="me-2" /> Back
                    </button>
                    <button
                      className="btn px-4 py-2 fw-semibold"
                      onClick={() => {
                        if (!paymentMethod) { toast.error('Please select a payment method'); return; }
                        setCurrentStep(2);
                      }}
                      style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '8px' }}
                    >
                      Review Order <FiArrowRight className="ms-2" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 2 && (
                <div>
                  <div className="review-section">
                    <h4 className="fw-bold mb-3" style={{ color: '#f5f0e1' }}>
                      <FiPackage className="me-2" style={{ color: '#c9a84c' }} /> Order Summary
                    </h4>
                    {cartItems.map((item) => {
                      const price = item.product?.discountedPrice || item.product?.price || item.price || 0;
                      return (
                        <div key={item.id} className="d-flex gap-3 align-items-center mb-3 pb-3" style={{ borderBottom: '1px solid #333' }}>
                          <img
                            src={item.product?.imageUrl || item.product?.images?.[0] || 'https://via.placeholder.com/60'}
                            alt=""
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div className="flex-grow-1">
                            <h6 className="mb-0" style={{ color: '#f5f0e1' }}>{item.product?.name || 'Product'}</h6>
                            <small style={{ color: '#888' }}>Qty: {item.quantity || 1}</small>
                          </div>
                          <span className="fw-bold" style={{ color: '#c9a84c' }}>
                            ${(price * (item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="review-section">
                    <h5 className="fw-bold mb-3" style={{ color: '#f5f0e1' }}>Shipping Address</h5>
                    <p style={{ color: '#d4c9a8', marginBottom: 0 }}>
                      {shippingAddress?.fullName}<br />
                      {shippingAddress?.address}<br />
                      {shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.pincode}<br />
                      Phone: {shippingAddress?.phone}
                    </p>
                  </div>

                  <div className="review-section">
                    <h5 className="fw-bold mb-3" style={{ color: '#f5f0e1' }}>Payment Method</h5>
                    <p style={{ color: '#d4c9a8', marginBottom: 0 }}>
                      {paymentMethods.find((m) => m.id === paymentMethod)?.label}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      className="btn px-4 py-2"
                      onClick={() => setCurrentStep(1)}
                      style={{ background: 'transparent', color: '#c9a84c', border: '1px solid #c9a84c', borderRadius: '8px' }}
                    >
                      <FiArrowLeft className="me-2" /> Back
                    </button>
                    <button
                      className="btn px-5 py-3 fw-bold"
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      style={{ background: '#c9a84c', color: '#1a1a1a', borderRadius: '12px', fontSize: '1.05rem' }}
                    >
                      {placing ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <div style={{ background: '#222', borderRadius: '12px', padding: '1.5rem', position: 'sticky', top: '100px' }}>
              <h5 className="fw-bold mb-3" style={{ color: '#f5f0e1' }}>Order Total</h5>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#d4c9a8' }}>Subtotal</span>
                <span style={{ color: '#f5f0e1' }}>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: '#d4c9a8' }}>GST (18%)</span>
                <span style={{ color: '#f5f0e1' }}>${gst.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span style={{ color: '#d4c9a8' }}>Delivery</span>
                <span style={{ color: deliveryCharge === 0 ? '#27ae60' : '#f5f0e1' }}>
                  {deliveryCharge === 0 ? 'FREE' : `$${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <hr style={{ borderColor: '#444' }} />
              <div className="d-flex justify-content-between">
                <strong style={{ color: '#f5f0e1', fontSize: '1.1rem' }}>Total</strong>
                <strong style={{ color: '#c9a84c', fontSize: '1.3rem' }}>${grandTotal.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
