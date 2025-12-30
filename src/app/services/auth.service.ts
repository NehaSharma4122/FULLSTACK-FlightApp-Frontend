import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, delay, finalize, Observable, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8091/api/auth'; 
  currentUser = signal<any>(JSON.parse(this.getUserFromStorage()));
  
  constructor(private http: HttpClient, private router: Router) {}
  
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);

          let user = {
            name: res.username ?? res.name,
            email: res.email ?? res.sub,
            role: res.role ?? res.userRole ?? null
            
          };
          if (!user.role) {
            const decoded = this.decodeUser(res.token);
            user.role = decoded.role;
          }
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  changePassword(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/change-password`, data, { headers });
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  getRole() {
    return this.getUser()?.role;
  }

  isAdmin() {
    return this.getRole() === 'ROLE_ADMIN';
  }

  isUser() {
    return this.getRole() === 'ROLE_USER';
  }
  getUserFromStorage() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }
  isLoggedIn() {
    return !!this.getToken();
  }

  // ---------------- LOGOUT ----------------
  logout() {
    const token = this.getToken();

    if (token) {
      this.http.post(`${this.apiUrl}/signout`, {}).pipe(
        catchError(() => of(null)),
        finalize(() => this.clearLocalSession())
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
    name: decoded.username,
    role: decoded.role ||
              decoded.roles ||
              decoded.authorities?.[0] ||
              decoded.scope ||
              null   
      };
  }
}