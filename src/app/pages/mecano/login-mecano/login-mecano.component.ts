import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { MecanoService } from '../../../services/mecano/mecano.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-mecano.component.html',
  styleUrls: ['./login-mecano.component.css']
})
export class LoginMecanoComponent {
  contact: string = '0343373351';
  password: string = 'mechanic';
  message: string = '';

  constructor(private authService: AuthService,private MecanoService: MecanoService, private router: Router) {}

  loginUser() {
    console.log('Logging in with:', this.contact, this.password);

    this.MecanoService.login(this.contact, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.saveToken(response.token);
        this.message = 'Login successful!';
        this.router.navigate(['/appointment-list-mecano']).then(() => {
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
