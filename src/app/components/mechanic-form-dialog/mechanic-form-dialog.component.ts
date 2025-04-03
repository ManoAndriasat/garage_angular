import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ManagerService } from '../../services/manager/manager.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mechanic-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mechanic-form-dialog.component.html',
  styleUrls: ['./mechanic-form-dialog.component.css']
})
export class MechanicFormDialogComponent {
  mechanicForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  submitted = false;
  specialties = [
    'Engine Repair',
    'Transmission',
    'Electrical Systems',
    'Brakes',
    'Suspension',
    'Diagnostics',
    'AC Repair',
    'General Maintenance'
  ];

  workingHours = Array.from({ length: 24 }, (_, i) => {
    const hour = i < 10 ? `0${i}` : `${i}`;
    return [`${hour}:00`, `${hour}:30`];
  }).flat();

  constructor(
    public dialogRef: MatDialogRef<MechanicFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private managerService: ManagerService,
  ) {
    this.mechanicForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', data.mode === 'create' ? [
        Validators.required
      ] : null],
      speciality: [[], [Validators.required, Validators.minLength(1)]],
      minHour: ['08:00', Validators.required],
      maxHour: ['17:00', Validators.required]
    });

    if (data.mode === 'edit' && data.mechanic) {
      this.mechanicForm.patchValue(data.mechanic);
      this.mechanicForm.get('password')?.clearValidators();
      this.mechanicForm.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.mechanicForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    if (!this.validateWorkingHours()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    const formData = this.mechanicForm.value;

    const operation = this.data.mode === 'create'
      ? this.managerService.mechanicRegister(formData)
      : this.managerService.mechanicUpdate(this.data.mechanic._id, formData);

    operation.subscribe({
      next: () => {
        this.dialogRef.close('success');
      },
      error: (err) => {
        console.error('Error saving mechanic:', err);
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

  toggleSpecialty(specialty: string): void {
    const specialties = this.mechanicForm.get('speciality')?.value as string[];
    const index = specialties.indexOf(specialty);

    if (index >= 0) {
      specialties.splice(index, 1);
    } else {
      specialties.push(specialty);
    }

    this.mechanicForm.get('speciality')?.setValue([...specialties]);
  }

  validateWorkingHours(): boolean {
    const minHour = this.mechanicForm.get('minHour')?.value;
    const maxHour = this.mechanicForm.get('maxHour')?.value;
    
    if (minHour && maxHour && minHour >= maxHour) {
      this.errorMessage = 'End time must be after start time';
      return false;
    }
    return true;
  }

  get f() {
    return this.mechanicForm.controls;
  }
}