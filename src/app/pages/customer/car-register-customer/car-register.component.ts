import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarFormDialogComponent } from '../../../components/car-form-dialog/car-form-dialog.component';

@Component({
  selector: 'app-car-register',
  standalone: true,
  templateUrl: './car-register.component.html',
  styleUrl: './car-register.component.css',
})
export class CarRegisterComponent {
  cars: any[] = [];

  constructor(private dialog: MatDialog) {}

  openModal() {
    const dialogRef = this.dialog.open(CarFormDialogComponent, {
      width: '800px',
      maxWidth: 'none'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Registered Car:", result);
        this.cars.push(result);
      }
    });
  }
}
