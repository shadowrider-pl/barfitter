import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';

// import { BarCashupComponent } from './bar-cashup.component';
// import { BarCashupDetailComponent } from './bar-cashup-detail.component';
import { BarCashupPopupComponent } from './bar-cashup-dialog.component';
// import { BarCashupDeletePopupComponent } from './bar-cashup-delete-dialog.component';

export const barCashupPopupRoute: Routes = [
  {
    path: 'bar-cashup',
    component: BarCashupPopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.cashup.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
