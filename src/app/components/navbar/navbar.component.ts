import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userRole: number | null = null;
  isMobileMenuOpen = false;
  mobileOpenDropdown: string | null = null;
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!event.target || !(event.target as HTMLElement).closest('.relative')) {
      this.isOpen = false;
    }
  }
  constructor(private authService: AuthService, private router: Router) { }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (!this.isMobileMenuOpen) {
      this.mobileOpenDropdown = null;
    }
  }

  toggleMobileDropdown(label: string) {
    this.mobileOpenDropdown = this.mobileOpenDropdown === label ? null : label;
  }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
  }

  getRoleName(): string {
    return this.authService.getUserName() || 'Guest';
  }

  hasToken(): boolean {
    return !!this.authService.getToken();
  }

  logout() {
    this.authService.logout();
    let redirectRoute = '/login';

    switch (this.userRole) {
      case 5: redirectRoute = '/login-mecano'; break;
      case 10: redirectRoute = '/login-manager'; break;
    }

    this.router.navigate([redirectRoute]);
  }

  getNavItems() {
    if (this.userRole === 0) {
      return [
        { label: 'Register Car', link: '/car-register' },
        {
          label: 'Appointments',
          items: [
            { label: 'New Appointment', link: '/appointment-form' },
            { label: 'My Appointments', link: '/appointment-list-customer' }
          ]
        },
        { label: 'Cars in Repair', link: '/car-on-repair-customer' },
        { label: 'Invoices', link: '/invoice' }
      ];
    } else if (this.userRole === 5) {
      return [
        { label: 'Current Repairs', link: '/car-on-repair-mecano' },
        {
          label: 'Appointments',
          items: [
            { label: 'Waiting', link: '/appointment-list-mecano' },
            { label: 'Future/Ongoing', link: '/future-appointment' },
            { label: 'History', link: '/appointment-history' }
          ]
        }
      ];
    } else if (this.userRole === 10) {
      return [
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Mechanics', link: '/mechanics' },
        { label: 'Existing cars', link: '/existing-cars' },
        { label: 'Materials', link: '/materials' },
      ];
    }
    return [];
  }
}