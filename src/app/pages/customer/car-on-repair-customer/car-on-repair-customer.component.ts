import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer/customer.service';

@Component({
  selector: 'app-car-on-repair-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-on-repair-customer.component.html',
  styleUrls: ['./car-on-repair-customer.component.css']
})
export class CarOnRepairCustomerComponent implements OnInit {
  repairs: any[] = []; // Changed from currentRepair to repairs array
  isLoading = true;
  error: string | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadRepairs();
  }

  loadRepairs(): void {
    this.isLoading = true;
    this.error = null;
    
    this.customerService.getOngoingRepairs().subscribe({
      next: (repairs) => {
        this.repairs = repairs; // Store all repairs
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load repair data';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  acceptReparation(repairId: string, index: number): void {
    const isConfirmed = confirm('Are you sure you want to accept this reparation?');
    
    if (isConfirmed) {
      this.customerService.acceptReparation(repairId, index).subscribe({
        next: (response) => {
          if (response.success) {
            // Update the specific repair in the array
            const repairIndex = this.repairs.findIndex(r => r._id === repairId);
            if (repairIndex !== -1) {
              this.repairs[repairIndex] = response.data;
            }
          } else {
            this.error = response.message || 'Failed to accept reparation';
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to accept reparation';
          console.error(err);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}