import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiFolder, FiMenu, FiX, FiLogOut, FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import api from '../services/api';

const sidebarItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard' },
  { path: '/admin/products', icon: FiPackage, label: 'Products' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/categories', icon: FiFolder, label: 'Categories' },
];

export default function AdminProducts() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', categoryId: '',
    brand: '', material: '', instrumentType: '', originCountry: '', weight: '', dimensions: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?page=0&size=100');
      const data = res.data.data || res.data;
      setProducts(data?.content || data || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || res.data || []);
    } catch {}
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: '', description: '', price: '', stock: '', categoryId: '', brand: '', material: '', instrumentType: '', originCountry: '', weight: '', dimensions: '' });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name || '', description: p.description || '', price: p.price || '',
      stock: p.stock || '', categoryId: p.categoryId || '', brand: p.brand || '',
      material: p.material || '', instrumentType: p.instrumentType || '',
      originCountry: p.originCountry || '', weight: p.weight || '', dimensions: p.dimensions || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct.productId}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/products', form);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deleteId}`);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const sidebar = (
    <div style={{ width: 250, minHeight: '100vh', background: '#1a1a1a', position: 'fixed', left: 0, top: 0, zIndex: 1000, padding: '20px 0' }}>
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
            }}><Icon size={18} /> {item.label}</Link>
          );
        })}
      </nav>
      <div style={{ position: 'absolute', bottom: 20, width: '100%', padding: '0 20px' }}>
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', textDecoration: 'none', padding: '10px 0' }}>
          <FiLogOut size={16} /> Back to Store
        </Link>
      </div>
    </div>
  );

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8,
    fontSize: '0.9rem', outline: 'none', background: '#fff',
  };

  return (
    <div style={{ display: 'flex' }}>
      <div className="d-none d-lg-block">{sidebar}</div>
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setSidebarOpen(false)} />}
      <div className="d-lg-none" style={{ position: 'fixed', left: sidebarOpen ? 0 : -260, top: 0, zIndex: 1001, transition: 'all 0.3s ease' }}>{sidebar}</div>

      <div style={{ marginLeft: 250, flex: 1, padding: '20px 30px', minHeight: '100vh', background: '#f5f5f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Products Management</h2>
          </div>
          <button onClick={openAdd} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            background: '#C8A44D', color: '#1a1a1a', border: 'none', borderRadius: 8,
            fontWeight: 600, cursor: 'pointer',
          }}><FiPlus /> Add Product</button>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid #eee' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 40 }} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #eee' }}>
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border" style={{ color: '#C8A44D' }} /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.productId}>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td>{p.categoryName || 'N/A'}</td>
                      <td>${p.price?.toFixed(2)}</td>
                      <td><span style={{ color: p.stock < 10 ? '#dc3545' : '#28a745', fontWeight: 600 }}>{p.stock}</span></td>
                      <td>⭐ {p.rating?.toFixed(1) || '0.0'}</td>
                      <td>
                        <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', color: '#C8A44D', cursor: 'pointer', marginRight: 8 }}>
                          <FiEdit2 />
                        </button>
                        <button onClick={() => setDeleteId(p.productId)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}>
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: '#fff', borderRadius: 16, padding: 30, width: '90%', maxWidth: 600, maxHeight: '80vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h4 style={{ fontWeight: 700 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h4>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}><FiX /></button>
              </div>
              <div className="row g-3">
                {[
                  { key: 'name', label: 'Name', span: 12 },
                  { key: 'description', label: 'Description', span: 12, type: 'textarea' },
                  { key: 'price', label: 'Price', span: 6, type: 'number' },
                  { key: 'stock', label: 'Stock', span: 6, type: 'number' },
                  { key: 'brand', label: 'Brand', span: 6 },
                  { key: 'material', label: 'Material', span: 6 },
                  { key: 'instrumentType', label: 'Instrument Type', span: 6 },
                  { key: 'originCountry', label: 'Origin Country', span: 6 },
                  { key: 'weight', label: 'Weight', span: 6, type: 'number' },
                  { key: 'dimensions', label: 'Dimensions', span: 6 },
                ].map(field => (
                  <div key={field.key} className={`col-md-${field.span}`}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: 4, display: 'block' }}>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        style={{ ...inputStyle, minHeight: 80 }} />
                    ) : (
                      <input type={field.type || 'text'} value={form[field.key]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })} style={inputStyle} />
                    )}
                  </div>
                ))}
                <div className="col-md-6">
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: 4, display: 'block' }}>Category</label>
                  <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} style={inputStyle}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
                <button onClick={() => setShowModal(false)} style={{ padding: '10px 24px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} style={{ padding: '10px 24px', background: '#C8A44D', color: '#1a1a1a', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Save</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 30, width: '90%', maxWidth: 400, textAlign: 'center' }}>
              <h4 style={{ fontWeight: 700, marginBottom: 12 }}>Delete Product</h4>
              <p style={{ color: '#666', marginBottom: 20 }}>Are you sure? This action cannot be undone.</p>
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
