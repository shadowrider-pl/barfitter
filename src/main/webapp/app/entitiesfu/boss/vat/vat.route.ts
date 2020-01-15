import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { VatComponent } from './vat.component';
import { VatDetailComponent } from './vat-detail.component';
import { VatPopupComponent } from './vat-dialog.component';
import { VatDeletePopupComponent } from './vat-delete-dialog.component';

@Injectable()
export class VatResolvePagingParams implements Resolve<any> {
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

export const vatRoute: Routes = [
  {
    path: 'barfitter-vat',
    component: VatComponent,
    resolve: {
      pagingParams: VatResolvePagingParams
    },
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'barfitter-vat/:id',
    component: VatDetailComponent,
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const vatPopupRoute: Routes = [
  {
    path: 'barfitter-vat-new',
    component: VatPopupComponent,
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'barfitter-vat/:id/edit',
    component: VatPopupComponent,
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'barfitter-vat/:id/delete',
    component: VatDeletePopupComponent,
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
