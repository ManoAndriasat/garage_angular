import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer/customer.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent {
  user = {
    firstname: '',
    lastname: '',
    contact: '',
    email: '',
    password: '',
    address: { street: '', city: '', lot: '' },
    cars: []
  };
  message = '';

  constructor(private userService: CustomerService) {}

  registerUser() {
    console.log('User Data:', this.user);
    this.userService.registerUser(this.user).subscribe({
      next: (response) => {
        this.message = 'User registered successfully!';
        window.location.href = '/login';
      },
      error: (error) => {
        this.message = 'Registration failed: ' + (error.error?.msg || 'Unknown error');
      }
    });
  }
}
