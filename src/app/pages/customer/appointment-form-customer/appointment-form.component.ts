import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { MecanoService } from '../../../services/mecano/mecano.service';
import { first } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
})
export class AppointmentFormComponent implements OnInit {
  formData = {
    car: null as any,
    mechanic: null as any,
    date: '',
    start_time: '',
    end_time: '',
    localisation: '',
    problem: [{ material: '', description: '' }],
    status: {
      mechanic: false,
      user: true
    }
  };

  mechanics: any[] = [];
  cars: any[] = [];
  message_error: string | null = null;
  
  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private mecanoService: MecanoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMechanics();
    this.loadCars();
  }

  loadMechanics() {
    this.mecanoService.getMechanics().subscribe({
      next: (response) => {
        this.mechanics = response;
      },
      error: (error) => {
        console.error('Error fetching mechanics:', error);
      }
    });
  }

  loadCars() {
    this.customerService.getAllCars().subscribe({
      next: (response) => {
        this.cars = response;
      },
      error: (error) => {
        console.error('Error fetching cars:', error);
      }
    });
  }

  addProblem() {
    this.formData.problem.push({ material: '', description: '' });
  }

  submitForm() {
    // Clear previous error message
    this.message_error = null;

    const dateObj = new Date(this.formData.date);
    this.formData.start_time = dateObj.toISOString();
    
    dateObj.setHours(dateObj.getHours() + 1);
    this.formData.end_time = dateObj.toISOString();

    const user_details = this.authService.getUser();
    const user = {
      _id: this.authService.getId(),
      firstname: user_details.firstname,
      lastname: user_details.lastname,
      contact: user_details.contact,
      email: user_details.email
    };

    const selectedMechanic = {
      _id: this.formData.mechanic._id,
      firstname: this.formData.mechanic.firstname,
      lastname: this.formData.mechanic.lastname,
      contact: this.formData.mechanic.contact
    };

    const appointmentData = {
      user,
      car: this.formData.car,
      mechanic: selectedMechanic,
      date: this.formData.date,
      start_time: this.formData.start_time,
      end_time: this.formData.end_time,
      localisation: this.formData.localisation,
      problem: this.formData.problem.map(p => ({
        material: p.material || '',
        description: p.description
      })),
      status: this.formData.status
    };
    
    this.customerService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        this.router.navigate(['/appointment-list-customer']);
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        
        if (error.error?.msg) {
          this.message_error = error.error.msg;
        } else if (error.error?.message) {
          this.message_error = error.error.message;
        } else if (error.message) {
          this.message_error = error.message;
        } else {
          this.message_error = 'An unknown error occurred while creating the appointment';
        }
      }
    });
}
}