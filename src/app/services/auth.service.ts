import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthCredentials, AuthResponse, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/auth';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }
  
  signUp(credentials: AuthCredentials): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/signup`, credentials);
  }
  
  signIn(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/signin`, credentials)
      .pipe(
        tap(response => {
          console.log('Login successful, token received:', !!response.accessToken);
          this.setToken(response.accessToken);
          this.loadCurrentUser();
        })
      );
  }
  
  signOut(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }
  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    console.log('Checking authentication, token exists:', !!token);
    return !!token;
  }
  
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  private setToken(token: string): void {
    console.log('Setting token in localStorage');
    localStorage.setItem('token', token);
    console.log('Token saved, retrieving to verify:', !!localStorage.getItem('token'));
  }
  
  private checkAuthStatus(): void {
    if (this.isAuthenticated()) {
      this.loadCurrentUser();
    }
  }
  
  private loadCurrentUser(): void {
    // Extract username from token payload or use a simple approach
    const token = this.getToken();
    if (token) {
      try {
        // Simple JWT decode (only for username display)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const mockUser: User = {
          id: payload.sub || '1',
          username: payload.username || 'User'
        };
        this.currentUserSubject.next(mockUser);
      } catch (error) {
        // Fallback if token decode fails
        const mockUser: User = {
          id: '1',
          username: 'User'
        };
        this.currentUserSubject.next(mockUser);
      }
    }
  }
} 