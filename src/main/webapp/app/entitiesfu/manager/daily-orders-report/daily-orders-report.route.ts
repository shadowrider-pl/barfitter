import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { TodaysOrdersProductPopupComponent } from '../../barman/todays-orders/todays-orders-product.component';
import { DailyOrdersReportComponent } from './daily-orders-report.component';
import { DailyOrdersReportPopupComponent } from './daily-orders-report-dialog.component';

export const dailyOrdersReportRoute: Routes = [
  {
    path: 'daily-orders-report',
    component: DailyOrdersReportComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.dailyOrdersReport.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const dailyOrdersReportPopupRoute: Routes = [
  {
    path: 'daily-orders-report-new',
    component: DailyOrdersReportPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.dailyOrdersReport.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'daily-orders-report/:id',
    component: DailyOrdersReportPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.dailyOrdersReport.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'daily-orders-report/product/:id',
    component: TodaysOrdersProductPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.todaysOrders.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
