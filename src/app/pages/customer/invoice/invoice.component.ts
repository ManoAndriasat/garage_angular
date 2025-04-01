
import { CustomerService } from '../../../services/customer/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoices: any[] = [];
  isLoading = false;
  error: string | null = null;
  selectedCar: string | null = null;
  cars: any[] = [];

  constructor(
    private CustomerService: CustomerService,
    private customerService: CustomerService // Inject CustomerService
  ) { }

  ngOnInit(): void {
    this.loadCars(); // Load cars first
    this.loadInvoices();
  }

  loadCars(): void {
    this.customerService.getAllCars().subscribe({
      next: (response) => {
        this.cars = response;
      },
      error: (error) => {
        console.error('Error fetching cars:', error);
      }
    });
  }

  loadInvoices(): void {
    this.isLoading = true;
    this.error = null;

    this.CustomerService.getClientInvoices(this.selectedCar || undefined)
      .subscribe({
        next: (invoices) => {
          this.invoices = invoices;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load invoices';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  onCarFilterChange(): void {
    this.loadInvoices();
  }

  downloadInvoice(invoiceId: string): void {
    this.CustomerService.downloadInvoicePDF(invoiceId)
      .subscribe({
        next: (pdfBlob) => {
          saveAs(pdfBlob, `invoice_${invoiceId}.pdf`);
        },
        error: (err) => {
          this.error = 'Failed to download invoice';
          console.error(err);
        }
      });
  }
}