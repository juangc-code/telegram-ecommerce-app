import api from './api';

class AuthService {
  async login(loginRequest) {
    console.log('Login request: ' + loginRequest)
    const data = await api.post('/auth/web/login', loginRequest);

    console.log('Response: ' + JSON.stringify(data));

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  }

  async getCurrentUser() {
    return api.get('/auth/me');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getStoredToken() {
    return localStorage.getItem('token') ;
  }

  getStoredTma() {
    return localStorage.getItem('tma');
  }

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getStoredToken() || !!this.getStoredTma();
  }
}

export default new AuthService();
