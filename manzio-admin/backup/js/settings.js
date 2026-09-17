const Settings = {
  render() {
    const container = document.getElementById('settings-content');
    container.innerHTML = `
      <div class="settings-grid">
        <div class="settings-card">
          <div class="settings-card-header">👤 Profile Settings</div>
          <div class="settings-card-body">
            <div class="form-group">
              <label>Admin Name</label>
              <input type="text" id="settings-name" value="Administrator" placeholder="Your name">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="settings-email" value="admin@manzio.com" placeholder="Your email">
            </div>
            <button class="btn-primary" onclick="Settings.saveProfile()" style="margin-top:8px">Save Changes</button>
          </div>
        </div>
        <div class="settings-card">
          <div class="settings-card-header">🔒 Change Password</div>
          <div class="settings-card-body">
            <div class="form-group">
              <label>Current Password</label>
              <input type="password" id="settings-current-pw" placeholder="Enter current password">
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" id="settings-new-pw" placeholder="Enter new password">
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input type="password" id="settings-confirm-pw" placeholder="Confirm new password">
            </div>
            <button class="btn-primary" onclick="Settings.changePassword()" style="margin-top:8px">Update Password</button>
          </div>
        </div>
        <div class="settings-card">
          <div class="settings-card-header">📊 Data Management</div>
          <div class="settings-card-body">
            <div class="settings-row">
              <div>
                <strong>Reset All Data</strong>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">Reset all dashboard data to default values</p>
              </div>
              <button class="btn-danger" onclick="Settings.resetData()">Reset Data</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  saveProfile() {
    const name = document.getElementById('settings-name').value;
    const email = document.getElementById('settings-email').value;
    if (name && email) {
      localStorage.setItem('manzio_profile', JSON.stringify({ name, email }));
      Settings.showToast('Profile updated successfully!');
    }
  },

  changePassword() {
    const current = document.getElementById('settings-current-pw').value;
    const newPw = document.getElementById('settings-new-pw').value;
    const confirm = document.getElementById('settings-confirm-pw').value;
    if (current !== 'admin123') {
      Settings.showToast('Current password is incorrect!', 'error');
      return;
    }
    if (newPw !== confirm) {
      Settings.showToast('New passwords do not match!', 'error');
      return;
    }
    if (newPw.length < 6) {
      Settings.showToast('Password must be at least 6 characters!', 'error');
      return;
    }
    Auth.credentials.password = newPw;
    Settings.showToast('Password updated successfully!');
    document.getElementById('settings-current-pw').value = '';
    document.getElementById('settings-new-pw').value = '';
    document.getElementById('settings-confirm-pw').value = '';
  },

  resetData() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('manzio_data_v2');
      DataStore.init();
      Dashboard.render();
      Settings.showToast('Data has been reset to defaults!');
    }
  },

  showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:var(--radius-sm);color:white;font-size:0.9rem;font-weight:500;z-index:9999;animation:slideUp 0.3s ease;background:${type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
  }
};
