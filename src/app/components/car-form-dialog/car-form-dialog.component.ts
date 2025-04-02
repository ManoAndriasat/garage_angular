import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer/customer.service';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManagerService } from '../../services/manager/manager.service';

@Component({
  selector: 'app-car-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-form-dialog.component.html',
  styleUrls: ['./car-form-dialog.component.css'],
})
export class CarFormDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<CarFormDialogComponent>,
    private userService: CustomerService,
    private authService: AuthService,
    private http: HttpClient,
    private managerService: ManagerService
  ) { }

  currentYear: number = new Date().getFullYear();
  years: number[] = Array.from({ length: this.currentYear - 1979 }, (_, i) => 1980 + i);
  
  // Store available brands and models
  carBrands: any[] = [];
  availableModels: string[] = [];
  
  carData = {
    owner: '',
    brand: '',
    model: '',
    year: null,
    vin: '',
  };

  vinData = {
    vin: '',
    carDetails: null as any,
  };

  message = '';

  ngOnInit(): void {
    this.loadCarBrands();
  }

  loadCarBrands(): void {
    this.managerService.getExistingCars().subscribe({
      next: (response) => {
        if (response.success) {
          this.carBrands = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading car brands:', error);
        this.message = 'Error loading car brands';
      }
    });
  }

  onBrandChange(): void {
    // Reset model when brand changes
    this.carData.model = '';
    
    // Find selected brand and get its models
    const selectedBrand = this.carBrands.find(brand => brand.brand === this.carData.brand);
    this.availableModels = selectedBrand ? [...selectedBrand.model] : [];
  }

  registerCar() {
    this.carData.owner = this.authService.getId() ?? 'defaultOwnerId';
    this.carData.vin = this.vinData.vin;
    console.log('Cars Data:', this.carData);

    this.userService.registerCar(this.carData).subscribe({
      next: (response) => {
        this.message = 'Car registered successfully!';
        console.log('Success:', response);
        this.dialogRef.close();
      },
      error: (error) => {
        this.message = 'Registration failed: ' + (error.error?.msg || 'Unknown error');
        console.error('Error:', error);
      },
    });
    this.dialogRef.close(this.carData);
  }

  fetchCarDetailsByVin(vin: string): Observable<any> {
    const vinDecodedUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`;
    return this.http.get(vinDecodedUrl).pipe(
      map((response: any) => {
        if (response.Results && response.Results.length > 0) {
          const filteredResult = Object.fromEntries(
            Object.entries(response.Results[0]).filter(([key, value]) => value !== "")
          );
          response.Results[0] = filteredResult;
        }
        return response;
      })
    );
  }

  getCarDetailsAsArray(carDetails: any): { label: string, value: string }[] {
    return Object.keys(carDetails).map(key => ({
      label: key.split(/(?=[A-Z])/).join(' ').toUpperCase(), 
      value: carDetails[key]
    }));
  }

  handleVinSubmit() {
    this.fetchCarDetailsByVin(this.vinData.vin).subscribe(
      (response: any) => {
        if (response.Results.length > 0) {
          this.vinData.carDetails = response.Results[0];
          // Auto-fill brand and model if available from VIN
          if (response.Results[0].Make) {
            this.carData.brand = response.Results[0].Make;
            this.onBrandChange();
          }
          if (response.Results[0].Model) {
            this.carData.model = response.Results[0].Model;
          }
        } else {
          this.vinData.carDetails = null;
          this.message = 'No details found for this VIN';
        }
      },
      (error) => {
        console.error('Error fetching VIN details:', error);
        this.message = 'Error fetching VIN details';
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
}