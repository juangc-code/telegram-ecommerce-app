import adminApi from './adminApi';

class AdminAuthService {
  async login(userName, password) {
    const response = await adminApi.post('/auth/admin/login', { userName, password });

    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.user));

      // Store token expiration time if provided by backend
      if (response.data.expiresAt) {
        localStorage.setItem('adminTokenExpiry', response.data.expiresAt);
      }
    }

    return response;
  }

  async getCurrentUser() {
    return adminApi.get('/admin/me');
  }

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminTokenExpiry');
  }

  getStoredToken() {
    return localStorage.getItem('adminToken');
  }

  getStoredUser() {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    const token = this.getStoredToken();
    if (!token) return false;

    // Check if token is expired
    const expiry = localStorage.getItem('adminTokenExpiry');
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
    const expiry = localStorage.getItem('adminTokenExpiry');
    if (!expiry) return false;

    const now = new Date().getTime();
    const expiryTime = new Date(expiry).getTime();
    return now >= expiryTime;
  }
}

export default new AdminAuthService();
