import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginCustomerService } from '../../../services/customer/login-customer.service';
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

  constructor(private authService: AuthService,private CustomerService: LoginCustomerService, private router: Router) {}

  loginUser() {
    console.log('Logging in with:', this.contact, this.password);

    this.CustomerService.login(this.contact, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
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
      }
    });
  }
}
