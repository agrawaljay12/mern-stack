export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}