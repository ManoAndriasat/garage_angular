import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = 'https://mygarage-fujn.onrender.com/managers';

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

  getExistingCars(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/existing-cars`, 
      { headers: this.getHeaders() }
    );
  }
  
  createExistingCar(carData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/existing-cars`, 
      carData, 
      { headers: this.getHeaders() }
    );
  }
  
  updateExistingCar(id: string, updates: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/existing-cars/${id}`, 
      updates, 
      { headers: this.getHeaders() }
    );
  }
  
  deleteExistingCar(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/existing-cars/${id}`, 
      { headers: this.getHeaders() }
    );
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

  createMaterial(materialData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/materials`, 
      materialData, 
      { headers: this.getHeaders() }
    );
  }

  getMaterials(): Observable<any> {
    return this.http.get(`${this.apiUrl}/materials`, { headers: this.getHeaders() }).pipe(
      map((response: any) => {
        return response.data.map((material: any) => {
          const priceHistory = material.priceHistory;
          if (priceHistory.length > 1) {
            material.lastPrice = priceHistory[priceHistory.length - 2].price;
          } else {
            material.lastPrice = null;
          }
          return material;
        });
      })
    );
  }
  
  getMaterial(id: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/materials/${id}`, 
      { headers: this.getHeaders() }
    );
  }

  updateMaterial(id: string, updates: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/materials/${id}`, 
      updates, 
      { headers: this.getHeaders() }
    );
  }

  deleteMaterial(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/materials/${id}`, 
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