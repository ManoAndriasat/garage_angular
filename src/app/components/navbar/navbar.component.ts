import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const decodedToken = this.authService.decodeToken();
    const token = this.authService.getToken();
    const role = this.authService.getUserRole();
    this.userRole = decodedToken.role;
    console.log("User role: ", this.userRole);
  }


  customerNavItems = [
    { label: 'Sign Up', link: '/sign' },
    { label: 'Register Car', link: '/car-register' },
    { label: 'New Appointment', link: '/appointment-form' },
    { label: 'My Appointments', link: '/appointment-list-customer' },
    { label: 'Cars in Repair', link: '/car-on-repair-customer' },
    { label: 'Invoices', link: '/invoice' },
  ];

  mechanicNavItems = [
    { label: 'Current Repairs', link: '/car-on-repair-mecano' },
    { label: 'Waiting Appointments', link: '/appointment-list-mecano' },
    { label: 'Future Appointments', link: '/future-appointment' },
    { label: 'History', link: '/appointment-history' }
  ];

  managerNavItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Register Mechanic', link: '/mechanic-register' },
    { label: 'All Appointments', link: '/appointment-list-manager' }
  ];

  getRoleName(): string {
    switch (this.userRole) {
      case 0: return 'Customer';
      case 5: return 'Mechanic';
      case 10: return 'Manager';
      default: return 'Guest';
    }
  }

  hasToken(): boolean {
    const token = this.authService.getToken();
    return !!token;
  }

  logout() {
    const role = this.authService.getUserRole();
    if (role === 0) {
      this.authService.logout();
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    } else if (role === 5) {
      this.authService.logout();
      this.router.navigate(['/login-mecano']).then(() => {
        window.location.reload();
      });
    } else if (role === 10) {
      this.authService.logout();
      this.router.navigate(['/login-manager']).then(() => {
        window.location.reload();
      });
    }
  }
}