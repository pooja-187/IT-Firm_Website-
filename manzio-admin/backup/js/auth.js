const Auth = {
  credentials: { username: 'admin', password: 'admin123' },

  login(username, password) {
    if (username === this.credentials.username && password === this.credentials.password) {
      sessionStorage.setItem('manzio_auth', 'true');
      sessionStorage.setItem('manzio_user', username);
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem('manzio_auth');
    sessionStorage.removeItem('manzio_user');
  },

  isAuthenticated() {
    return sessionStorage.getItem('manzio_auth') === 'true';
  },

  getUser() {
    return sessionStorage.getItem('manzio_user') || 'Admin';
  }
};
