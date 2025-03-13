import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginMecanoService } from '../../../services/mecano/login-mecano.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-mecano.component.html',
  styleUrls: ['./login-mecano.component.css']
})
export class LoginMecanoComponent {
  contact: string = '';
  password: string = '';
  message: string = '';

  constructor(private authService: AuthService,private MecanoService: LoginMecanoService, private router: Router) {}

  loginUser() {
    console.log('Logging in with:', this.contact, this.password);

    this.MecanoService.login(this.contact, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.saveToken(response.token);
        this.message = 'Login successful!';
        this.router.navigate(['/appointment-list-mecano']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.message = 'Invalid contact or password';
      }
    });
  }
}
