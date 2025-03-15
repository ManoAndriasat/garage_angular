import { Routes } from '@angular/router';
import { LoginComponent } from './pages/customer/login-customer/login.component';
import { LoginMecanoComponent } from './pages/mecano/login-mecano/login-mecano.component';
import { LoginManagerComponent } from './pages/manager/login-manager/login-manager.component';
import { SignComponent } from './pages/customer/sign-customer/sign.component';
import { CarRegisterComponent } from './pages/customer/car-register-customer/car-register.component';
import { AppointmentListMecanoComponent } from './pages/mecano/appointment-list-mecano/appointment-list-mecano.component';
import { DashboardComponent } from './pages/manager/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sign', component: SignComponent },
    { path: 'car-register', component: CarRegisterComponent },

    {path: 'login-mecano', component: LoginMecanoComponent},
    {path: 'appointment-list-mecano', component: AppointmentListMecanoComponent, canActivate: [AuthGuard], data: { roles: [5, 10] }},

    {path: 'login-manager', component: LoginManagerComponent},
    {path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard], data: { roles: [10] }},
];
