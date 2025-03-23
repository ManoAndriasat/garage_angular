import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarFormDialogComponent } from '../../../components/car-form-dialog/car-form-dialog.component';
import { CustomerService } from '../../../services/customer/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-register',
  standalone: true,
  templateUrl: './car-register.component.html',
  imports: [CommonModule, FormsModule],
  styleUrl: './car-register.component.css',
})
export class CarRegisterComponent implements OnInit {
  cars: any[] = []

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService  
  ) {}

  ngOnInit() {
    this.getCars(); 
  }

  getCars() {
    this.customerService.getAllCars().subscribe({
      next: (data) => {
        this.cars = data;
      },
      error: (err) => {
        console.error('Error fetching cars:', err);
      }
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(CarFormDialogComponent, {
      width: '800px',
      maxWidth: 'none'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getCars();
    });
  }
}
