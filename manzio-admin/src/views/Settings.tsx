import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface SettingsProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const Settings: React.FC<SettingsProps> = ({ showToast }) => {
  const { resetAllData } = useData();

  // Profile forms
  const [adminName, setAdminName] = useState(() => {
    const saved = localStorage.getItem('manzio_react_profile');
    return saved ? JSON.parse(saved).name : 'Administrator';
  });
  const [adminEmail, setAdminEmail] = useState(() => {
    const saved = localStorage.getItem('manzio_react_profile');
    return saved ? JSON.parse(saved).email : 'admin@manzio.com';
  });

  // Password forms
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim()) {
      showToast('Name and Email are required', 'error');
      return;
    }
    localStorage.setItem('manzio_react_profile', JSON.stringify({ name: adminName, email: adminEmail }));
    showToast('Profile settings saved successfully!');
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPw !== 'admin123') {
      showToast('Current password is incorrect', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPw.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    showToast('Password updated successfully!');
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  const handleResetData = async () => {
    if (window.confirm('Are you sure you want to reset all data? This will restore initial mockup values.')) {
      try {
        await resetAllData();
        showToast('Dashboard data reset to defaults!');
      } catch (err: any) {
        showToast(err.message || 'Failed to reset data', 'error');
      }
    }
  };

  return (
    <div className="settings-grid">
      {/* Profile Card */}
      <div className="settings-card">
        <div className="settings-card-header">👤 Profile Settings</div>
        <form onSubmit={handleProfileSave}>
          <div className="settings-card-body">
            <div className="form-group">
              <label>Admin Name</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Administrator"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@manzio.com"
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Save Changes</button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="settings-card">
        <div className="settings-card-header">🔒 Change Password</div>
        <form onSubmit={handlePasswordSave}>
          <div className="settings-card-body">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Update Password</button>
          </div>
        </form>
      </div>

      {/* Data Management Card */}
      <div className="settings-card">
        <div className="settings-card-header">📊 Data Management</div>
        <div className="settings-card-body">
          <div className="settings-row">
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Reset All Data</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Reset all dashboard data to default values
              </p>
            </div>
            <button type="button" className="btn-danger" onClick={handleResetData}>Reset Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
