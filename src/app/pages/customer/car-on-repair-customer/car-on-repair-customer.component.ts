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
  showFinishConfirmation = false;
  repairToFinish: string | null = null;
  isSubmitting = false;

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

  finishAsCustomer(): void {
    if (!this.repairToFinish || this.isSubmitting) return;
  
    this.isSubmitting = true;
    this.error = null;
  
    this.customerService.finishAsCustomer(this.repairToFinish).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        const index = this.repairs.findIndex(r => r._id === this.repairToFinish);
        if (index !== -1) {
          this.repairs[index] = response.repair;
        }
        this.showFinishConfirmation = false;
        this.repairToFinish = null;
        this.loadRepairs();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err.error?.message || 'Failed to complete repair';
        console.error(err);
      }
    });
  }
  
  openFinishConfirmation(repairId: string): void {
    this.repairToFinish = repairId;
    this.showFinishConfirmation = true;
  }
  
  cancelFinish(): void {
    this.showFinishConfirmation = false;
    this.repairToFinish = null;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
}