import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiFolder, FiMenu, FiX, FiLogOut, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../services/api';

const sidebarItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard' },
  { path: '/admin/products', icon: FiPackage, label: 'Products' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/categories', icon: FiFolder, label: 'Categories' },
];

export default function AdminCategories() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ categoryName: '', description: '' });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || res.data || []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      if (editCat) {
        await api.put(`/categories/${editCat.categoryId}`, form);
        toast.success('Category updated');
      } else {
        await api.post('/categories', form);
        toast.success('Category created');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${deleteId}`);
      toast.success('Category deleted');
      setDeleteId(null);
      fetchCategories();
    } catch { toast.error('Failed to delete category'); }
  };

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

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: '0.9rem', outline: 'none',
  };

  const categoryGradients = [
    'linear-gradient(135deg, #C8A44D, #E8D5A0)',
    'linear-gradient(135deg, #1a1a1a, #333)',
    'linear-gradient(135deg, #2c3e50, #3498db)',
    'linear-gradient(135deg, #8B4513, #D2691E)',
    'linear-gradient(135deg, #4a0e0e, #8B0000)',
    'linear-gradient(135deg, #1a472a, #2d6a4f)',
    'linear-gradient(135deg, #3c1361, #5a189a)',
    'linear-gradient(135deg, #7f4f24, #b08968)',
    'linear-gradient(135deg, #023e8a, #0077b6)',
    'linear-gradient(135deg, #6b0f1a, #b91c1c)',
  ];

  return (
    <div style={{ display: 'flex' }}>
      <div className="d-none d-lg-block"><Sidebar /></div>
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setSidebarOpen(false)} />}
      <div className="d-lg-none" style={{ position: 'fixed', left: sidebarOpen ? 0 : -260, top: 0, zIndex: 1001, transition: 'all 0.3s ease' }}><Sidebar /></div>

      <div style={{ marginLeft: 250, flex: 1, padding: '20px 30px', minHeight: '100vh', background: '#f5f5f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Categories Management</h2>
          </div>
          <button onClick={() => { setEditCat(null); setForm({ categoryName: '', description: '' }); setShowModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#C8A44D', color: '#1a1a1a', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            <FiPlus /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: '#C8A44D' }} /></div>
        ) : (
          <div className="row g-3">
            {categories.map((cat, idx) => (
              <div key={cat.categoryId} className="col-md-4 col-lg-3">
                <div style={{
                  background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #eee',
                  transition: 'all 0.3s ease', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{
                    height: 120, background: categoryGradients[idx % categoryGradients.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    fontSize: '2rem', fontWeight: 700,
                  }}>
                    {cat.categoryName?.[0]}
                  </div>
                  <div style={{ padding: 16 }}>
                    <h6 style={{ fontWeight: 600, marginBottom: 4 }}>{cat.categoryName}</h6>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 12, lineHeight: 1.4 }}>
                      {cat.description?.substring(0, 60) || 'No description'}
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setEditCat(cat); setForm({ categoryName: cat.categoryName, description: cat.description || '' }); setShowModal(true); }}
                        style={{ flex: 1, padding: '6px 0', border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <FiEdit2 size={12} /> Edit
                      </button>
                      <button onClick={() => setDeleteId(cat.categoryId)}
                        style={{ flex: 1, padding: '6px 0', border: '1px solid #dc3545', borderRadius: 6, background: '#fff', color: '#dc3545', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <FiTrash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 30, width: '90%', maxWidth: 450 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h4 style={{ fontWeight: 700 }}>{editCat ? 'Edit Category' : 'Add Category'}</h4>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}><FiX /></button>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: 4, display: 'block' }}>Category Name</label>
                <input value={form.categoryName} onChange={e => setForm({ ...form, categoryName: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: 4, display: 'block' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ ...inputStyle, minHeight: 80 }} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowModal(false)} style={{ padding: '10px 24px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} style={{ padding: '10px 24px', background: '#C8A44D', color: '#1a1a1a', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 30, width: '90%', maxWidth: 400, textAlign: 'center' }}>
              <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Delete Category</h4>
              <p style={{ color: '#666', marginBottom: 20 }}>Are you sure? Products in this category will be unassigned.</p>
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
