const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get token from localStorage
function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Helper function to make API requests
async function apiCall(endpoint: string, method: string = 'GET', body?: any) {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  // Add JWT token to requests
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    // Extract error message from backend response
    const errorMessage = data?.message || `API error: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

// AUTH endpoints
export const authAPI = {
  login: (username: string, password: string) =>
    apiCall('/auth/login', 'POST', { username, password }),
  
  register: (first_name: string, last_name: string, username: string, email: string, password: string) =>
    apiCall('/auth/register', 'POST', { first_name, last_name, username, email, password }),
  
  updateUser: (id: number, data: any) =>
    apiCall(`/auth/users/${id}`, 'PATCH', data),
  
  deleteUser: (id: number) =>
    apiCall(`/auth/users/${id}`, 'DELETE'),
};

// TRANSACTIONS endpoints
export const transactionsAPI = {
  getByUser: (user_id: number) =>
    apiCall(`/transactions/${user_id}`, 'GET'),
  
  create: (data: any) =>
    apiCall('/transactions', 'POST', data),
  
  update: (id: number, data: any) =>
    apiCall(`/transactions/${id}`, 'PATCH', data),
  
  delete: (id: number) =>
    apiCall(`/transactions/${id}`, 'DELETE'),
};

// ACCOUNTS endpoints
export const accountsAPI = {
  getByUser: (user_id: number) =>
    apiCall(`/accounts/user/${user_id}`, 'GET'),
  
  create: (data: any) =>
    apiCall('/accounts', 'POST', data),
  
  update: (id: number, data: any) =>
    apiCall(`/accounts/${id}`, 'PATCH', data),
  
  delete: (id: number) =>
    apiCall(`/accounts/${id}`, 'DELETE'),
};

// CATEGORIES endpoints
export const categoriesAPI = {
  getByUser: (user_id: number) =>
    apiCall(`/categories/user/${user_id}`, 'GET'),
  
  create: (data: any) =>
    apiCall('/categories', 'POST', data),
  
  update: (id: number, data: any) =>
    apiCall(`/categories/${id}`, 'PATCH', data),
  
  delete: (id: number) =>
    apiCall(`/categories/${id}`, 'DELETE'),
};

// PROFILE endpoints
export const profileApi = {
  // Get current user's profile
  getProfile: () =>
    apiCall('/profile', 'GET'),
  
  // Update first name
  updateFirstName: (newName: string) =>
    apiCall('/profile/first-name', 'POST', { newName }),
  
  // Update last name
  updateLastName: (newName: string) =>
    apiCall('/profile/last-name', 'POST', { newName }),
  
  // Update both first and last name
  updateProfile: (data: { first_name?: string; last_name?: string }) =>
    apiCall('/profile', 'PATCH', data),
};