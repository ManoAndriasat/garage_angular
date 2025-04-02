// login-customer.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://mygarage-fujn.onrender.com/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(contact: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { contact, password });
  }

  registerCar(car: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/car`, car, { headers });
  }

  deleteExistingCarModel(id: string, model: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/existing-cars/${id}/model`, 
      { 
        headers: this.getHeaders(),
        body: { model }
      }
    );
  }

  deleteCar(carId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/delete-car`, {
      headers,
      body: { carId }
    });
  }


  updateCar(carData: { 
    carId: string,
    brand: string,
    model: string,
    year: number,
    vin: string
}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/update-car`, carData, { headers });
}

  getAllCars(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/cars`, { headers });
  }

  createAppointment(appointment: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/appointment`, appointment, { headers });
  }

  getAppointments(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/appointments`, { headers });
  }

  getRepairs(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/repairs`, { headers });
  }

  cancelAppointment(appointmentId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/cancel-appointment`, { appointmentId }, { headers });
  }

  validateAppointment(appointmentId: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/validate-appointment`, { appointmentId }, { headers });
  }

  acceptReparation(repairId: string, reparationIndex: number): Observable<any> {
    const headers = this.getHeaders();
    
    return this.http.post(`${this.apiUrl}/accept-reparation`, 
      { repair_id: repairId, reparation_index: reparationIndex }, 
      { headers }
    );
  }

  getOngoingRepairs(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/ongoing-repairs`, { headers });
  }

  finishAsCustomer(repairId: string): Observable<any> {
    const headers = this.getHeaders();
    
    return this.http.post(
      `${this.apiUrl}/finish-repair`,
      { _id: repairId },
      { headers }
    );
  }


  getClientInvoices(carId?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/invoices`, {
      headers: this.getHeaders(),
      params: carId ? { car_id: carId } : {}
    });
  }

  downloadInvoicePDF(invoiceId: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/download-invoice`, 
      { invoice_id: invoiceId },
      { 
        headers: this.getHeaders(),
        responseType: 'blob' 
      }
    );
  }
}

