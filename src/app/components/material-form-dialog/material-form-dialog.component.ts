import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ManagerService } from '../../services/manager/manager.service';

@Component({
  selector: 'app-material-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './material-form-dialog.component.html',
  styleUrls: ['./material-form-dialog.component.css']
})
export class MaterialFormDialogComponent {
  materialForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<MaterialFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private managerService: ManagerService,
  ) {
    this.materialForm = this.fb.group({
      ref: [''],
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]]
    });

    if (data.mode === 'edit' && data.material) {
      this.materialForm.patchValue({
        ref: data.material.ref,
        name: data.material.name,
        price: data.material.price
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.materialForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    const formData = this.materialForm.value;

    if (this.data.mode === 'create') {
      this.managerService.createMaterial(formData).subscribe({
        next: () => {
          this.dialogRef.close('success');
        },
        error: (err) => {
          console.error('Error saving material:', err);
          this.errorMessage = this.extractErrorMessage(err);
          this.isSubmitting = false;
        }
      });
    } else {
      this.managerService.updateMaterial(this.data.material._id, formData).subscribe({
        next: () => {
          this.dialogRef.close('success');
        },
        error: (err) => {
          console.error('Error updating material:', err);
          this.errorMessage = this.extractErrorMessage(err);
          this.isSubmitting = false;
        }
      });
    }
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
    return this.materialForm.controls;
  }
}