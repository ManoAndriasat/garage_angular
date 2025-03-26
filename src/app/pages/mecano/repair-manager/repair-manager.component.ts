import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { LoginMecanoService } from '../../../services/mecano/login-mecano.service';

@Component({
  selector: 'app-repair-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './repair-manager.component.html',
  styleUrls: ['./repair-manager.component.css']
})
export class RepairManagerComponent {
  formData = {
    car_id: '',
    mechanic_id: '',
    reparation: [{
      type: '',
      material: '',
      description: '',
      start: '',
      end: ''
    }]
  };

  constructor(
    private MechanicService: LoginMecanoService,
    private authService: AuthService
  ) {}

  addReparation() {
    this.formData.reparation.push({
      type: '',
      material: '',
      description: '',
      start: '',
      end: ''
    });
  }

  removeReparation(index: number) {
    if (this.formData.reparation.length > 1) {
      this.formData.reparation.splice(index, 1);
    }
  }

  submitForm() {
    // Prepare the payload
    const repairData = {
      owner_id: this.authService.getId(),
      car_id: this.formData.car_id,
      mechanic_id: this.formData.mechanic_id,
      reparation: this.formData.reparation.map(item => ({
        ...item,
        status: {
          mechanic: true,
          user: false
        }
      }))
    };

    console.log('Creating repair:', repairData);

    this.MechanicService.createRepair(repairData).subscribe({
      next: (response) => {
        console.log('Repair created successfully:', response);
        // Reset form or navigate away
        this.formData = {
          car_id: '',
          mechanic_id: '',
          reparation: [{
            type: '',
            material: '',
            description: '',
            start: '',
            end: ''
          }]
        };
      },
      error: (error) => {
        console.error('Error creating repair:', error);
      }
    });
  }
}