import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginMecanoService {
  private apiUrl = 'http://localhost:5000/mechanics';

  constructor(private http: HttpClient) {}

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(contact: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { contact, password });
  }
}
