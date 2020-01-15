import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { MonthlyReportDetailComponent } from './monthly-report-detail.component';
import { MonthlyReportComponent } from './monthly-report.component';

export const monthlyReportRoute: Routes = [
  {
    path: 'monthly-report',
    component: MonthlyReportComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.cashup.home.monthlyReport'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'monthly-report/:id',
    component: MonthlyReportDetailComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.cashup.home.monthlyReport'
    },
    canActivate: [UserRouteAccessService]
  }
];
