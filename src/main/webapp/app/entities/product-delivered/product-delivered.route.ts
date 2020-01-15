import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductDelivered } from 'app/shared/model/product-delivered.model';
import { ProductDeliveredService } from './product-delivered.service';
import { ProductDeliveredComponent } from './product-delivered.component';
import { ProductDeliveredDetailComponent } from './product-delivered-detail.component';
import { ProductDeliveredUpdateComponent } from './product-delivered-update.component';
import { ProductDeliveredDeletePopupComponent } from './product-delivered-delete-dialog.component';
import { IProductDelivered } from 'app/shared/model/product-delivered.model';

@Injectable({ providedIn: 'root' })
export class ProductDeliveredResolve implements Resolve<IProductDelivered> {
  constructor(private service: ProductDeliveredService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductDelivered> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductDelivered>) => response.ok),
        map((productDelivered: HttpResponse<ProductDelivered>) => productDelivered.body)
      );
    }
    return of(new ProductDelivered());
  }
}

export const productDeliveredRoute: Routes = [
  {
    path: '',
    component: ProductDeliveredComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.productDelivered.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProductDeliveredDetailComponent,
    resolve: {
      productDelivered: ProductDeliveredResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productDelivered.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ProductDeliveredUpdateComponent,
    resolve: {
      productDelivered: ProductDeliveredResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productDelivered.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductDeliveredUpdateComponent,
    resolve: {
      productDelivered: ProductDeliveredResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productDelivered.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const productDeliveredPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: ProductDeliveredDeletePopupComponent,
    resolve: {
      productDelivered: ProductDeliveredResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productDelivered.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
