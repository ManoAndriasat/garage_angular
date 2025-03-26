import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
})
export class AppointmentFormComponent {
  formData = {
    car_id: '',
    mechanic_id: '',
    date: '',
    start_time: '',
    end_time: '',
    localisation: '',
    problem: [{ material: '', description: '' }],
    status: {
      mechanic: true,
      user: true
    }
  };

  constructor(
    private authService: AuthService,
    private customerService: CustomerService
  ) {}

  addProblem() {
    this.formData.problem.push({ material: '', description: '' });
  }

  submitForm() {
    const dateObj = new Date(this.formData.date);
    this.formData.start_time = dateObj.toISOString();
    
    dateObj.setHours(dateObj.getHours() + 1);
    this.formData.end_time = dateObj.toISOString();


    const user_id = this.authService.getId();
    
    const appointmentData = {
      user_id,
      car_id: this.formData.car_id,
      mechanic_id: this.formData.mechanic_id,
      date: this.formData.date,
      start_time: this.formData.start_time,
      end_time: this.formData.end_time,
      localisation: this.formData.localisation,
      problem: this.formData.problem,
      status: this.formData.status
    };
    console.log('Appointment Data:', appointmentData);


    this.customerService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        console.log('Appointment created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
      }
    });
  }
}