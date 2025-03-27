// car-register.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarFormDialogComponent } from '../../../components/car-form-dialog/car-form-dialog.component';
import { CustomerService } from '../../../services/customer/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-car-register',
  standalone: true,
  templateUrl: './car-register.component.html',
  imports: [CommonModule, FormsModule],
  styleUrl: './car-register.component.css',
})
export class CarRegisterComponent implements OnInit {
  cars: any[] = [];
  vinDetailsMap: { [vin: string]: any } = {};
  loadingVins: { [vin: string]: boolean } = {};
  vinErrors: { [vin: string]: string | null } = {};

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getCars(); 
  }

  getCars() {
    this.customerService.getAllCars().subscribe({
      next: (data) => {
        this.cars = data;
        data.forEach((car: { vin: string }) => {
          this.vinDetailsMap[car.vin] = null;
          this.loadingVins[car.vin] = false;
          this.vinErrors[car.vin] = null;
        });
      },
      error: (err) => {
        console.error('Error fetching cars:', err);
      }
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(CarFormDialogComponent, {
      width: '800px',
      maxWidth: 'none'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getCars();
    });
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
    return Object.keys(carDetails)
      .filter(key => key !== 'VIN') // Exclude VIN since we already show it
      .map(key => ({
        label: key.split(/(?=[A-Z])/).join(' ').toUpperCase(), 
        value: carDetails[key]
      }));
  }

  toggleVinDetails(vin: string) {
    if (this.vinDetailsMap[vin]) {
      // If details are already shown, hide them
      this.vinDetailsMap[vin] = null;
      this.vinErrors[vin] = null;
    } else {
      // If not shown, fetch details
      this.loadingVins[vin] = true;
      this.vinErrors[vin] = null;
      
      this.fetchCarDetailsByVin(vin).subscribe(
        (response: any) => {
          if (response.Results && response.Results.length > 0 && Object.keys(response.Results[0]).length > 1) {
            this.vinDetailsMap[vin] = response.Results[0];
          } else {
            this.vinErrors[vin] = 'No details found for this VIN';
          }
          this.loadingVins[vin] = false;
        },
        (error) => {
          console.error('Error fetching VIN details:', error);
          this.vinErrors[vin] = 'Error fetching VIN details';
          this.loadingVins[vin] = false;
        }
      );
    }
  }
}