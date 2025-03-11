import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginCustomerService } from '../../../services/customer/login-customer.service';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent {
  user = { firstname: '', lastname: '', contact: '', email: '', password: '' };
  message = '';

  constructor(private userService: LoginCustomerService) {}

  registerUser() {
    console.log('User Data:', this.user);
    this.userService.registerUser(this.user).subscribe({
      next: (response) => {
        this.message = 'User registered successfully!';
      },
      error: (error) => {
        this.message = 'Registration failed: ' + error.error.msg;
      }
    });
  }
}
