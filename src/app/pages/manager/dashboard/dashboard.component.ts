import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../../../services/manager/manager.service';
import { CommonModule } from '@angular/common';
import { RevenueAnalyticsComponent } from '../../../components/revenue-analytics/revenue-analytics.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RevenueAnalyticsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  overviewData: any;
  isLoading = true;
  error: string | null = null;

  constructor(private managerService: ManagerService) {}

  ngOnInit() {
    this.loadOverviewData();
  }

  loadOverviewData() {
    this.isLoading = true;
    this.managerService.getDashboardOverview().subscribe({
      next: (data) => {
        this.overviewData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}