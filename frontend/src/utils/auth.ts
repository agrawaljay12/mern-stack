import type {
  LoginData,
  LoginUser,
  User,
} from "../types/auth";

const ACCESS_TOKEN_KEY = "access_token";
const AUTH_USER_KEY = "auth_user";
const GUEST_TOKEN_KEY = "guest_token";

const authHelper = {
  /* =======================================================
     ACCESS TOKEN
  ======================================================= */

  getAccessToken(): string | null {
    return localStorage.getItem(
      ACCESS_TOKEN_KEY
    );
  },

  setAccessToken(token: string): void {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      token
    );
  },

  /* =======================================================
     USER
  ======================================================= */

  getUser(): LoginUser | User | null {
    const user = localStorage.getItem(
      AUTH_USER_KEY
    );

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem(
        AUTH_USER_KEY
      );

      return null;
    }
  },

  setUser(user: LoginUser): void {
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(user)
    );
  },

  updateUser(user: User): void {
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(user)
    );
  },

  /* =======================================================
     AUTH
  ======================================================= */

  setAuth(auth: LoginData): void {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      auth.access_token
    );

    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(auth.result)
    );
  },

  isAuthenticated(): boolean {
    const token =
      localStorage.getItem(
        ACCESS_TOKEN_KEY
      );

    const user =
      localStorage.getItem(
        AUTH_USER_KEY
      );

    return Boolean(token && user);
  },

  isAdmin(): boolean {
    const user = this.getUser();

    return user?.role === "admin";
  },

  /* =======================================================
     CLEAR AUTH
  ======================================================= */

  clearAuth(): void {
    localStorage.removeItem(
      ACCESS_TOKEN_KEY
    );

    localStorage.removeItem(
      AUTH_USER_KEY
    );
  },

  /* =======================================================
     GUEST TOKEN
  ======================================================= */

  getGuestToken(): string | null {
    return localStorage.getItem(
      GUEST_TOKEN_KEY
    );
  },

  setGuestToken(token: string): void {
    localStorage.setItem(
      GUEST_TOKEN_KEY,
      token
    );
  },

  clearGuestToken(): void {
    localStorage.removeItem(
      GUEST_TOKEN_KEY
    );
  },

  /* =======================================================
     LOGOUT
  ======================================================= */

  logout(): void {
    this.clearAuth();
  },
};

export default authHelper;