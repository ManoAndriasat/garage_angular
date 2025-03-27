import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MecanoService } from '../../../services/mecano/mecano.service';
import { AuthService } from '../../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-future-appointment',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './future-appointment.component.html',
  styleUrl: './future-appointment.component.css'
})
export class FutureAppointmentComponent implements OnInit {
  appointments: any[] = [];
  isLoading = true;
  error: string | null = null;

  vinDetailsMap: { [vin: string]: any } = {};
  loadingVins: { [vin: string]: boolean } = {};
  vinErrors: { [vin: string]: string | null } = {};

  // Reschedule modal variables
  showRescheduleModal = false;
  rescheduleData = {
    appointmentId: '',
    newStartTime: ''
  };

  constructor(
    private mecanoService: MecanoService,
    private authService: AuthService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.error = null;

    this.mecanoService.getAppointments().subscribe({
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

  validateAppointment(appointmentId: string): void {
    this.mecanoService.validateAppointment(appointmentId).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(a => a._id !== appointmentId);
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Error validating appointment:', err);
        this.error = 'Failed to validate appointment';
      }
    });
  }

  deleteAppointment(appointmentId: string): void {
    if (confirm('Are you sure you want to reject this appointment?')) {
      this.mecanoService.deleteAppointment(appointmentId).subscribe({
        next: () => {
          this.appointments = this.appointments.filter(a => a._id !== appointmentId);
          this.loadAppointments();
        },
        error: (err) => {
          console.error('Error deleting appointment:', err);
          this.error = 'Failed to reject appointment';
        }
      });
    }
  }

  openRescheduleModal(appointment: any): void {
    this.rescheduleData = {
      appointmentId: appointment._id,
      newStartTime: this.formatDateTimeForInput(appointment.start_time)
    };
    this.showRescheduleModal = true;
  }

  rescheduleAppointment(): void {
    const localDateTime = new Date(this.rescheduleData.newStartTime);
    const isoDateTime = this.formatLocalToISO(localDateTime);

    this.mecanoService.updateAppointmentStartTime(
      this.rescheduleData.appointmentId,
      isoDateTime
    ).subscribe({
      next: (updatedAppointment) => {
        const index = this.appointments.findIndex(a => a._id === this.rescheduleData.appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedAppointment;
        }
        this.showRescheduleModal = false;
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Error rescheduling appointment:', err);
        this.error = 'Failed to reschedule appointment';
        this.showRescheduleModal = false;
      }
    });
  }

  private formatLocalToISO(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
  

  private formatDateTimeForInput(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const isoString = date.toISOString();
    return isoString.substring(0, isoString.length - 8);
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