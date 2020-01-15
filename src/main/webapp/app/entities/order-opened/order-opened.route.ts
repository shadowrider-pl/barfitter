import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrderOpened } from 'app/shared/model/order-opened.model';
import { OrderOpenedService } from './order-opened.service';
import { OrderOpenedComponent } from './order-opened.component';
import { OrderOpenedDetailComponent } from './order-opened-detail.component';
import { OrderOpenedUpdateComponent } from './order-opened-update.component';
import { OrderOpenedDeletePopupComponent } from './order-opened-delete-dialog.component';
import { IOrderOpened } from 'app/shared/model/order-opened.model';

@Injectable({ providedIn: 'root' })
export class OrderOpenedResolve implements Resolve<IOrderOpened> {
  constructor(private service: OrderOpenedService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOrderOpened> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<OrderOpened>) => response.ok),
        map((orderOpened: HttpResponse<OrderOpened>) => orderOpened.body)
      );
    }
    return of(new OrderOpened());
  }
}

export const orderOpenedRoute: Routes = [
  {
    path: '',
    component: OrderOpenedComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OrderOpenedDetailComponent,
    resolve: {
      orderOpened: OrderOpenedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OrderOpenedUpdateComponent,
    resolve: {
      orderOpened: OrderOpenedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OrderOpenedUpdateComponent,
    resolve: {
      orderOpened: OrderOpenedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const orderOpenedPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: OrderOpenedDeletePopupComponent,
    resolve: {
      orderOpened: OrderOpenedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
