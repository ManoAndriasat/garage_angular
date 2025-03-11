import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginCustomerService } from '../../../services/customer/login-customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  contact: string = '';
  password: string = '';
  message: string = '';

  constructor(private authService: LoginCustomerService, private router: Router) {}

  loginUser() {
    console.log('Logging in with:', this.contact, this.password);

    this.authService.login(this.contact, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.saveToken(response.token);
        this.message = 'Login successful!';
        this.router.navigate(['/car-register']); 
        window.location.reload();
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.message = 'Invalid contact or password';
      }
    });
  }
}
