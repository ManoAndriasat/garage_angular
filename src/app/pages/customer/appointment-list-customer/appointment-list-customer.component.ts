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

  cancelAppointment(appointmentId: string): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.customerService.cancelAppointment(appointmentId).subscribe({
        next: () => {
          const appointment = this.appointments.find(a => a._id === appointmentId);
          if (appointment) {
            appointment.status.user = false;
          }
        },
        error: (err) => {
          console.error('Error canceling appointment:', err);
          this.error = 'Failed to cancel appointment';
        }
      });
    }
  }

  validateAppointment(appointmentId: string): void {
    this.customerService.validateAppointment(appointmentId).subscribe({
      next: (updatedAppointment) => {
        const index = this.appointments.findIndex(a => a._id === appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedAppointment;
        }
      },
      error: (err) => {
        console.error('Error validating appointment:', err);
        this.error = 'Failed to validate appointment';
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
  
  
  getStatusText(status: any): string {
    if (status.user && status.mechanic) return 'Confirmed';
    if (!status.user) return 'the mechanic reshedule the date and waiting for your confirmation';
    if (!status.mechanic) return 'Waiting for mechanic confirmation';
    return 'Pending';
  }
}