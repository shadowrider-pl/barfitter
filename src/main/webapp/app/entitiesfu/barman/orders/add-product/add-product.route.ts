import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { AddProductComponent } from './add-product-dialog.component';

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

export const addProductRoute: Routes = [
  {
    path: 'orders-in-room/:deskid/add-product/:id',
    component: AddProductComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

// export const addProductPopupRoute: Routes = [
//    {
//        path: 'add-product/:id',
//        component: AddProductPopupComponent,
//        data: {
//            authorities: ['ROLE_BARMAN'],
//            pageTitle: 'barfitterApp.productOrdered.home.title'
//        },
//        canActivate: [UserRouteAccessService],
//        outlet: 'popup'
//    }
// ];
