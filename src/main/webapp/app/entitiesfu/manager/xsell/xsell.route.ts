import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { XsellComponent } from './xsell.component';
import { XsellDetailComponent } from './xsell-detail.component';
import { XsellPopupComponent } from './xsell-dialog.component';
import { XsellDeletePopupComponent } from './xsell-delete-dialog.component';

@Injectable()
export class XsellResolvePagingParams implements Resolve<any> {
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

export const xsellRoute: Routes = [
  {
    path: 'm-xsell',
    component: XsellComponent,
    resolve: {
      pagingParams: XsellResolvePagingParams
    },
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.xsell.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'm-xsell/:id',
    component: XsellDetailComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.xsell.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const xsellPopupRoute: Routes = [
  {
    path: 'm-xsell-new',
    component: XsellPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.xsell.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'm-xsell/:id/edit',
    component: XsellPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.xsell.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'm-xsell/:id/delete',
    component: XsellDeletePopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.xsell.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
