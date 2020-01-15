import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrderClosed } from 'app/shared/model/order-closed.model';
import { OrderClosedService } from './order-closed.service';
import { OrderClosedComponent } from './order-closed.component';
import { OrderClosedDetailComponent } from './order-closed-detail.component';
import { OrderClosedUpdateComponent } from './order-closed-update.component';
import { OrderClosedDeletePopupComponent } from './order-closed-delete-dialog.component';
import { IOrderClosed } from 'app/shared/model/order-closed.model';

@Injectable({ providedIn: 'root' })
export class OrderClosedResolve implements Resolve<IOrderClosed> {
  constructor(private service: OrderClosedService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOrderClosed> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<OrderClosed>) => response.ok),
        map((orderClosed: HttpResponse<OrderClosed>) => orderClosed.body)
      );
    }
    return of(new OrderClosed());
  }
}

export const orderClosedRoute: Routes = [
  {
    path: '',
    component: OrderClosedComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.orderClosed.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OrderClosedDetailComponent,
    resolve: {
      orderClosed: OrderClosedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderClosed.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OrderClosedUpdateComponent,
    resolve: {
      orderClosed: OrderClosedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderClosed.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OrderClosedUpdateComponent,
    resolve: {
      orderClosed: OrderClosedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderClosed.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const orderClosedPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: OrderClosedDeletePopupComponent,
    resolve: {
      orderClosed: OrderClosedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderClosed.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
