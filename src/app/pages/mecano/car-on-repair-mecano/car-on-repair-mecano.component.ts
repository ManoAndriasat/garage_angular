import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MecanoService } from '../../../services/mecano/mecano.service';
import { ManagerService } from '../../../services/manager/manager.service';

@Component({
  selector: 'app-car-on-repair-mecano',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-on-repair-mecano.component.html',
  styleUrls: ['./car-on-repair-mecano.component.css']
})
export class CarOnRepairMecanoComponent implements OnInit {
  repairs: any[] = [];
  isLoading = true;
  error: string | null = null;
  showAddModal = false;
  isSubmitting = false;
  selectedRepairId: string | null = null;
  materials: any[] = [];

  newReparation = {
    type: '',
    description: '',
    start: this.formatDateTimeLocal(new Date()),
    end: '',
    material: '',
    price: 0
  };

  showEditModal = false;
  selectedReparationIndex: number | null = null;
  reparationUpdate = {
    type: '',
    description: '',
    start: '',
    end: '',
    material: '',
    price: 0,
    isSubmitting: false
  };
  constructor(private mecanoService: MecanoService, private managerService: ManagerService) {}

  ngOnInit(): void {
    this.loadRepairs();
    this.loadMaterials();
  }

  onTypeChange() {
    if (this.newReparation.type !== 'Replacement') {
      this.newReparation.material = '';
      this.newReparation.price = 0;
    }
  }
  
  onMaterialChange() {
    if (this.newReparation.type === 'Replacement' && this.newReparation.material) {
      const selectedMaterial = this.materials.find(m => m.ref === this.newReparation.material);
      if (selectedMaterial) {
        this.newReparation.price = selectedMaterial.price;
      }
    }
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


  loadRepairs(): void {
    this.isLoading = true;
    this.error = null;

    this.mecanoService.getOngoingRepairs().subscribe({
      next: (repairs) => {
        this.repairs = repairs;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load repair data';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  openAddModal(repairId: string): void {
    this.selectedRepairId = repairId;
    this.showAddModal = true;
  }

  addReparation(): void {
    if (!this.selectedRepairId || this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = null;

    this.mecanoService.addReparation(
      this.selectedRepairId,
      this.newReparation.type,
      this.newReparation.description,
      this.newReparation.start,
      this.newReparation.end,
      this.newReparation.material,
      this.newReparation.price
    ).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.repairs.findIndex(r => r._id === this.selectedRepairId);
          if (index !== -1) {
            this.repairs[index] = response.data;
          }
          this.resetForm();
          this.showAddModal = false;
          this.selectedRepairId = null;
        } else {
          this.error = response.message || 'Failed to add reparation';
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to add reparation';
        this.isSubmitting = false;
        console.error(err);
        console.log(this.newReparation);
      }
    });
  }

  resetForm(): void {
    this.newReparation = {
      type: '',
      description: '',
      start: this.formatDateTimeLocal(new Date()),
      end: '',
      material: '',
      price: 0
    };
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

  private formatDateTimeLocal(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  openEditModal(index: number): void {
    this.selectedReparationIndex = index;
    const rep = this.repairs[0].reparation[index];
    this.reparationUpdate = {
      type: rep.type,
      description: rep.description,
      start: rep.start,
      end: rep.end,
      material: rep.material || '',
      price: rep.price,
      isSubmitting: false
    };
    this.showEditModal = true;
  }

  updateReparation(): void {
    if (this.selectedReparationIndex === null || this.reparationUpdate.isSubmitting) return;

    this.reparationUpdate.isSubmitting = true;
    this.error = null;

    // Prepare updates object with only changed fields
    const currentRep = this.repairs[0].reparation[this.selectedReparationIndex];
    const updates: any = {};

    if (this.reparationUpdate.type !== currentRep.type) updates.type = this.reparationUpdate.type;
    if (this.reparationUpdate.description !== currentRep.description) updates.description = this.reparationUpdate.description;
    if (this.reparationUpdate.start !== currentRep.start) updates.start = this.reparationUpdate.start;
    if (this.reparationUpdate.end !== currentRep.end) updates.end = this.reparationUpdate.end;
    if (this.reparationUpdate.material !== currentRep.material) updates.material = this.reparationUpdate.material;
    if (this.reparationUpdate.price !== currentRep.price) updates.price = this.reparationUpdate.price;

    this.mecanoService.updateReparation(
      this.repairs[0]._id,
      this.selectedReparationIndex,
      updates
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.repairs[0] = response.data;
          this.showEditModal = false;
        } else {
          this.error = response.message || 'Failed to update reparation';
        }
        this.reparationUpdate.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update reparation';
        this.reparationUpdate.isSubmitting = false;
      }
    });
  }

  finishAsMechanic(repairId: string): void {
    if (!repairId) return;
  
    this.isSubmitting = true;
    this.error = null;
  
    this.mecanoService.finishAsMechanic(repairId).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        const index = this.repairs.findIndex(r => r._id === repairId);
        if (index !== -1) {
          this.repairs[index] = response;
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err.error?.message || 'Failed to mark as finished';
        console.error(err);
      }
    });
  }

  isWaitingForCustomer(repair: any): boolean {
    return repair.isfinished?.mechanic && !repair.isfinished?.user;
  }
}