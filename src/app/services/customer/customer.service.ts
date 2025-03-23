// login-customer.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://garage-backend-lk3y.onrender.com/users';

  constructor(private http: HttpClient, private authService: AuthService) {}


  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(contact: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { contact, password });
  }

  registerCar(car: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`, 
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/car`, car, { headers });
  }

  getAllCars(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`, 
      'Content-Type': 'application/json'
    });
  
    return this.http.get(`${this.apiUrl}/cars`, { headers });
  }  
}



