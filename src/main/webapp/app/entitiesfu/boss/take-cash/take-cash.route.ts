import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { TakeCashPopupComponent } from './take-cash-dialog.component';

export const takeCashPopupRoute: Routes = [
  {
    path: 'take-cash',
    component: TakeCashPopupComponent,
    data: {
      authorities: ['ROLE_BOSS', 'ROLE_MANAGER'],
      pageTitle: 'barfitterApp.takeCash.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
