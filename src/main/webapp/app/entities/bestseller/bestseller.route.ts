import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Bestseller } from 'app/shared/model/bestseller.model';
import { BestsellerService } from './bestseller.service';
import { BestsellerComponent } from './bestseller.component';
import { BestsellerDetailComponent } from './bestseller-detail.component';
import { BestsellerUpdateComponent } from './bestseller-update.component';
import { BestsellerDeletePopupComponent } from './bestseller-delete-dialog.component';
import { IBestseller } from 'app/shared/model/bestseller.model';

@Injectable({ providedIn: 'root' })
export class BestsellerResolve implements Resolve<IBestseller> {
  constructor(private service: BestsellerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IBestseller> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Bestseller>) => response.ok),
        map((bestseller: HttpResponse<Bestseller>) => bestseller.body)
      );
    }
    return of(new Bestseller());
  }
}

export const bestsellerRoute: Routes = [
  {
    path: '',
    component: BestsellerComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.bestseller.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: BestsellerDetailComponent,
    resolve: {
      bestseller: BestsellerResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.bestseller.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: BestsellerUpdateComponent,
    resolve: {
      bestseller: BestsellerResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.bestseller.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: BestsellerUpdateComponent,
    resolve: {
      bestseller: BestsellerResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.bestseller.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const bestsellerPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: BestsellerDeletePopupComponent,
    resolve: {
      bestseller: BestsellerResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.bestseller.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
