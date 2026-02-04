import adminApi from './adminApi';

class AdminAuthService {
  async login(userName, password) {
    const response = await adminApi.post('/auth/admin/login', { userName, password });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Store token expiration time if provided by backend
      if (response.data.expiresAt) {
        localStorage.setItem('tokenExpiry', response.data.expiresAt);
      }
    }

    return response;
  }

  async getCurrentUser() {
    return adminApi.get('/admin/me');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  }

  getStoredToken() {
    return localStorage.getItem('token');
  }

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    const token = this.getStoredToken();
    if (!token) return false;

    // Check if token is expired
    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry) {
      const now = new Date().getTime();
      const expiryTime = new Date(expiry).getTime();
      if (now >= expiryTime) {
        this.logout();
        return false;
      }
    }

    return true;
  }

  isTokenExpired() {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return false;

    const now = new Date().getTime();
    const expiryTime = new Date(expiry).getTime();
    return now >= expiryTime;
  }
}

export default new AdminAuthService();
