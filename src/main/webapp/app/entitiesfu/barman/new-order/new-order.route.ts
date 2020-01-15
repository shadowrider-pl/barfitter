import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { NewOrderComponent } from './new-order.component';

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

export const newOrderRoute: Routes = [
  {
    path: 'new-order/:id',
    component: NewOrderComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
  //    {
  //        path: 'order-opened/:id/edit',
  //        component: OrderOpenedPopupComponent,
  //        data: {
  //            authorities: ['ROLE_BARMAN'],
  //            pageTitle: 'barfitterApp.orderOpened.home.title'
  //        },
  //        canActivate: [UserRouteAccessService],
  //        outlet: 'popup'
  //    },
  //    {
  //        path: 'order-opened/:id/delete',
  //        component: OrderOpenedDeletePopupComponent,
  //        data: {
  //            authorities: ['ROLE_BARMAN'],
  //            pageTitle: 'barfitterApp.orderOpened.home.title'
  //        },
  //        canActivate: [UserRouteAccessService],
  //        outlet: 'popup'
  //    }
];
