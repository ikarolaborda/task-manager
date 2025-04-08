import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthCredentials, AuthResponse } from '../models/auth.model';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (this.hasToken()) {
      this.loadUserData();
    }
  }

  signUp(credentials: AuthCredentials): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/signup`, credentials).pipe(
      catchError(error => {
        if (error.status === 409) {
          return throwError(() => new Error('Username already exists'));
        }
        return throwError(() => new Error('An error occurred during sign up'));
      })
    );
  }

  signIn(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/signin`, credentials).pipe(
      tap(response => {
        this.setToken(response.accessToken);
        this.isAuthenticatedSubject.next(true);
        this.loadUserData();
      }),
      catchError(error => {
        if (error.status === 401) {
          return throwError(() => new Error('Invalid credentials'));
        }
        return throwError(() => new Error('An error occurred during sign in'));
      })
    );
  }

  signOut(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private loadUserData(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUserSubject.next({ id: payload.sub, username: payload.username });
      } catch (e) {
        console.error('Error parsing JWT token', e);
        this.signOut();
      }
    }
  }
}
