import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PaymentToCashup } from 'app/shared/model/payment-to-cashup.model';
import { PaymentToCashupService } from './payment-to-cashup.service';
import { PaymentToCashupComponent } from './payment-to-cashup.component';
import { PaymentToCashupDetailComponent } from './payment-to-cashup-detail.component';
import { PaymentToCashupUpdateComponent } from './payment-to-cashup-update.component';
import { PaymentToCashupDeletePopupComponent } from './payment-to-cashup-delete-dialog.component';
import { IPaymentToCashup } from 'app/shared/model/payment-to-cashup.model';

@Injectable({ providedIn: 'root' })
export class PaymentToCashupResolve implements Resolve<IPaymentToCashup> {
  constructor(private service: PaymentToCashupService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPaymentToCashup> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PaymentToCashup>) => response.ok),
        map((paymentToCashup: HttpResponse<PaymentToCashup>) => paymentToCashup.body)
      );
    }
    return of(new PaymentToCashup());
  }
}

export const paymentToCashupRoute: Routes = [
  {
    path: '',
    component: PaymentToCashupComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.paymentToCashup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PaymentToCashupDetailComponent,
    resolve: {
      paymentToCashup: PaymentToCashupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.paymentToCashup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PaymentToCashupUpdateComponent,
    resolve: {
      paymentToCashup: PaymentToCashupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.paymentToCashup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PaymentToCashupUpdateComponent,
    resolve: {
      paymentToCashup: PaymentToCashupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.paymentToCashup.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const paymentToCashupPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PaymentToCashupDeletePopupComponent,
    resolve: {
      paymentToCashup: PaymentToCashupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.paymentToCashup.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
