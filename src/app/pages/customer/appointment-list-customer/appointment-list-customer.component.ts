import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';

@Component({
  selector: 'app-appointment-list-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-list-customer.component.html',
  styleUrls: ['./appointment-list-customer.component.css']
})
export class AppointmentListCustomerComponent implements OnInit {
  appointments: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private customerService: CustomerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.error = null;

    this.customerService.getAppointments().subscribe({
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
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getStatusText(status: any): string {
    if (status.user && status.mechanic) return 'Confirmed';
    if (!status.user) return 'Cancelled by you';
    if (!status.mechanic) return 'Waiting for mechanic confirmation';
    return 'Pending';
  }

  getCarBrandModel(carId: string): string {
    return 'Toyota Corolla'; 
  }

  getMechanicName(mechanicId: string): string {
    return 'John Doe'; 
  }

  cancelAppointment(appointmentId: string): void {
    console.log('Cancelling appointment:', appointmentId);
  }
}