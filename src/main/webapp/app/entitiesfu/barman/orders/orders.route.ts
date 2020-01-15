import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { OrdersComponent } from './orders.component';
import { OrdersDetailComponent } from './orders-detail.component';
import { OrdersPopupComponent } from './orders-dialog.component';
import { OrdersDeletePopupComponent } from './orders-delete-dialog.component';
import { ProductOrderedFUDetailComponent } from './product-ordered-fu/product-ordered-fu-detail.component';
import { ProductOrderedFUPopupComponent } from './product-ordered-fu/product-ordered-fu-dialog.component';

@Injectable()
export class OrderOpenedResolvePagingParams implements Resolve<any> {
  constructor(private paginationUtil: JhiPaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
    const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
    return {
      page: this.paginationUtil.parsePage(page),
      predicate: this.paginationUtil.parsePredicate(sort),
      ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

export const ordersRoute: Routes = [
  {
    path: 'orders-in-room/:id',
    component: OrdersComponent,
    resolve: {
      pagingParams: OrderOpenedResolvePagingParams
    },
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'orders',
    component: OrdersComponent,
    resolve: {
      pagingParams: OrderOpenedResolvePagingParams
    },
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'orders-in-room/:id/orders/:id',
    component: OrdersDetailComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'orders-in-room/:id/product-ordered-fu/:id',
    component: ProductOrderedFUDetailComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const ordersPopupRoute: Routes = [
  {
    path: 'orders-in-room/:id/product-ordered-fu/:id/edit',
    component: ProductOrderedFUPopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'orders-new',
    component: OrdersPopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'orders/:id/edit',
    component: OrdersPopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'orders/:id/delete',
    component: OrdersDeletePopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
