import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductOrdered } from 'app/shared/model/product-ordered.model';
import { ProductOrderedService } from './product-ordered.service';
import { ProductOrderedComponent } from './product-ordered.component';
import { ProductOrderedDetailComponent } from './product-ordered-detail.component';
import { ProductOrderedUpdateComponent } from './product-ordered-update.component';
import { ProductOrderedDeletePopupComponent } from './product-ordered-delete-dialog.component';
import { IProductOrdered } from 'app/shared/model/product-ordered.model';

@Injectable({ providedIn: 'root' })
export class ProductOrderedResolve implements Resolve<IProductOrdered> {
  constructor(private service: ProductOrderedService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductOrdered> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductOrdered>) => response.ok),
        map((productOrdered: HttpResponse<ProductOrdered>) => productOrdered.body)
      );
    }
    return of(new ProductOrdered());
  }
}

export const productOrderedRoute: Routes = [
  {
    path: '',
    component: ProductOrderedComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ProductOrderedDetailComponent,
    resolve: {
      productOrdered: ProductOrderedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ProductOrderedUpdateComponent,
    resolve: {
      productOrdered: ProductOrderedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ProductOrderedUpdateComponent,
    resolve: {
      productOrdered: ProductOrderedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const productOrderedPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: ProductOrderedDeletePopupComponent,
    resolve: {
      productOrdered: ProductOrderedResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.productOrdered.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
