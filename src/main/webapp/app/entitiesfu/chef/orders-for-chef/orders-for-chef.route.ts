import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { OrdersForChefDetailComponent } from './orders-for-chef-detail.component';

export const ordersForChefRoute: Routes = [
  {
    path: 'orders-for-chef/:id',
    component: OrdersForChefDetailComponent,
    data: {
      authorities: ['ROLE_CHEF'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
