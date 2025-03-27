// auth.service.ts

import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  getId(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.id : null;
  }

  getUserRole(): number | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.role : null;
  }

  getCustomerId(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.customer_id : null;
  }
}
