import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductOnStock } from 'app/shared/model/product-on-stock.model';
import { ProductOnStockService } from './product-on-stock.service';
import { ProductOnStockComponent } from './product-on-stock.component';
import { ProductOnStockDetailComponent } from './product-on-stock-detail.component';
import { ProductOnStockUpdateComponent } from './product-on-stock-update.component';
import { ProductOnStockDeletePopupComponent } from './product-on-stock-delete-dialog.component';
import { IProductOnStock } from 'app/shared/model/product-on-stock.model';

@Injectable({ providedIn: 'root' })
export class ProductOnStockResolve implements Resolve<IProductOnStock> {
  constructor(private service: ProductOnStockService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductOnStock> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductOnStock>) => response.ok),
        map((productOnStock: HttpResponse<ProductOnStock>) => productOnStock.body)
      );
    }
    return of(new ProductOnStock());
  }
}

export const productOnStockRoute: Routes = [
  {
    path: '',
    component: ProductOnStockComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.productOnStock.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProductOnStockDetailComponent,
    resolve: {
      productOnStock: ProductOnStockResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productOnStock.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ProductOnStockUpdateComponent,
    resolve: {
      productOnStock: ProductOnStockResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productOnStock.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductOnStockUpdateComponent,
    resolve: {
      productOnStock: ProductOnStockResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productOnStock.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const productOnStockPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: ProductOnStockDeletePopupComponent,
    resolve: {
      productOnStock: ProductOnStockResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productOnStock.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
