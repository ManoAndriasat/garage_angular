import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ManagerService } from '../../services/manager/manager.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-existing-car-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './existing-car-form-dialog.component.html',
  styleUrls: ['./existing-car-form-dialog.component.css']
})
export class ExistingCarFormDialogComponent {
  carForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<ExistingCarFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private managerService: ManagerService,
  ) {
    this.carForm = this.fb.group({
      brand: ['', data.mode === 'create' ? [Validators.required] : null],
      model: ['', [Validators.required]]
    });

    if (data.mode === 'edit' && data.car) {
      this.carForm.patchValue({
        brand: data.car.brand
      });
      this.carForm.get('brand')?.disable();
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.carForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    const formData = this.carForm.value;
    formData.brand = formData.brand || this.data.car?.brand;

    const operation = this.data.mode === 'create'
      ? this.managerService.createExistingCar({
          brand: formData.brand,
          model: formData.model.split(',').map((m: string) => m.trim())
        })
      : this.managerService.updateExistingCar(this.data.car._id, {
          $push: { model: formData.model }
        });

    operation.subscribe({
      next: () => {
        this.dialogRef.close('success');
      },
      error: (err) => {
        console.error('Error saving car:', err);
        this.errorMessage = this.extractErrorMessage(err);
        this.isSubmitting = false;
      }
    });
  }

  private extractErrorMessage(err: any): string {
    if (err.error?.message) {
      return err.error.message;
    }
    if (err.error?.errors) {
      return Object.values(err.error.errors).join(', ');
    }
    return 'An unexpected error occurred. Please try again.';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get f() {
    return this.carForm.controls;
  }
}