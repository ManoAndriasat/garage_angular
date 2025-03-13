// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const userRole = this.authService.getUserRole();
    const allowedRoles = route.data['roles'] as number[];
    
    if (allowedRoles && userRole !== null && allowedRoles.includes(userRole)) {
      return true; 
    }

    this.router.navigate(['/login']);
    return false; 
  }
}
