import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = 'http://localhost:5000/managers';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  mechanicRegister(mechanicData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/mechanic-register`, 
      mechanicData, 
      { headers: this.getHeaders() }
    );
  }

  mechanicUpdate(mechanicId: string, updates: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/mechanics/${mechanicId}`, 
      updates, 
      { headers: this.getHeaders() }
    );
  }

  mechanicDelete(mechanicId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/mechanics/${mechanicId}`, 
      { headers: this.getHeaders() }
    );
  }

  getDashboardOverview(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/dashboard/overview`, 
      { headers: this.getHeaders() }
    );
  }

  getMechanicRevenue(params: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/analytics/mechanic-revenue`, 
      { 
        headers: this.getHeaders(),
        params 
      }
    );
  }

}