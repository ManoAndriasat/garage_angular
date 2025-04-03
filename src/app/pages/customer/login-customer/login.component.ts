import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer/customer.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  contact: string = '0343373351';
  password: string = 'customer';
  message: string = '';
  isLoading: boolean = false; // Add loading state

  constructor(
    private authService: AuthService,
    private CustomerService: CustomerService, 
    private router: Router
  ) {}

  loginUser() {
    this.isLoading = true; // Show loader when login starts
    this.message = ''; // Clear previous messages

    this.CustomerService.login(this.contact, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.authService.saveUser(response.user);
        this.message = 'Login successful!';
        this.router.navigate(['/car-register']).then(() => {
          window.location.reload();
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.message = 'Invalid contact or password';
        this.isLoading = false; // Hide loader on error
      },
      complete: () => {
        this.isLoading = false; // Hide loader when complete (optional)
      }
    });
  }
}