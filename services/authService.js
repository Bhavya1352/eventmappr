// API service for authentication
class AuthService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
    this.tokenKey = 'accessToken';
    this.refreshTokenKey = 'refreshToken';
  }

  // Make API request with automatic token handling
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // If token expired, try to refresh
      if (response.status === 401 && token) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          config.headers.Authorization = `Bearer ${this.getToken()}`;
          const retryResponse = await fetch(url, config);
          return await retryResponse.json();
        }
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Register a new user
  async register(userData) {
    try {
      const response = await this.apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success && response.data) {
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        this.setUser(response.data.user);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await this.apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.data) {
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        this.setUser(response.data.user);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await this.apiRequest('/auth/me');
      
      if (response.success && response.data) {
        this.setUser(response.data.user);
      }

      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        this.setToken(data.data.accessToken);
        return true;
      }

      // If refresh failed, logout user
      this.logout();
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return false;
    }
  }

  // Logout user
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem('user');
    }
  }

  // Token management
  setTokens(accessToken, refreshToken) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  setToken(accessToken) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, accessToken);
    }
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getRefreshToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  // User management
  setUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Check if user has specific role
  hasRole(role) {
    const user = this.getUser();
    return user && user.role === role;
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
