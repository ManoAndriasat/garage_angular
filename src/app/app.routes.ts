import { Routes } from '@angular/router';
import { LoginComponent } from './pages/customer/login-customer/login.component';
import { SignComponent } from './pages/customer/sign-customer/sign.component';
import { CarRegisterComponent } from './pages/customer/car-register-customer/car-register.component';
import { AppointmentFormComponent } from './pages/customer/appointment-form-customer/appointment-form.component';
import { AppointmentListCustomerComponent } from './pages/customer/appointment-list-customer/appointment-list-customer.component';
import { CarOnRepairCustomerComponent } from './pages/customer/car-on-repair-customer/car-on-repair-customer.component';
import { AppointmentListMecanoComponent } from './pages/mecano/appointment-list-mecano/appointment-list-mecano.component';
import { CarOnRepairMecanoComponent } from './pages/mecano/car-on-repair-mecano/car-on-repair-mecano.component';
import { AppointmentListManagerComponent } from './pages/manager/appointment-list-manager/appointment-list-manager.component';
import { DashboardComponent } from './pages/manager/dashboard/dashboard.component';
import { CrudComponent } from './pages/manager/crud/crud.component';

export const routes: Routes = [
    //CUSTOMER
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sign', component: SignComponent },
    { path: 'car-register', component: CarRegisterComponent },
    { path: 'appointment-form', component: AppointmentFormComponent },
    { path: 'appointment-list-customer', component: AppointmentListCustomerComponent },
    { path: 'car-on-repair-customer', component: CarOnRepairCustomerComponent },
    //MECANO
    { path: 'appointment-list-mecano', component: AppointmentListMecanoComponent },
    { path: 'car-on-repair-mecano', component: CarOnRepairMecanoComponent },
    //MANAGER
    { path: 'appointment-list-manager', component: AppointmentListManagerComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'crud', component: CrudComponent },
];
