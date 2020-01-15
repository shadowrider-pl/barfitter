import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { MPaymentComponent } from './m-payment.component';
import { PaymentDetailComponent } from './payment-detail.component';
import { PaymentPopupComponent } from './payment-dialog.component';
import { PaymentDeletePopupComponent } from './payment-delete-dialog.component';

@Injectable()
export class PaymentResolvePagingParams implements Resolve<any> {
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

export const paymentRoute: Routes = [
  {
    path: 'm-payment',
    component: MPaymentComponent,
    resolve: {
      pagingParams: PaymentResolvePagingParams
    },
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.payment.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'm-payment/:id',
    component: PaymentDetailComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.payment.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const paymentPopupRoute: Routes = [
  {
    path: 'm-payment-new',
    component: PaymentPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.payment.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'm-payment/:id/edit',
    component: PaymentPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.payment.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'm-payment/:id/delete',
    component: PaymentDeletePopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.payment.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
