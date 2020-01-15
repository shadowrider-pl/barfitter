import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { ProductDeliveredComponent } from './authorization.component';

@Injectable()
export class ProductDeliveredResolvePagingParams implements Resolve<any> {
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

export const productDeliveredRoute: Routes = [
  {
    path: 'authorization',
    component: ProductDeliveredComponent,
    resolve: {
      pagingParams: ProductDeliveredResolvePagingParams
    },
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'barfitterApp.productDelivered.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
