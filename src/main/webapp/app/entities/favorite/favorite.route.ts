import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Favorite } from 'app/shared/model/favorite.model';
import { FavoriteService } from './favorite.service';
import { FavoriteComponent } from './favorite.component';
import { FavoriteDetailComponent } from './favorite-detail.component';
import { FavoriteUpdateComponent } from './favorite-update.component';
import { FavoriteDeletePopupComponent } from './favorite-delete-dialog.component';
import { IFavorite } from 'app/shared/model/favorite.model';

@Injectable({ providedIn: 'root' })
export class FavoriteResolve implements Resolve<IFavorite> {
  constructor(private service: FavoriteService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IFavorite> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Favorite>) => response.ok),
        map((favorite: HttpResponse<Favorite>) => favorite.body)
      );
    }
    return of(new Favorite());
  }
}

export const favoriteRoute: Routes = [
  {
    path: '',
    component: FavoriteComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.favorite.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: FavoriteDetailComponent,
    resolve: {
      favorite: FavoriteResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.favorite.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: FavoriteUpdateComponent,
    resolve: {
      favorite: FavoriteResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.favorite.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: FavoriteUpdateComponent,
    resolve: {
      favorite: FavoriteResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.favorite.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const favoritePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: FavoriteDeletePopupComponent,
    resolve: {
      favorite: FavoriteResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.favorite.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
