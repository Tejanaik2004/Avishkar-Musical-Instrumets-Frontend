import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiChevronDown, FiChevronUp, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const statusColors = {
  PENDING: { bg: 'rgba(243,156,18,0.15)', color: '#f39c12' },
  CONFIRMED: { bg: 'rgba(52,152,219,0.15)', color: '#3498db' },
  PROCESSING: { bg: 'rgba(155,89,182,0.15)', color: '#9b59b6' },
  SHIPPED: { bg: 'rgba(201,168,76,0.15)', color: '#c9a84c' },
  DELIVERED: { bg: 'rgba(39,174,96,0.15)', color: '#27ae60' },
  CANCELLED: { bg: 'rgba(231,76,60,0.15)', color: '#e74c3c' },
};

const statusTabs = ['All', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
const tabLabels = { All: 'All', PENDING: 'Pending', CONFIRMED: 'Confirmed', SHIPPED: 'Shipped', DELIVERED: 'Delivered' };

const LoadingSkeleton = () => (
  <div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="mb-3 p-4" style={{ background: '#222', borderRadius: '12px' }}>
        <div className="d-flex justify-content-between">
          <div>
            <div style={{ height: '16px', width: '120px', background: '#2a2a2a', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '12px', width: '80px', background: '#2a2a2a', borderRadius: '4px' }} />
          </div>
          <div style={{ height: '30px', width: '80px', background: '#2a2a2a', borderRadius: '4px' }} />
        </div>
      </div>
    ))}
  </div>
);

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', currentPage);
      params.set('size', 10);
      if (activeTab !== 'All') params.set('status', activeTab);

      const res = await api.get(`/orders?${params.toString()}`);
      setOrders(res.data?.content || res.data || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, activeTab]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch {
      toast.error('Failed to cancel order');
    }
  };

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <style>{`
        .order-card { background: #222; border-radius: 12px; overflow: hidden; margin-bottom: 1rem; transition: all 0.3s; }
        .order-card:hover { background: #2a2a2a; }
        .order-header { padding: 1.25rem; cursor: pointer; }
        .order-details { padding: 0 1.25rem 1.25rem; border-top: 1px solid #333; }
        .tab-btn { padding: 0.5rem 1.25rem; border-radius: 50px; font-size: 0.85rem; font-weight: 500; cursor: pointer; border: 1px solid #444; background: transparent; color: #d4c9a8; transition: all 0.3s; white-space: nowrap; }
        .tab-btn.active { background: #c9a84c; color: #1a1a1a; border-color: #c9a84c; }
        .tab-btn:hover:not(.active) { border-color: #c9a84c; color: #c9a84c; }
      `}</style>

      <div className="container py-4">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" style={{ color: '#c9a84c' }}>Home</Link></li>
            <li className="breadcrumb-item active" style={{ color: '#d4c9a8' }}>My Orders</li>
          </ol>
        </nav>

        <h2 className="fw-bold mb-4" style={{ color: '#f5f0e1' }}>
          <FiPackage className="me-2" style={{ color: '#c9a84c' }} /> My Orders
        </h2>

        {/* Status Tabs */}
        <div className="d-flex gap-2 mb-4 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {statusTabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setCurrentPage(0); }}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <LoadingSkeleton />
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5">
            <FiPackage size={64} style={{ color: '#444' }} className="mb-3" />
            <h4 style={{ color: '#f5f0e1' }}>No orders found</h4>
            <p style={{ color: '#888' }}>
              {activeTab !== 'All' ? `No ${tabLabels[activeTab].toLowerCase()} orders.` : "You haven't placed any orders yet."}
            </p>
            <Link
              to="/products"
              className="btn mt-2 px-4 py-2"
              style={{ background: '#c9a84c', color: '#1a1a1a' }}
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const sc = statusColors[order.status] || statusColors.PENDING;
            const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="order-card"
              >
                <div className="order-header" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      <h6 className="mb-1 fw-semibold" style={{ color: '#f5f0e1' }}>
                        Order #{order.id}
                      </h6>
                      <small style={{ color: '#888' }}>
                        {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span
                        className="badge px-3 py-2"
                        style={{ background: sc.bg, color: sc.color, fontSize: '0.8rem' }}
                      >
                        {order.status}
                      </span>
                      <span className="fw-bold" style={{ color: '#c9a84c' }}>
                        ${order.totalAmount?.toFixed(2) || order.total?.toFixed(2) || '0.00'}
                      </span>
                      {isExpanded ? <FiChevronUp style={{ color: '#888' }} /> : <FiChevronDown style={{ color: '#888' }} />}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="order-details">
                        <h6 className="fw-semibold mb-3" style={{ color: '#d4c9a8' }}>Items</h6>
                        {(order.orderItems || order.items || []).map((item, i) => (
                          <div key={i} className="d-flex gap-3 align-items-center mb-2 pb-2" style={{ borderBottom: '1px solid #333' }}>
                            <img
                              src={item.product?.imageUrl || item.product?.images?.[0] || 'https://via.placeholder.com/50'}
                              alt=""
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                            <div className="flex-grow-1">
                              <small className="fw-semibold" style={{ color: '#f5f0e1' }}>
                                {item.product?.name || item.productName || 'Product'}
                              </small>
                              <br />
                              <small style={{ color: '#888' }}>Qty: {item.quantity}</small>
                            </div>
                            <small className="fw-bold" style={{ color: '#c9a84c' }}>
                              ${((item.price || item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </small>
                          </div>
                        ))}

                        {order.shippingAddress && (
                          <div className="mt-3">
                            <small className="fw-semibold" style={{ color: '#d4c9a8' }}>Shipping Address:</small>
                            <p className="mb-0 mt-1" style={{ color: '#888', fontSize: '0.85rem' }}>{order.shippingAddress}</p>
                          </div>
                        )}

                        {canCancel && (
                          <div className="mt-3">
                            <button
                              className="btn btn-sm d-flex align-items-center gap-1"
                              onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id); }}
                              style={{ background: 'rgba(231,76,60,0.15)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)' }}
                            >
                              <FiX size={14} /> Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              className="btn btn-sm"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={{ background: '#2a2a2a', color: '#c9a84c', border: '1px solid #444' }}
            >
              <FiChevronLeft />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className="btn btn-sm"
                onClick={() => setCurrentPage(i)}
                style={{
                  background: currentPage === i ? '#c9a84c' : '#2a2a2a',
                  color: currentPage === i ? '#1a1a1a' : '#f5f0e1',
                  border: '1px solid #444',
                  minWidth: '36px',
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{ background: '#2a2a2a', color: '#c9a84c', border: '1px solid #444' }}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
