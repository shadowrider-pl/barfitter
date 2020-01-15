import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Xsell } from 'app/shared/model/xsell.model';
import { XsellService } from './xsell.service';
import { XsellComponent } from './xsell.component';
import { XsellDetailComponent } from './xsell-detail.component';
import { XsellUpdateComponent } from './xsell-update.component';
import { XsellDeletePopupComponent } from './xsell-delete-dialog.component';
import { IXsell } from 'app/shared/model/xsell.model';

@Injectable({ providedIn: 'root' })
export class XsellResolve implements Resolve<IXsell> {
  constructor(private service: XsellService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IXsell> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Xsell>) => response.ok),
        map((xsell: HttpResponse<Xsell>) => xsell.body)
      );
    }
    return of(new Xsell());
  }
}

export const xsellRoute: Routes = [
  {
    path: '',
    component: XsellComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.xsell.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: XsellDetailComponent,
    resolve: {
      xsell: XsellResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.xsell.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: XsellUpdateComponent,
    resolve: {
      xsell: XsellResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.xsell.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: XsellUpdateComponent,
    resolve: {
      xsell: XsellResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.xsell.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const xsellPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: XsellDeletePopupComponent,
    resolve: {
      xsell: XsellResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.xsell.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
