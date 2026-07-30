import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiFolder, FiMenu, FiX, FiLogOut, FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../services/api';

const sidebarItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard' },
  { path: '/admin/products', icon: FiPackage, label: 'Products' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/categories', icon: FiFolder, label: 'Categories' },
];

const statusColors = {
  PENDING: '#ffc107', CONFIRMED: '#17a2b8', SHIPPED: '#007bff',
  DELIVERED: '#28a745', CANCELLED: '#dc3545', FAILED: '#6c757d',
};

const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data.data || res.data || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${newStatus}`);
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = orders.filter(o => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (searchTerm && !String(o.orderId || o.id).includes(searchTerm)) return false;
    return true;
  });

  const Sidebar = () => (
    <div style={{ width: 250, minHeight: '100vh', background: '#1a1a1a', position: 'fixed', left: 0, top: 0, zIndex: 1000, padding: '20px 0' }}>
      <div style={{ padding: '0 20px 30px', borderBottom: '1px solid #333' }}>
        <Link to="/admin" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#C8A44D', textDecoration: 'none' }}>
          E-Cart <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: 8 }}>Admin</span>
        </Link>
      </div>
      <nav style={{ marginTop: 20 }}>
        {sidebarItems.map(item => (
          <Link key={item.path} to={item.path} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px',
            color: location.pathname === item.path ? '#C8A44D' : '#aaa', textDecoration: 'none',
            background: location.pathname === item.path ? 'rgba(200,164,77,0.1)' : 'transparent',
            borderLeft: location.pathname === item.path ? '3px solid #C8A44D' : '3px solid transparent',
          }}><item.icon size={18} /> {item.label}</Link>
        ))}
      </nav>
      <div style={{ position: 'absolute', bottom: 20, width: '100%', padding: '0 20px' }}>
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', textDecoration: 'none', padding: '10px 0' }}>
          <FiLogOut size={16} /> Back to Store
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <div className="d-none d-lg-block"><Sidebar /></div>
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setSidebarOpen(false)} />}
      <div className="d-lg-none" style={{ position: 'fixed', left: sidebarOpen ? 0 : -260, top: 0, zIndex: 1001, transition: 'all 0.3s ease' }}><Sidebar /></div>

      <div style={{ marginLeft: 250, flex: 1, padding: '20px 30px', minHeight: '100vh', background: '#f5f5f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Orders Management</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input placeholder="Search order ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: '10px 14px 10px 40px', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.9rem', width: 200 }} />
          </div>
        </div>

        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem',
                background: statusFilter === s ? (s === 'ALL' ? '#1a1a1a' : statusColors[s]) : '#fff',
                color: statusFilter === s ? '#fff' : '#333',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>{s} {s !== 'ALL' && `(${orders.filter(o => o.status === s).length})`}</button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #eee' }}>
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border" style={{ color: '#C8A44D' }} /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr><th></th><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(order => {
                    const id = order.orderId || order.id;
                    const isExpanded = expandedOrder === id;
                    return (
                      <>
                        <tr key={id}>
                          <td style={{ cursor: 'pointer' }} onClick={() => setExpandedOrder(isExpanded ? null : id)}>
                            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                          </td>
                          <td style={{ fontWeight: 600 }}>#{id}</td>
                          <td>{order.username || 'N/A'}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td style={{ fontWeight: 600 }}>${order.totalAmount?.toFixed(2)}</td>
                          <td>
                            <select value={order.status} onChange={e => updateStatus(id, e.target.value)}
                              style={{
                                padding: '4px 8px', borderRadius: 6, border: `2px solid ${statusColors[order.status]}`,
                                fontSize: '0.8rem', fontWeight: 600, color: statusColors[order.status], background: 'transparent',
                              }}>
                              {statuses.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td>
                            <button onClick={() => setExpandedOrder(isExpanded ? null : id)}
                              style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem' }}>
                              View
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${id}-details`}>
                            <td colSpan={7} style={{ background: '#f9f9f9', padding: 16 }}>
                              <strong>Order Items:</strong>
                              {order.items?.length > 0 ? (
                                <table className="table table-sm mt-2">
                                  <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                                  <tbody>
                                    {order.items.map((item, idx) => (
                                      <tr key={idx}>
                                        <td>{item.productName || `Product #${item.productId}`}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.pricePerUnit?.toFixed(2)}</td>
                                        <td>${item.totalPrice?.toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : <p className="mt-2 text-muted">No item details available</p>}
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-4 text-muted">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
