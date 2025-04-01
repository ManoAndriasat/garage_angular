import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MecanoService {
  constructor(private http: HttpClient, private authService: AuthService) { }
  private apiUrl = 'http://localhost:5000/mechanics';


  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(contact: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { contact, password });
  }

  getMechanics(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/mechanics`, { headers });
  }

  getWaitingAppointments(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`, 
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/waiting-appointments`, { headers });
  }

  getAppointments(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/appointments`, { headers });
  }

  getLastAppointments(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/history-appointments`, { headers });
  }

  validateAppointment(appointmentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/validate-appointment`, { appointmentId }, { headers });
  }

  deleteAppointment(appointmentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/delete-appointment`, { appointmentId }, { headers });
  }

  updateAppointmentStartTime(appointmentId: string, newStartTime: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/update-appointment-start-time`, { appointmentId, newStartTime }, { headers });
  }

  createRepair(repair: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/repair`, repair, { headers });
  }

  getOngoingRepairs(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/ongoing-repairs`, { headers });
  }

  addReparation(
    repairId: string, 
    type: string, 
    description: string, 
    start: string, 
    end: string, 
    material: string,
    price: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    
    const body = {
      repair_id: repairId,
      type,
      description,
      start,
      end,
      material,
      price
    };
  
    return this.http.post(`${this.apiUrl}/add-reparation`, body, { headers });
  }

  updateReparation(repairId: string, reparationIndex: number, updates: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.apiUrl}/update-reparation`, 
      { 
        repair_id: repairId, 
        reparation_index: reparationIndex, 
        updates 
      }, 
      { headers }
    );
  }

  finishAsMechanic(repairId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.post(
      `${this.apiUrl}/finish-repair`,
      { _id: repairId },
      { headers }
    );
  }
}
