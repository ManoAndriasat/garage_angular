import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialFormDialogComponent } from '../../../components/material-form-dialog/material-form-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ManagerService } from '../../../services/manager/manager.service';

@Component({
  selector: 'app-material-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './material-management.component.html',
  styleUrls: ['./material-management.component.css']
})
export class MaterialManagementComponent implements OnInit {
  materials: any[] = [];
  displayedColumns: string[] = ['ref', 'name', 'price', 'lastPrice', 'actions'];
  isLoading = true;
  error: string | null = null;

  constructor(
    private managerService: ManagerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMaterials();
  }

  loadMaterials() {
    this.isLoading = true;
    this.managerService.getMaterials().subscribe({
      next: (response) => {
        this.materials = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Failed to load materials';
        console.error('Error fetching materials:', error);
      }
    });
  }

  openAddMaterialModal(): void {
    const dialogRef = this.dialog.open(MaterialFormDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.snackBar.open('Material added successfully!', 'Close', {
          duration: 3000
        });
        this.loadMaterials();
      }
    });
  }

  openEditMaterialModal(material: any): void {
    const dialogRef = this.dialog.open(MaterialFormDialogComponent, {
      width: '600px',
      data: { mode: 'edit', material }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.snackBar.open('Material updated successfully!', 'Close', {
          duration: 3000
        });
        this.loadMaterials();
      }
    });
  }

  deleteMaterial(materialId: string): void {
    if (confirm('Are you sure you want to delete this material?')) {
      this.managerService.deleteMaterial(materialId).subscribe({
        next: () => {
          this.snackBar.open('Material deleted successfully!', 'Close', {
            duration: 3000
          });
          this.loadMaterials();
        },
        error: (err) => {
          this.snackBar.open('Failed to delete material', 'Close', {
            duration: 3000
          });
          console.error('Error deleting material:', err);
        }
      });
    }
  }
}