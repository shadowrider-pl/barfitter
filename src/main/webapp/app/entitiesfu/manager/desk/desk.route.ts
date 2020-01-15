import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { DeskComponent } from './desk.component';
import { DeskDetailComponent } from './desk-detail.component';
import { DeskPopupComponent } from './desk-dialog.component';
import { DeskDeletePopupComponent } from './desk-delete-dialog.component';

@Injectable()
export class DeskResolvePagingParams implements Resolve<any> {
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

export const deskRoute: Routes = [
  {
    path: 'barfitter-desk',
    component: DeskComponent,
    resolve: {
      pagingParams: DeskResolvePagingParams
    },
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.desk.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'barfitter-desk/:id',
    component: DeskDetailComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.desk.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const deskPopupRoute: Routes = [
  {
    path: 'barfitter-desk-new',
    component: DeskPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.desk.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'barfitter-desk/:id/edit',
    component: DeskPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.desk.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'barfitter-desk/:id/delete',
    component: DeskDeletePopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.desk.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
