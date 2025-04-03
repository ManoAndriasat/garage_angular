import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MechanicFormDialogComponent } from '../../../components/mechanic-form-dialog/mechanic-form-dialog.component';
import { ManagerService } from '../../../services/manager/manager.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MecanoService } from '../../../services/mecano/mecano.service';

@Component({
  selector: 'app-mechanic-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mechanic-register.component.html',
  styleUrls: ['./mechanic-register.component.css']
})
export class MechanicRegisterComponent implements OnInit {
  mechanics: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private dialog: MatDialog,
    private managerService: ManagerService,
    private mecanoService: MecanoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMechanics();
  }

  loadMechanics() {
    this.isLoading = true;
    this.mecanoService.getMechanics().subscribe({
      next: (response) => {
        this.mechanics = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching mechanics:', error);
      }
    });
  }

  openAddMechanicModal(): void {
    const dialogRef = this.dialog.open(MechanicFormDialogComponent, {
      width: '800px',
      maxWidth: 'none',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.snackBar.open('Mechanic added successfully!', 'Close', {
          duration: 3000
        });
        this.loadMechanics();
      } else if (result === 'error') {
        this.snackBar.open('Failed to add mechanic', 'Close', {
          duration: 3000
        });
      }
    });
  }

  editMechanic(mechanic: any): void {
    const dialogRef = this.dialog.open(MechanicFormDialogComponent, {
      width: '800px',
      maxWidth: 'none',
      data: { mode: 'edit', mechanic }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.snackBar.open('Mechanic updated successfully!', 'Close', {
          duration: 3000
        });
        this.loadMechanics();
      } else if (result === 'error') {
        this.snackBar.open('Failed to update mechanic', 'Close', {
          duration: 3000
        });
      }
    });
  }

  mechanicDelete(mechanicId: string): void {
    if (confirm('Are you sure you want to delete this mechanic?')) {
      this.managerService.mechanicDelete(mechanicId).subscribe({
        next: () => {
          this.snackBar.open('Mechanic deleted successfully!', 'Close', {
            duration: 3000
          });
          this.loadMechanics();
        },
        error: (err) => {
          this.snackBar.open('Failed to delete mechanic', 'Close', {
            duration: 3000
          });
          console.error('Error deleting mechanic:', err);
        }
      });
    }
  }

  getSpecialtiesAsString(specialties: string[]): string {
    return specialties.join(', ');
  }

  getWorkingHours(mechanic: any): string {
    return `${mechanic.minHour} - ${mechanic.maxHour}`;
  }
}