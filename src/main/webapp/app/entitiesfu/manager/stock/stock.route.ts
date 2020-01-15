import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { StockComponent } from './stock.component';
import { StockPopupComponent } from './stock-dialog.component';
import { StockDeletePopupComponent } from './stock-delete-dialog.component';
import { StockDeleteOutOfStockPopupComponent } from './stock-delete-out-of-stock-dialog.component';

export const stockRoute: Routes = [
  {
    path: 'stock',
    component: StockComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.stock.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const stockPopupRoute: Routes = [
  {
    path: 'stock/:id/edit',
    component: StockPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.stock.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'stock/:id/delete',
    component: StockDeletePopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.stock.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'stock/out-of-stock/:id/delete',
    component: StockDeleteOutOfStockPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.stock.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'out-of-stock/:id/edit',
    component: StockPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.stock.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'out-of-stock/:id/delete',
    component: StockDeletePopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.stock.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
