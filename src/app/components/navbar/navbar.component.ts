import { Component } from '@angular/core';
import { LoginCustomerService } from '../../services/customer/login-customer.service';
import { Router } from '@angular/router';
import { HeaderModule, NavModule, DropdownModule, GridModule } from '@coreui/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    HeaderModule,
    NavModule,
    DropdownModule,
    GridModule,
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userRole: number | null = null;

  constructor(private authService: LoginCustomerService, private router: Router) {}

  ngOnInit() {
    const decodedToken = this.authService.decodeToken();
    const token = this.authService.getToken();
    const role = this.authService.getUserRole();
    this.userRole = decodedToken.role;
    console.log("User role: ", this.userRole);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
