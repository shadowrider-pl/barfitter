import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrderedProductStatus } from 'app/shared/model/ordered-product-status.model';
import { OrderedProductStatusService } from './ordered-product-status.service';
import { OrderedProductStatusComponent } from './ordered-product-status.component';
import { OrderedProductStatusDetailComponent } from './ordered-product-status-detail.component';
import { OrderedProductStatusUpdateComponent } from './ordered-product-status-update.component';
import { OrderedProductStatusDeletePopupComponent } from './ordered-product-status-delete-dialog.component';
import { IOrderedProductStatus } from 'app/shared/model/ordered-product-status.model';

@Injectable({ providedIn: 'root' })
export class OrderedProductStatusResolve implements Resolve<IOrderedProductStatus> {
  constructor(private service: OrderedProductStatusService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOrderedProductStatus> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<OrderedProductStatus>) => response.ok),
        map((orderedProductStatus: HttpResponse<OrderedProductStatus>) => orderedProductStatus.body)
      );
    }
    return of(new OrderedProductStatus());
  }
}

export const orderedProductStatusRoute: Routes = [
  {
    path: '',
    component: OrderedProductStatusComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderedProductStatus.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OrderedProductStatusDetailComponent,
    resolve: {
      orderedProductStatus: OrderedProductStatusResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderedProductStatus.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OrderedProductStatusUpdateComponent,
    resolve: {
      orderedProductStatus: OrderedProductStatusResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderedProductStatus.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OrderedProductStatusUpdateComponent,
    resolve: {
      orderedProductStatus: OrderedProductStatusResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderedProductStatus.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const orderedProductStatusPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: OrderedProductStatusDeletePopupComponent,
    resolve: {
      orderedProductStatus: OrderedProductStatusResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.orderedProductStatus.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
