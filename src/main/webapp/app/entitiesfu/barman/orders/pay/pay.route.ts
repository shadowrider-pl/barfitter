import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { PayPopupComponent } from './pay-dialog.component';

@Injectable()
export class OrderOpenedResolvePagingParams implements Resolve<any> {
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

// export const ordersRoute: Routes = [
//    {
//        path: 'orders-in-room/:id',
//        component: OrdersComponent,
//        resolve: {
//            'pagingParams': OrderOpenedResolvePagingParams
//        },
//        data: {
//            authorities: ['ROLE_BARMAN'],
//            pageTitle: 'barfitterApp.orderOpened.home.title'
//        },
//        canActivate: [UserRouteAccessService]
//    },
//    {
//        path: 'orders',
//        component: OrdersComponent,
//        resolve: {
//            'pagingParams': OrderOpenedResolvePagingParams
//        },
//        data: {
//            authorities: ['ROLE_BARMAN'],
//            pageTitle: 'barfitterApp.orderOpened.home.title'
//        },
//        canActivate: [UserRouteAccessService]
//    }, {
//        path: 'orders-in-room/:id/orders/:id',
//        component: OrdersDetailComponent,
//        data: {
//            authorities: ['ROLE_BARMAN'],
//            pageTitle: 'barfitterApp.orderOpened.home.title'
//        },
//        canActivate: [UserRouteAccessService]
//    },    {
//        path: 'orders-in-room/:id/product-ordered-fu/:id',
//        component: ProductOrderedFUDetailComponent,
//        data: {
//            authorities: ['ROLE_BARMAN'],
//            pageTitle: 'barfitterApp.productOrdered.home.title'
//        },
//        canActivate: [UserRouteAccessService]
//    }
// ];

export const payPopupRoute: Routes = [
  {
    path: 'pay/:id',
    component: PayPopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
  //    {
  //        path: 'orders-new',
  //        component: PayPopupComponent,
  //        data: {
  //            authorities: ['ROLE_BARMAN'],
  //            pageTitle: 'barfitterApp.orderOpened.home.title'
  //        },
  //        canActivate: [UserRouteAccessService],
  //        outlet: 'popup'
  //    },
  //    {
  //        path: 'orders/:id/edit',
  //        component: PayPopupComponent,
  //        data: {
  //            authorities: ['ROLE_BARMAN'],
  //            pageTitle: 'barfitterApp.orderOpened.home.title'
  //        },
  //        canActivate: [UserRouteAccessService],
  //        outlet: 'popup'
  //    },
  //    {
  //        path: 'orders/:id/delete',
  //        component: PayPopupComponent,
  //        data: {
  //            authorities: ['ROLE_BARMAN'],
  //            pageTitle: 'barfitterApp.orderOpened.home.title'
  //        },
  //        canActivate: [UserRouteAccessService],
  //        outlet: 'popup'
  //    }
];
