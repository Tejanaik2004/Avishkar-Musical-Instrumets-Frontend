import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiEdit2 } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, loadUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      await api.put('/user/profile', profile);
      toast.success('Profile updated successfully');
      loadUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.put('/user/profile', { password: passwords.newPassword });
      toast.success('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8,
    fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s',
  };

  const getInitials = () => `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?';

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 60, background: 'var(--cream)' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a, #3D2B1F)', borderRadius: 16,
            padding: 40, marginBottom: 30, color: '#fff', display: 'flex', alignItems: 'center', gap: 24,
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: '#C8A44D', color: '#1a1a1a',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700,
            }}>{getInitials()}</div>
            <div>
              <h3 style={{ fontWeight: 700, margin: 0 }}>{user?.firstName} {user?.lastName}</h3>
              <p style={{ margin: 0, color: '#aaa', fontSize: '0.95rem' }}>@{user?.username}</p>
              <p style={{ margin: '4px 0 0', color: '#C8A44D', fontSize: '0.85rem' }}>
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
            {[
              { key: 'profile', label: 'Profile', icon: FiUser },
              { key: 'settings', label: 'Settings', icon: FiLock },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                border: 'none', borderRadius: activeTab === tab.key ? '12px 12px 0 0' : 8,
                background: activeTab === tab.key ? 'var(--white)' : 'transparent',
                color: activeTab === tab.key ? '#C8A44D' : 'var(--gray-600)',
                fontWeight: activeTab === tab.key ? 600 : 400, cursor: 'pointer',
                borderBottom: activeTab === tab.key ? '3px solid #C8A44D' : 'none',
              }}><tab.icon size={16} /> {tab.label}</button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ background: 'var(--white)', borderRadius: 16, padding: 32, border: '1px solid var(--gray-200)' }}>
            {activeTab === 'profile' && (
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 24 }}>Edit Profile</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                      <FiUser size={14} style={{ marginRight: 6 }} /> First Name
                    </label>
                    <input value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div className="col-md-6">
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Last Name</label>
                    <input value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div className="col-md-6">
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                      <FiMail size={14} style={{ marginRight: 6 }} /> Email
                    </label>
                    <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div className="col-md-6">
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                      <FiPhone size={14} style={{ marginRight: 6 }} /> Phone
                    </label>
                    <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div className="col-md-6">
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Gender</label>
                    <select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleProfileUpdate} disabled={loading}
                  style={{
                    marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 32px',
                    background: '#C8A44D', color: '#1a1a1a', border: 'none', borderRadius: 8,
                    fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem',
                  }}>
                  {loading ? <div className="spinner-border spinner-border-sm" /> : <><FiSave /> Save Changes</>}
                </button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 24 }}>Change Password</h4>
                <div style={{ maxWidth: 450, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>New Password</label>
                    <input type="password" value={passwords.newPassword}
                      onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 6 }}>Confirm New Password</label>
                    <input type="password" value={passwords.confirmPassword}
                      onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      style={inputStyle} />
                  </div>
                  <button onClick={handlePasswordChange} disabled={loading}
                    style={{
                      alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '12px 32px', background: '#C8A44D', color: '#1a1a1a', border: 'none',
                      borderRadius: 8, fontWeight: 600, cursor: 'pointer',
                    }}>
                    {loading ? <div className="spinner-border spinner-border-sm" /> : <><FiLock /> Change Password</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
