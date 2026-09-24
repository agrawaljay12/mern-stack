import type { LoginData, User } from "../types/auth";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";
const GUEST_TOKEN_KEY = "guest_token";

const authHelper = {
  setAuth(auth: LoginData): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, auth.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, auth.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  },

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUser(): User | null {
    const user = localStorage.getItem(USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  },

  clearAuth(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getGuestToken(): string | null {
    return localStorage.getItem(GUEST_TOKEN_KEY);
  },

  setGuestToken(token: string): void {
    localStorage.setItem(GUEST_TOKEN_KEY, token);
  },

  clearGuestToken(): void {
    localStorage.removeItem(GUEST_TOKEN_KEY);
  },
};

export default authHelper;