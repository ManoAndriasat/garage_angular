// login-customer.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginCustomerService {
  private apiUrl = 'http://localhost:5000/users';

  constructor(private http: HttpClient) {}

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(contact: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { contact, password });
  }
}
