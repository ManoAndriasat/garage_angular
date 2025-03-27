import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vin-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vin-details.component.html',
  styleUrls: ['./vin-details.component.css']
})
export class VinDetailsComponent implements OnInit {
  @Input() vin: string = '';
  @Output() loadingStateChange = new EventEmitter<boolean>();
  
  vinDetails: any = null;
  isLoading = false;
  error: string | null = null;
  showDetails = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    if (this.showDetails && this.vin) {
      this.toggleVinDetails();
    }
  }

  toggleVinDetails() {
    if (this.showDetails) {
      this.showDetails = false;
      return;
    }

    this.isLoading = true;
    this.loadingStateChange.emit(true);
    this.error = null;
    
    this.fetchCarDetailsByVin(this.vin).subscribe(
      (response: any) => {
        if (response.Results && response.Results.length > 0 && Object.keys(response.Results[0]).length > 1) {
          this.vinDetails = response.Results[0];
          this.showDetails = true;
        } else {
          this.error = 'No details found for this VIN';
        }
        this.isLoading = false;
        this.loadingStateChange.emit(false);
      },
      (error) => {
        console.error('Error fetching VIN details:', error);
        this.error = 'Error fetching VIN details';
        this.isLoading = false;
        this.loadingStateChange.emit(false);
      }
    );
  }

  getCarDetailsAsArray(): { label: string, value: string }[] {
    if (!this.vinDetails) return [];
    
    return Object.keys(this.vinDetails)
      .filter(key => key !== 'VIN')
      .map(key => ({
        label: key.split(/(?=[A-Z])/).join(' ').toUpperCase(), 
        value: this.vinDetails[key]
      }));
  }

  private fetchCarDetailsByVin(vin: string): Observable<any> {
    const vinDecodedUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`;
    return this.http.get(vinDecodedUrl).pipe(
      map((response: any) => {
        if (response.Results && response.Results.length > 0) {
          const filteredResult = Object.fromEntries(
            Object.entries(response.Results[0]).filter(([key, value]) => value !== "")
          );
          response.Results[0] = filteredResult;
        }
        return response;
      })
    );
  }
}