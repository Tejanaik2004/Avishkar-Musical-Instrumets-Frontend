import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiFolder, FiMenu, FiX, FiLogOut, FiSearch, FiTrash2, FiEye } from 'react-icons/fi';
import api from '../services/api';

const sidebarItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard' },
  { path: '/admin/products', icon: FiPackage, label: 'Products' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/categories', icon: FiFolder, label: 'Categories' },
];

export default function AdminUsers() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewUser, setViewUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || res.data || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${deleteId}`);
      toast.success('User deleted');
      setDeleteId(null);
      fetchUsers();
    } catch { toast.error('Failed to delete user'); }
  };

  const filtered = users.filter(u => {
    if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return u.username?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
    }
    return true;
  });

  const getInitials = (u) => `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase() || u.username?.[0]?.toUpperCase() || '?';

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Users Management</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: '10px 14px 10px 40px', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.9rem', width: 220 }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['ALL', 'ACTIVE', 'INACTIVE', 'SUSPENDED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem',
              background: statusFilter === s ? '#1a1a1a' : '#fff', color: statusFilter === s ? '#fff' : '#333',
            }}>{s}</button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #eee' }}>
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border" style={{ color: '#C8A44D' }} /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.userId || u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%', background: '#C8A44D', color: '#1a1a1a',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem',
                          }}>{getInitials(u)}</div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || '-'}</td>
                      <td>
                        <span style={{
                          padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
                          background: u.role === 'ADMIN' ? '#C8A44D20' : '#17a2b820',
                          color: u.role === 'ADMIN' ? '#C8A44D' : '#17a2b8',
                        }}>{u.role}</span>
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
                          background: u.status === 'ACTIVE' ? '#28a74520' : '#dc354520',
                          color: u.status === 'ACTIVE' ? '#28a745' : '#dc3545',
                        }}>{u.status}</span>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                      <td>
                        <button onClick={() => setViewUser(u)} style={{ background: 'none', border: 'none', color: '#C8A44D', cursor: 'pointer', marginRight: 8 }}>
                          <FiEye />
                        </button>
                        {u.role !== 'ADMIN' && (
                          <button onClick={() => setDeleteId(u.userId || u.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}>
                            <FiTrash2 />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View User Modal */}
        {viewUser && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 30, width: '90%', maxWidth: 450 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h4 style={{ fontWeight: 700 }}>User Details</h4>
                <button onClick={() => setViewUser(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}><FiX /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Name', `${viewUser.firstName || ''} ${viewUser.lastName || ''}`],
                  ['Username', viewUser.username],
                  ['Email', viewUser.email],
                  ['Phone', viewUser.phone || '-'],
                  ['Gender', viewUser.gender || '-'],
                  ['Role', viewUser.role],
                  ['Status', viewUser.status],
                  ['Verified', viewUser.isVerified ? 'Yes' : 'No'],
                  ['Last Login', viewUser.lastLogin ? new Date(viewUser.lastLogin).toLocaleString() : 'Never'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>{label}</span>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 30, width: '90%', maxWidth: 400, textAlign: 'center' }}>
              <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Delete User</h4>
              <p style={{ color: '#666', marginBottom: 20 }}>Are you sure you want to delete this user?</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => setDeleteId(null)} style={{ padding: '10px 24px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleDelete} style={{ padding: '10px 24px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
