export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  Admin = 1,
  Manager = 2,
  Employee = 3
}