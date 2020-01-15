import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductType } from 'app/shared/model/product-type.model';
import { ProductTypeService } from './product-type.service';
import { ProductTypeComponent } from './product-type.component';
import { ProductTypeDetailComponent } from './product-type-detail.component';
import { ProductTypeUpdateComponent } from './product-type-update.component';
import { ProductTypeDeletePopupComponent } from './product-type-delete-dialog.component';
import { IProductType } from 'app/shared/model/product-type.model';

@Injectable({ providedIn: 'root' })
export class ProductTypeResolve implements Resolve<IProductType> {
  constructor(private service: ProductTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductType> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductType>) => response.ok),
        map((productType: HttpResponse<ProductType>) => productType.body)
      );
    }
    return of(new ProductType());
  }
}

export const productTypeRoute: Routes = [
  {
    path: '',
    component: ProductTypeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProductTypeDetailComponent,
    resolve: {
      productType: ProductTypeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ProductTypeUpdateComponent,
    resolve: {
      productType: ProductTypeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductTypeUpdateComponent,
    resolve: {
      productType: ProductTypeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productType.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const productTypePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: ProductTypeDeletePopupComponent,
    resolve: {
      productType: ProductTypeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
