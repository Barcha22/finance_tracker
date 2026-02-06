// Authentication service for login and signup requests

export async function loginUser(emailOrUsername: string, password: string) {
  try {
    const response = await fetch('http://localhost:3030/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailOrUsername,
        password
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();

    // Store JWT token
    if (data.jwt_token) {
      localStorage.setItem('jwt_token', data.jwt_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return { success: true, user: data.user, token: data.jwt_token };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
  }
}

export async function registerUser(username: string, email: string, password: string) {
  try {
    const response = await fetch('http://localhost:3030/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        username,
        password
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error registering:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
  }
}
