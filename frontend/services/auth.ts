const TOKEN_KEY = 'access_token';
const USER_EMAIL_KEY = 'email';
const USER_ID_KEY = 'userId';

export const AuthService = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Retrieve token from localStorage
    console.debug('Retrieving auth token from localStorage');
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): { email: string; userId: number } | null {
    if (typeof window === 'undefined') return null;

    const email = localStorage.getItem(USER_EMAIL_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);

    if (!email || !userId) return null;

    return {
      email,
      userId: parseInt(userId, 10),
    };
  },

  setUser(user: { email: string; userId: number }) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_EMAIL_KEY, user.email);
      localStorage.setItem(USER_ID_KEY, user.userId.toString());
    }
  },

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_EMAIL_KEY);
      localStorage.removeItem(USER_ID_KEY);
    }
  },

  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  logout(redirectUrl = '/') {
    this.clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  },
};
