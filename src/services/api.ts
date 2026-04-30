const API_BASE_URL = 'https://7277-182-180-130-107.ngrok-free.app/api/v1'.trim();

export const authService = {
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
