import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8091/api/auth'; 
  currentUser = signal<any>(JSON.parse(localStorage.getItem('user') || 'null'));

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        // const user = { email: credentials.email, token: res.token };
        const user = this.decodeUser(res.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  getToken() {
    return localStorage.getItem('token');
  }

   logout() {
    const token = localStorage.getItem('token');

    if (token) {
      this.http.post(`${this.apiUrl}/signout`, {}).pipe(
        catchError(err => {
          console.error("Server-side signout failed", err);
          return of(null); 
        }),
        finalize(() => {
          this.clearLocalSession();
        })
      ).subscribe();
    } else {
      this.clearLocalSession();
    }
  }

  private clearLocalSession() {
    localStorage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
  private decodeUser(token: string) {
  const decoded: any = jwtDecode(token);

  return {
    email: decoded.sub,
    name: decoded.username   
  };
}

  isLoggedIn() { return !!this.getToken(); }
}