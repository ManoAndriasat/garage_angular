import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MecanoService } from '../../../services/mecano/mecano.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.css'
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: any[] = [];
  isLoading = true;
  error: string | null = null;
  isCreatingRepair = false;
  errorMessage: string | null = null;

  
  constructor(
    private mecanoService: MecanoService,
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  beginRepair(appointment: any): void {
    this.isCreatingRepair = true;
    const repairData = {
      appointment_id: appointment._id,
      owner: appointment.user,
      car: appointment.car,
      mechanic: appointment.mechanic,
      isfinished: false,
      reparation: []
    };
  
    this.mecanoService.createRepair(repairData).subscribe({
      next: (response) => {
        this.isCreatingRepair = false;
        this.loadAppointments();
      },
      error: (err) => {
        this.isCreatingRepair = false;
        if (err.error?.error) {
          this.errorMessage = err.error.error;
        } else if (err.error) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'An unknown error occurred';
        }
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  private handleApiError(error: any) {
    this.errorMessage = (error.error);
    setTimeout(() => this.errorMessage = null, 5000);
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.error = null;

    this.mecanoService.getLastAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load appointments';
        this.isLoading = false;
        console.error('Error loading appointments:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatTime(timeString: string): string {
    return new Date(timeString).toLocaleString([], {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}