import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductSold } from 'app/shared/model/product-sold.model';
import { ProductSoldService } from './product-sold.service';
import { ProductSoldComponent } from './product-sold.component';
import { ProductSoldDetailComponent } from './product-sold-detail.component';
import { ProductSoldUpdateComponent } from './product-sold-update.component';
import { ProductSoldDeletePopupComponent } from './product-sold-delete-dialog.component';
import { IProductSold } from 'app/shared/model/product-sold.model';

@Injectable({ providedIn: 'root' })
export class ProductSoldResolve implements Resolve<IProductSold> {
  constructor(private service: ProductSoldService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductSold> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductSold>) => response.ok),
        map((productSold: HttpResponse<ProductSold>) => productSold.body)
      );
    }
    return of(new ProductSold());
  }
}

export const productSoldRoute: Routes = [
  {
    path: '',
    component: ProductSoldComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.productSold.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProductSoldDetailComponent,
    resolve: {
      productSold: ProductSoldResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productSold.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ProductSoldUpdateComponent,
    resolve: {
      productSold: ProductSoldResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productSold.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductSoldUpdateComponent,
    resolve: {
      productSold: ProductSoldResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productSold.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const productSoldPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: ProductSoldDeletePopupComponent,
    resolve: {
      productSold: ProductSoldResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productSold.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
