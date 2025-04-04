import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MecanoService } from '../../../services/mecano/mecano.service';
import { FormsModule } from '@angular/forms';

interface User {
  firstname: string;
  lastname: string;
  contact: string;
}

interface Car {
  brand: string;
  model: string;
  year: string;
}

interface Appointment {
  _id: string;
  date: string;
  start_time: string;
  end_time: string;
  localisation: string;
  user: User;
  car: Car;
  mechanic: any;
  processing?: boolean;
}

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.css']
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: Appointment[] = [];
  isLoading = true;
  error: string | null = null;
  errorMessage: string | null = null;

  constructor(private mecanoService: MecanoService) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.error = null;

    this.mecanoService.getLastAppointments().subscribe({
      next: (appointments: any) => {
        this.appointments = appointments.map((appt: any) => ({
          ...appt,
          processing: false
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load appointments';
        this.isLoading = false;
        console.error('Error loading appointments:', err);
      }
    });
  }

  beginRepair(appointment: Appointment): void {
    appointment.processing = true;
    
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
        appointment.processing = false;
        this.loadAppointments();
      },
      error: (err) => {
        appointment.processing = false;
        this.handleApiError(err);
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

  private handleApiError(error: any) {
    if (error.error?.error) {
      this.errorMessage = error.error.error;
    } else if (error.error) {
      this.errorMessage = error.error;
    } else {
      this.errorMessage = 'An unknown error occurred';
    }
    setTimeout(() => this.errorMessage = null, 5000);
  }
}