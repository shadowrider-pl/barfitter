import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Cashup } from 'app/shared/model/cashup.model';
import { CashupService } from './cashup.service';
import { CashupComponent } from './cashup.component';
import { CashupDetailComponent } from './cashup-detail.component';
import { CashupUpdateComponent } from './cashup-update.component';
import { CashupDeletePopupComponent } from './cashup-delete-dialog.component';
import { ICashup } from 'app/shared/model/cashup.model';

@Injectable({ providedIn: 'root' })
export class CashupResolve implements Resolve<ICashup> {
  constructor(private service: CashupService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICashup> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Cashup>) => response.ok),
        map((cashup: HttpResponse<Cashup>) => cashup.body)
      );
    }
    return of(new Cashup());
  }
}

export const cashupRoute: Routes = [
  {
    path: '',
    component: CashupComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.cashup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CashupDetailComponent,
    resolve: {
      cashup: CashupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.cashup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CashupUpdateComponent,
    resolve: {
      cashup: CashupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.cashup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CashupUpdateComponent,
    resolve: {
      cashup: CashupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.cashup.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const cashupPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CashupDeletePopupComponent,
    resolve: {
      cashup: CashupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.cashup.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
