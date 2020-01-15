import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { FavoritesComponent } from './favorites.component';
import { FavoritesDetailComponent } from './favorites-detail.component';
import { FavoritesPopupComponent } from './favorites-dialog.component';
import { FavoritesDeletePopupComponent } from './favorites-delete-dialog.component';

@Injectable()
export class FavoriteResolvePagingParams implements Resolve<any> {
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

export const favoritesRoute: Routes = [
  {
    path: 'm-favorites',
    component: FavoritesComponent,
    resolve: {
      pagingParams: FavoriteResolvePagingParams
    },
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.favorite.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'm-favorites/:id',
    component: FavoritesDetailComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.favorite.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const favoritesPopupRoute: Routes = [
  {
    path: 'm-favorites-new',
    component: FavoritesPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.favorite.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'm-favorites/:id/edit',
    component: FavoritesPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.favorite.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'm-favorites/:id/delete',
    component: FavoritesDeletePopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.favorite.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
