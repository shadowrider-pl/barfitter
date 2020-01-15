import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { ProductOrderedFUDetailComponent } from './product-ordered-fu-detail.component';
import { ProductOrderedFUPopupComponent } from './product-ordered-fu-dialog.component';
import { ProductOrderedFUDeletePopupComponent } from './product-ordered-fu-delete-dialog.component';

@Injectable()
export class ProductOrderedResolvePagingParams implements Resolve<any> {
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

export const productOrderedRoute: Routes = [
  //    {
  //        path: 'product-ordered',
  //        component: ProductOrderedComponent,
  //        resolve: {
  //            'pagingParams': ProductOrderedResolvePagingParams
  //        },
  //        data: {
  //            authorities: ['ROLE_BARMAN'],
  //            pageTitle: 'barfitterApp.productOrdered.home.title'
  //        },
  //        canActivate: [UserRouteAccessService]
  //    },
  {
    path: 'orders-in-room/:id/orders/:id/product-ordered-fu/:id',
    component: ProductOrderedFUDetailComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const productOrderedPopupRoute: Routes = [
  {
    path: 'product-ordered-fu-new',
    component: ProductOrderedFUPopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'product-ordered-fu/:id/edit',
    component: ProductOrderedFUPopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'product-ordered-fu/:id/delete',
    component: ProductOrderedFUDeletePopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
