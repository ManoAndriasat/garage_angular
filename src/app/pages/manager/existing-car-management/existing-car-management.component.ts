import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExistingCarFormDialogComponent } from '../../../components/existing-car-form-dialog/existing-car-form-dialog.component';
import { ManagerService } from '../../../services/manager/manager.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-existing-car-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './existing-car-management.component.html',
  styleUrls: ['./existing-car-management.component.css']
})
export class ExistingCarManagementComponent implements OnInit {
  existingCars: any[] = [];
  isLoading = true;
  error: string | null = null;
  expandedBrands: { [key: string]: boolean } = {};

  constructor(
    private dialog: MatDialog,
    private managerService: ManagerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadExistingCars();
  }

  loadExistingCars() {
    this.isLoading = true;
    this.managerService.getExistingCars().subscribe({
      next: (response) => {
        this.existingCars = response.data;
        this.isLoading = false;
  
        this.existingCars.forEach((car: any) => {
          this.expandedBrands[car._id] = false;
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Failed to load existing cars';
        console.error('Error fetching existing cars:', error);
      }
    });
  }

  openAddBrandModal(): void {
    const dialogRef = this.dialog.open(ExistingCarFormDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.snackBar.open('Car brand added successfully!', 'Close', {
          duration: 3000
        });
        this.loadExistingCars();
      }
    });
  }

  openAddModelModal(car: any): void {
    const dialogRef = this.dialog.open(ExistingCarFormDialogComponent, {
      width: '600px',
      data: { mode: 'edit', car }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.snackBar.open('Model added successfully!', 'Close', {
          duration: 3000
        });
        this.loadExistingCars();
      }
    });
  }

  deleteBrand(brandId: string): void {
    if (confirm('Are you sure you want to delete this brand and all its models?')) {
      this.managerService.deleteExistingCar(brandId).subscribe({
        next: () => {
          this.snackBar.open('Brand deleted successfully!', 'Close', {
            duration: 3000
          });
          this.loadExistingCars();
        },
        error: (err) => {
          this.snackBar.open('Failed to delete brand', 'Close', {
            duration: 3000
          });
          console.error('Error deleting brand:', err);
        }
      });
    }
  }

  deleteModel(brandId: string, model: string): void {
    if (confirm(`Are you sure you want to delete the model "${model}"?`)) {
      this.managerService.deleteExistingCarModel(brandId, model).subscribe({
        next: () => {
          this.snackBar.open('Model deleted successfully!', 'Close', {
            duration: 3000
          });
          this.loadExistingCars();
        },
        error: (err) => {
          this.snackBar.open('Failed to delete model', 'Close', {
            duration: 3000
          });
          console.error('Error deleting model:', err);
        }
      });
    }
  }

  toggleBrandExpansion(brandId: string): void {
    this.expandedBrands[brandId] = !this.expandedBrands[brandId];
  }
}