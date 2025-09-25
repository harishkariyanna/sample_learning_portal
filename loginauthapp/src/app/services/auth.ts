import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ConfirmOtpDto {
  email: string;
  otpCode: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  otpCode: string;
  newPassword: string;
}

export interface AuthResponse {
  token?: string;
  name?: string;
  email?: string;
  role?: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7194/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next({
        token,
        ...JSON.parse(user)
      });
    }
  }

  register(request: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  confirmOtp(request: ConfirmOtpDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/confirm`, request);
  }

  login(request: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify({
            name: response.name,
            email: response.email,
            role: response.role
          }));
          this.currentUserSubject.next({
            token: response.token,
            name: response.name,
            email: response.email,
            role: response.role
          });
        }
      }));
  }

  forgotPassword(request: ForgotPasswordDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/forgot`, request);
  }

  resetPassword(request: ResetPasswordDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/reset-password`, request);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
