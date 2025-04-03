import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ManagerService } from '../../services/manager/manager.service';
import { MecanoService } from '../../services/mecano/mecano.service';
import { Subject, merge } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

interface Mechanic {
  _id: string;
  firstname: string;
  lastname: string;
}

@Component({
  selector: 'app-revenue-analytics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseChartDirective
  ],
  templateUrl: './revenue-analytics.component.html',
  styleUrls: ['./revenue-analytics.component.css']
})
export class RevenueAnalyticsComponent implements OnInit, OnDestroy {
  mechanics: Mechanic[] = [];
  selectedMechanic = new FormControl('');
  selectedView = new FormControl<'year' | 'month'>('year');
  selectedYear = new FormControl(new Date().getFullYear().toString());
  
  isLoading = false;
  error: string | null = null;
  
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Période'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (Ar)'
        },
        beginAtZero: true
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y.toLocaleString()} Ar`;
          }
        }
      }
    }
  };
  
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Revenue',
      backgroundColor: '#4f46e5',
      hoverBackgroundColor: '#6366f1'
    }]
  };

  private destroy$ = new Subject<void>();

  constructor(private managerService: ManagerService, private mecanoService: MecanoService) {}

  ngOnInit(): void {
    this.loadMechanics();
    
    merge(
      this.selectedMechanic.valueChanges,
      this.selectedYear.valueChanges.pipe(filter(() => this.selectedView.value === 'month')),
      this.selectedView.valueChanges
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadRevenueData());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMechanics(): void {
    this.isLoading = true;
    this.mecanoService.getMechanics().subscribe({
      next: (mechanics: any) => {
        this.mechanics = mechanics.map((m: any) => ({
          _id: m._id,
          firstname: m.firstname,
          lastname: m.lastname
        }));
        if (this.mechanics.length > 0) {
          this.selectedMechanic.setValue(this.mechanics[0]._id);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load mechanics';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({length: 5}, (_, i) => currentYear - i);
  }

  loadRevenueData(): void {
    if (!this.selectedMechanic.value) return;

    this.error = null;
    this.isLoading = true;
    const params: any = { mechanicId: this.selectedMechanic.value };
    
    if (this.selectedView.value === 'month' && this.selectedYear.value) {
      params.year = this.selectedYear.value;
    }

    this.managerService.getMechanicRevenue(params).subscribe({
      next: (data: any) => {
        if (this.selectedView.value === 'year') {
          this.updateYearChart(data.yearlyRevenue);
        } else {
          this.updateMonthChart(data.monthlyRevenue, data.year);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load revenue data';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  updateYearChart(yearlyRevenue: { [year: number]: number }): void {
    const years = Object.keys(yearlyRevenue).sort();
    const revenues = years.map(year => yearlyRevenue[parseInt(year)]);

    this.barChartData = {
      labels: years,
      datasets: [{
        data: revenues,
        label: 'Revenue annuel',
        backgroundColor: '#4f46e5',
        hoverBackgroundColor: '#6366f1'
      }]
    };
  }

  updateMonthChart(monthlyRevenue: { [month: number]: number }, year: number): void {
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const revenues = Array(12).fill(0).map((_, i) => monthlyRevenue[i+1] || 0);

    this.barChartData = {
      labels: monthNames,
      datasets: [{
        data: revenues,
        label: `Revenue mensuel ${year}`,
        backgroundColor: '#4f46e5',
        hoverBackgroundColor: '#6366f1'
      }]
    };
  }
}