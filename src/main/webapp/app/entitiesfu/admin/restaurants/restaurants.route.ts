import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { RestaurantsDeletePopupComponent } from './';
import { RestaurantsComponent } from './restaurants.component';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

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

export const restaurantsRoute: Routes = [
  {
    path: 'admin/restaurants',
    component: RestaurantsComponent,
    resolve: {
      //            'pagingParams': CategoryResolvePagingParams
    },
    data: {
      authorities: ['ROLE_MANAGER'],
      pageTitle: 'barfitterApp.category.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const restaurantsPopupRoute: Routes = [
  {
    path: 'admin/restaurants/:id/delete',
    component: RestaurantsDeletePopupComponent,
    data: {
      authorities: ['ROLE_MANAGER'],
      pageTitle: 'barfitterApp.category.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
