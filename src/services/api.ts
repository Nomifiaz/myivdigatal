const API_BASE_URL = 'http://localhost:5010/api/v1'.trim();
const BASE_DOMAIN = 'http://localhost:5010';

export const authService = {
  getLogoUrl(path: string | null) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_DOMAIN}/${path}`;
  },

  getToken() {
    return localStorage.getItem('auth_token');
  },

  getHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  },

  async login(credentials: any) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(userData: any) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async forgotPassword(email: string) {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send reset code');
    return data;
  },

  async resetPassword(payload: any) {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Password reset failed');
    return data;
  },

  // Business APIs
  async getBusiness() {
    const response = await fetch(`${API_BASE_URL}/businesses`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      const error: any = new Error(data.message || 'Failed to fetch business');
      error.status = response.status;
      throw error;
    }
    return data;
  },

  async registerBusiness(businessData: FormData) {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/businesses`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: businessData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to register business');
    return data;
  },

  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  logout() {
    localStorage.removeItem('auth_token');
  }
};

export const productService = {
  async addProduct(product: any) {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: authService.getHeaders(),
      body: JSON.stringify(product),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add product');
    return data;
  },

  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/getProduct`, {
      method: 'GET',
      headers: authService.getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
    return data;
  },

  async updateProduct(id: number, updates: any) {
    const response = await fetch(`${API_BASE_URL}/updateProducts?id=${id}`, {
      method: 'PATCH',
      headers: authService.getHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  },

  async deleteProduct(id: number) {
    const response = await fetch(`${API_BASE_URL}/deleteProdcts?id=${id}`, {
      method: 'DELETE',
      headers: authService.getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete product');
    return data;
  }
};
