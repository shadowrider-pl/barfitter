import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { CategoryComponent } from './category.component';
import { CategoryDetailComponent } from './category-detail.component';
import { CategoryPopupComponent } from './category-dialog.component';
import { CategoryDeletePopupComponent } from './category-delete-dialog.component';

@Injectable()
export class CategoryResolvePagingParams implements Resolve<any> {
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

export const categoryRoute: Routes = [
  {
    path: 'barfitter-category',
    component: CategoryComponent,
    resolve: {
      pagingParams: CategoryResolvePagingParams
    },
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.category.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'barfitter-category/:id',
    component: CategoryDetailComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.category.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const categoryPopupRoute: Routes = [
  {
    path: 'barfitter-category/:id/newsub',
    component: CategoryPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.category.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'barfitter-category-new',
    component: CategoryPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.category.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'barfitter-category/:id/edit',
    component: CategoryPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.category.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'barfitter-category/:id/delete',
    component: CategoryDeletePopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.category.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
