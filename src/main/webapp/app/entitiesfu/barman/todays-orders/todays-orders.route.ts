import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { TodaysOrdersComponent } from './todays-orders.component';
import { TodaysOrdersDetailComponent } from './todays-orders-detail.component';
import { TodaysOrdersPopupComponent } from './todays-orders-dialog.component';
import { TodaysOrdersProductPopupComponent } from './todays-orders-product.component';

export const todaysOrdersRoute: Routes = [
  {
    path: 'todays-orders',
    component: TodaysOrdersComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.todaysOrders.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const todaysOrdersPopupRoute: Routes = [
  {
    path: 'todays-orders/product/:id',
    component: TodaysOrdersProductPopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.todaysOrders.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'todays-orders/:id',
    component: TodaysOrdersPopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.todaysOrders.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
