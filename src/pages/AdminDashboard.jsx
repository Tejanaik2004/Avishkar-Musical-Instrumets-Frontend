import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiFolder, FiMenu, FiX, FiLogOut, FiChevronRight } from 'react-icons/fi';
import api from '../services/api';

const sidebarItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard' },
  { path: '/admin/products', icon: FiPackage, label: 'Products' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/categories', icon: FiFolder, label: 'Categories' },
];

export default function AdminDashboard() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data || res.data);
    } catch (err) {
      // Fallback: fetch individual stats
      try {
        const [usersRes, ordersRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/orders'),
        ]);
        const users = usersRes.data.data || usersRes.data || [];
        const orders = ordersRes.data.data || ordersRes.data || [];
        setStats({
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalOrders: Array.isArray(orders) ? orders.length : 0,
          totalProducts: 0,
          totalRevenue: Array.isArray(orders) ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) : 0,
        });
        setRecentOrders(Array.isArray(orders) ? orders.slice(0, 10) : []);
      } catch {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const sidebar = (
    <div style={{
      width: 250, minHeight: '100vh', background: '#1a1a1a', position: 'fixed',
      left: 0, top: 0, zIndex: 1000, padding: '20px 0',
      transform: sidebarOpen ? 'translateX(0)' : undefined,
    }}>
      <div style={{ padding: '0 20px 30px', borderBottom: '1px solid #333' }}>
        <Link to="/admin" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#C8A44D', textDecoration: 'none' }}>
          E-Cart <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: 8 }}>Admin</span>
        </Link>
      </div>
      <nav style={{ marginTop: 20 }}>
        {sidebarItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px',
              color: isActive ? '#C8A44D' : '#aaa', textDecoration: 'none',
              background: isActive ? 'rgba(200,164,77,0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid #C8A44D' : '3px solid transparent',
              transition: 'all 0.3s ease', fontSize: '0.95rem',
            }}>
              <Icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ position: 'absolute', bottom: 20, width: '100%', padding: '0 20px' }}>
        <Link to="/home" style={{
          display: 'flex', alignItems: 'center', gap: 8, color: '#888',
          textDecoration: 'none', padding: '10px 0',
        }}>
          <FiLogOut size={16} /> Back to Store
        </Link>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#fff', borderRadius: 12, padding: 24,
        border: '1px solid #eee', position: 'relative', overflow: 'hidden',
      }}>
      <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, fontSize: 80 }}>
        <Icon size={80} />
      </div>
      <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: 8 }}>{title}</p>
      <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a1a1a' }}>
        {typeof value === 'number' && title.includes('Revenue') ? `$${value.toLocaleString()}` : value}
      </h3>
    </motion.div>
  );

  const statusColor = (status) => {
    const colors = { PENDING: '#ffc107', CONFIRMED: '#17a2b8', SHIPPED: '#007bff', DELIVERED: '#28a745', CANCELLED: '#dc3545', FAILED: '#6c757d' };
    return colors[status] || '#6c757d';
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Desktop sidebar */}
      <div className="d-none d-lg-block">{sidebar}</div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
          onClick={() => setSidebarOpen(false)} />
      )}
      <div className="d-lg-none" style={{
        position: 'fixed', left: sidebarOpen ? 0 : -260, top: 0, zIndex: 1001, transition: 'all 0.3s ease',
      }}>{sidebar}</div>

      {/* Main content */}
      <div style={{ marginLeft: 250, flex: 1, padding: '20px 30px', minHeight: '100vh', background: '#f5f5f5' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Dashboard</h2>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#C8A44D' }} />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={FiUsers} color="#C8A44D" />
              </div>
              <div className="col-md-3">
                <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={FiPackage} color="#28a745" />
              </div>
              <div className="col-md-3">
                <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={FiShoppingBag} color="#17a2b8" />
              </div>
              <div className="col-md-3">
                <StatCard title="Total Revenue" value={stats?.totalRevenue || 0} icon={FiGrid} color="#dc3545" />
              </div>
            </div>

            {/* Recent Orders */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #eee' }}>
              <h4 style={{ fontWeight: 600, marginBottom: 20 }}>Recent Orders</h4>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? recentOrders.map(order => (
                      <tr key={order.orderId || order.id}>
                        <td>#{order.orderId || order.id}</td>
                        <td>{order.username || 'N/A'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.totalAmount?.toFixed(2)}</td>
                        <td>
                          <span style={{
                            padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                            background: `${statusColor(order.status)}20`, color: statusColor(order.status),
                          }}>{order.status}</span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="text-center py-3">No recent orders</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
