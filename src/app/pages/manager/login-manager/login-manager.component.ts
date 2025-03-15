import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginManagerService } from '../../../services/manager/login-manager.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-manager.component.html',
  styleUrls: ['./login-manager.component.css']
})
export class LoginManagerComponent {
  contact: string = '';
  password: string = '';
  message: string = '';

  constructor(private authService: AuthService,private ManagerService: LoginManagerService, private router: Router) {}

  loginUser() {
    console.log('Logging in with:', this.contact, this.password);

    this.ManagerService.login(this.contact, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.saveToken(response.token);
        this.message = 'Login successful!';
        this.router.navigate(['/dashboard']).then(() => {
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
