import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Vat } from 'app/shared/model/vat.model';
import { VatService } from './vat.service';
import { VatComponent } from './vat.component';
import { VatDetailComponent } from './vat-detail.component';
import { VatUpdateComponent } from './vat-update.component';
import { VatDeletePopupComponent } from './vat-delete-dialog.component';
import { IVat } from 'app/shared/model/vat.model';

@Injectable({ providedIn: 'root' })
export class VatResolve implements Resolve<IVat> {
  constructor(private service: VatService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IVat> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Vat>) => response.ok),
        map((vat: HttpResponse<Vat>) => vat.body)
      );
    }
    return of(new Vat());
  }
}

export const vatRoute: Routes = [
  {
    path: '',
    component: VatComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: VatDetailComponent,
    resolve: {
      vat: VatResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: VatUpdateComponent,
    resolve: {
      vat: VatResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: VatUpdateComponent,
    resolve: {
      vat: VatResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const vatPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: VatDeletePopupComponent,
    resolve: {
      vat: VatResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
