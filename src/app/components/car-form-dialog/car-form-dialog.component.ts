import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-form-dialog.component.html',
  styleUrl: './car-form-dialog.component.css',
})
export class CarFormDialogComponent {
  carData = {
    brand: '',
    model: '',
    year: null,
    plate: '',
  };

  constructor(private dialogRef: MatDialogRef<CarFormDialogComponent>) {}

  submitForm() {
    console.log("Form Data:", this.carData);
    this.dialogRef.close(this.carData);
  }

  close() {
    this.dialogRef.close();
  }
}
