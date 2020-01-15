import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { SubstitutesComponent } from './substitutes.component';
import { SubstitutesPopupComponent } from './substitutes-dialog.component';

export const substitutesRoute: Routes = [
  {
    path: 'substitutes',
    component: SubstitutesComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.substitutes.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
  // {
  //        path: 'substitutes/:id',
  //        component: SubstitutesDetailComponent,
  //        data: {
  //            authorities: ['ROLE_MANAGER'],
  //            pageTitle: 'barfitterApp.substitutes.home.title'
  //        },
  //        canActivate: [UserRouteAccessService]
  //    }
];

export const substitutesPopupRoute: Routes = [
  //    {
  //        path: 'substitutes-new',
  //        component: SubstitutesPopupComponent,
  //        data: {
  //            authorities: ['ROLE_MANAGER'],
  //            pageTitle: 'barfitterApp.substitutes.home.title'
  //        },
  //        canActivate: [UserRouteAccessService],
  //        outlet: 'popup'
  //    },
  {
    path: 'substitutes/:id/edit',
    component: SubstitutesPopupComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'barfitterApp.substitutes.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
  //    {
  //        path: 'substitutes/:id/delete',
  //        component: SubstitutesDeletePopupComponent,
  //        data: {
  //            authorities: ['ROLE_MANAGER'],
  //            pageTitle: 'barfitterApp.substitutes.home.title'
  //        },
  //        canActivate: [UserRouteAccessService],
  //        outlet: 'popup'
  //    }
];
