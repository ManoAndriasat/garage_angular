import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
})
export class AppointmentFormComponent {
  formData = {
    car: '',
    date: '',
    localisation: '',
    problems: [{ name: '', details: '' }],
  };

  addProblem() {
    this.formData.problems.push({ name: '', details: '' });
  }

  submitForm() {
    console.log('Form Data:', JSON.stringify(this.formData));
  }
}
