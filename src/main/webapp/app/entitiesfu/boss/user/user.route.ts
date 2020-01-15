import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserPopupComponent } from './user-dialog.component';
import { UserDeletePopupComponent } from './user-delete-dialog.component';
import { ChangePasswordComponent } from './change-password.component';

export const userRoute: Routes = [
  {
    path: 'user',
    component: UserComponent,
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'userManagement.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'user/password/:id',
    component: ChangePasswordComponent,
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'global.menu.account.password'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const userPopupRoute: Routes = [
  {
    path: 'user-new',
    component: UserPopupComponent,
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'barfitterApp.user.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'user/:id/edit',
    component: UserPopupComponent,
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'barfitterApp.user.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'user/:id/delete',
    component: UserDeletePopupComponent,
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'barfitterApp.user.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
