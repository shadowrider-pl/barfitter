import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserToRestaurant } from 'app/shared/model/user-to-restaurant.model';
import { UserToRestaurantService } from './user-to-restaurant.service';
import { UserToRestaurantComponent } from './user-to-restaurant.component';
import { UserToRestaurantDetailComponent } from './user-to-restaurant-detail.component';
import { UserToRestaurantUpdateComponent } from './user-to-restaurant-update.component';
import { UserToRestaurantDeletePopupComponent } from './user-to-restaurant-delete-dialog.component';
import { IUserToRestaurant } from 'app/shared/model/user-to-restaurant.model';

@Injectable({ providedIn: 'root' })
export class UserToRestaurantResolve implements Resolve<IUserToRestaurant> {
  constructor(private service: UserToRestaurantService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUserToRestaurant> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<UserToRestaurant>) => response.ok),
        map((userToRestaurant: HttpResponse<UserToRestaurant>) => userToRestaurant.body)
      );
    }
    return of(new UserToRestaurant());
  }
}

export const userToRestaurantRoute: Routes = [
  {
    path: '',
    component: UserToRestaurantComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'barfitterApp.userToRestaurant.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: UserToRestaurantDetailComponent,
    resolve: {
      userToRestaurant: UserToRestaurantResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.userToRestaurant.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: UserToRestaurantUpdateComponent,
    resolve: {
      userToRestaurant: UserToRestaurantResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.userToRestaurant.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: UserToRestaurantUpdateComponent,
    resolve: {
      userToRestaurant: UserToRestaurantResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.userToRestaurant.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const userToRestaurantPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: UserToRestaurantDeletePopupComponent,
    resolve: {
      userToRestaurant: UserToRestaurantResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'barfitterApp.userToRestaurant.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
