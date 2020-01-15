import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Desk } from 'app/shared/model/desk.model';
import { DeskService } from './desk.service';
import { DeskComponent } from './desk.component';
import { DeskDetailComponent } from './desk-detail.component';
import { DeskUpdateComponent } from './desk-update.component';
import { DeskDeletePopupComponent } from './desk-delete-dialog.component';
import { IDesk } from 'app/shared/model/desk.model';

@Injectable({ providedIn: 'root' })
export class DeskResolve implements Resolve<IDesk> {
  constructor(private service: DeskService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDesk> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Desk>) => response.ok),
        map((desk: HttpResponse<Desk>) => desk.body)
      );
    }
    return of(new Desk());
  }
}

export const deskRoute: Routes = [
  {
    path: '',
    component: DeskComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.desk.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DeskDetailComponent,
    resolve: {
      desk: DeskResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.desk.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DeskUpdateComponent,
    resolve: {
      desk: DeskResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.desk.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DeskUpdateComponent,
    resolve: {
      desk: DeskResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.desk.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const deskPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: DeskDeletePopupComponent,
    resolve: {
      desk: DeskResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.desk.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
