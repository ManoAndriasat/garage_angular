import { Routes } from '@angular/router';
import { LoginComponent } from './pages/customer/login-customer/login.component';
import { LoginMecanoComponent } from './pages/mecano/login-mecano/login-mecano.component';
import { LoginManagerComponent } from './pages/manager/login-manager/login-manager.component';
import { SignComponent } from './pages/customer/sign-customer/sign.component';
import { CarRegisterComponent } from './pages/customer/car-register-customer/car-register.component';
import { AppointmentFormComponent } from './pages/customer/appointment-form-customer/appointment-form.component';
import { AppointmentListCustomerComponent } from './pages/customer/appointment-list-customer/appointment-list-customer.component';
import { CarOnRepairCustomerComponent } from './pages/customer/car-on-repair-customer/car-on-repair-customer.component';
import { AppointmentListMecanoComponent } from './pages/mecano/appointment-list-mecano/appointment-list-mecano.component';
import { CarOnRepairMecanoComponent } from './pages/mecano/car-on-repair-mecano/car-on-repair-mecano.component';
import { AppointmentListManagerComponent } from './pages/manager/appointment-list-manager/appointment-list-manager.component';
import { DashboardComponent } from './pages/manager/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { FutureAppointmentComponent } from './pages/mecano/future-appointment/future-appointment.component';
import { AppointmentHistoryComponent } from './pages/mecano/appointment-history/appointment-history.component';
import { InvoiceComponent } from './pages/customer/invoice/invoice.component';
import { MechanicRegisterComponent } from './pages/manager/mechanic-register/mechanic-register.component';
import { ExistingCarManagementComponent } from './pages/manager/existing-car-management/existing-car-management.component';
import { MaterialManagementComponent } from './pages/manager/material-management/material-management.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sign', component: SignComponent },
    { path: 'car-register', component: CarRegisterComponent },
    { path: 'appointment-form', component: AppointmentFormComponent },
    { path: 'appointment-list-customer', component: AppointmentListCustomerComponent },
    { path: 'car-on-repair-customer', component: CarOnRepairCustomerComponent },
    {path: 'invoice', component: InvoiceComponent},

    {path: 'login-mecano', component: LoginMecanoComponent},
    {path: 'appointment-list-mecano', component: AppointmentListMecanoComponent, canActivate: [AuthGuard], data: { roles: [5] }},
    {path: 'appointment-history', component: AppointmentHistoryComponent, canActivate: [AuthGuard], data: { roles: [5] }},
    {path: 'future-appointment', component: FutureAppointmentComponent, canActivate: [AuthGuard], data: { roles: [5] }},
    {path: 'car-on-repair-mecano', component: CarOnRepairMecanoComponent,canActivate: [AuthGuard], data: { roles: [5] }},

    {path: 'login-manager', component: LoginManagerComponent},
    {path: 'appointment-list-manager', component: AppointmentListManagerComponent,canActivate: [AuthGuard], data: { roles: [10] }},
    {path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard], data: { roles: [10] }},
    {path: 'mechanics', component: MechanicRegisterComponent,canActivate: [AuthGuard], data: { roles: [10] }},
    {path: 'existing-cars', component: ExistingCarManagementComponent,canActivate: [AuthGuard], data: { roles: [10] }},
    {path: 'materials', component: MaterialManagementComponent,canActivate: [AuthGuard], data: { roles: [10] }},
];
