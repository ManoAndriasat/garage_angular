import { Component } from '@angular/core';
import { HeaderModule, NavModule, DropdownModule, GridModule, } from '@coreui/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    HeaderModule,
    NavModule,
    DropdownModule,
    GridModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {}