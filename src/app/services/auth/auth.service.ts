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

  getToken(): string | null {
    return localStorage.getItem('token');
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

  getUserRole(): number | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.role : null;
  }

  getCustomerId(): string | null {
    const decoded = this.decodeToken();
    return decoded ? decoded.customer_id : null;
  }
}
