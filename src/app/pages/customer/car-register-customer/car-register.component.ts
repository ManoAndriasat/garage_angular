import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../../services/customer/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ManagerService } from '../../../services/manager/manager.service';
import { CarFormDialogComponent } from '../../../components/car-form-dialog/car-form-dialog.component';
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
  deletingCarId: string | null = null;
  deleteError: string | null = null;
  updatingCarId: string | null = null;
  updateError: string | null = null;

  // Car update form data
  currentYear: number = new Date().getFullYear();
  years: number[] = Array.from({ length: this.currentYear - 1979 }, (_, i) => 1980 + i);
  carBrands: any[] = [];
  availableModels: string[] = [];
  showUpdateModal = false;
  carToUpdate: any = {
    _id: '',
    brand: '',
    model: '',
    year: this.currentYear,
    vin: ''
  };

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private managerService: ManagerService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getCars();
    this.loadCarBrands();
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

  loadCarBrands(): void {
    this.managerService.getExistingCars().subscribe({
      next: (response) => {
        if (response.success) {
          this.carBrands = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading car brands:', error);
      }
    });
  }

  onBrandChange(): void {
    this.carToUpdate.model = '';
    const selectedBrand = this.carBrands.find(brand => brand.brand === this.carToUpdate.brand);
    this.availableModels = selectedBrand ? [...selectedBrand.model] : [];
  }

  openUpdateModal(car: any) {
    this.carToUpdate = { ...car };
    const selectedBrand = this.carBrands.find(brand => brand.brand === car.brand);
    this.availableModels = selectedBrand ? [...selectedBrand.model] : [];
    this.showUpdateModal = true;
    this.updateError = null;
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
    this.updatingCarId = null;
  }

  updateCar() {
    if (!this.carToUpdate.brand || !this.carToUpdate.model || !this.carToUpdate.year || !this.carToUpdate.vin) {
      this.updateError = 'Please fill all required fields';
      return;
    }

    this.updatingCarId = this.carToUpdate._id;
    
    this.customerService.updateCar({
      carId: this.carToUpdate._id,
      brand: this.carToUpdate.brand,
      model: this.carToUpdate.model,
      year: this.carToUpdate.year,
      vin: this.carToUpdate.vin
    }).subscribe({
      next: () => {
        this.updatingCarId = null;
        this.showUpdateModal = false;
        this.getCars();
        alert('Car updated successfully!');
      },
      error: (err) => {
        this.updatingCarId = null;
        this.updateError = err.error?.msg || 'Failed to update car';
        console.error('Error updating car:', err);
      }
    });
  }

  confirmDelete(carId: string) {
    if (confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      this.deleteCar(carId);
    }
  }

  deleteCar(carId: string) {
    this.deletingCarId = carId;
    this.deleteError = null;
    
    this.customerService.deleteCar(carId).subscribe({
      next: () => {
        this.deletingCarId = null;
        this.getCars();
        alert('Car deleted successfully!');
      },
      error: (err) => {
        this.deletingCarId = null;
        this.deleteError = err.error?.msg || 'Failed to delete car';
        console.error('Error deleting car:', err);
        alert('Error: ' + this.deleteError);
      }
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
      .filter(key => key !== 'VIN')
      .map(key => ({
        label: key.split(/(?=[A-Z])/).join(' ').toUpperCase(), 
        value: carDetails[key]
      }));
  }

  toggleVinDetails(vin: string) {
    if (this.vinDetailsMap[vin]) {
      this.vinDetailsMap[vin] = null;
      this.vinErrors[vin] = null;
    } else {
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