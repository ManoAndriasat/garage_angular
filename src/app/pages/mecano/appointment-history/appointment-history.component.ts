import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MecanoService } from '../../../services/mecano/mecano.service';
import { FormsModule } from '@angular/forms';
import { VinDetailsComponent } from '../vin-details/vin-details.component';

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [CommonModule, FormsModule, VinDetailsComponent],
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.css'
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private mecanoService: MecanoService,
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
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