import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';


@Component({
  selector: 'app-car-on-repair-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-on-repair-customer.component.html',
  styleUrls: ['./car-on-repair-customer.component.css']
})
export class CarOnRepairCustomerComponent implements OnInit {
  repairs: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private repairService: CustomerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadRepairs();
  }

  loadRepairs(): void {
    this.isLoading = true;
    this.error = null;

    this.repairService.getRepairs().subscribe({
      next: (repairs) => {
        this.repairs = repairs;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load repair information';
        this.isLoading = false;
        console.error('Error loading repairs:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getCarBrandModel(carId: string): string {
    return 'Toyota Corolla'; // Placeholder
  }

  getMechanicName(mechanicId: string): string {
    return 'John Doe'; // Placeholder
  }

  updateRepairStatus(repairId: string, reparationIndex: number, status: boolean): void {
    console.log('Updating repair status:', { repairId, reparationIndex, status });
  }
}