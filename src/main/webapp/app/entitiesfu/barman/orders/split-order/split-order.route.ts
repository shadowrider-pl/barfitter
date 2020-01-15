import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { SplitOrderComponent } from './split-order.component';

export const splitOrderRoute: Routes = [
  {
    path: 'orders-in-room/:id/split-order/:id',
    component: SplitOrderComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
