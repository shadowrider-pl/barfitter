import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { SaleAnalysisComponent } from './sale-analysis.component';

export const saleAnalysisRoute: Routes = [
  {
    path: 'sale-analysis',
    component: SaleAnalysisComponent,
    data: {
      authorities: ['ROLE_MANAGER', 'ROLE_BOSS'],
      pageTitle: 'home.saleAnalysis'
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

// export const substitutesPopupRoute: Routes = [
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
//    {
//        path: 'substitutes/:id/edit',
//        component: SubstitutesPopupComponent,
//        data: {
//            authorities: ['ROLE_MANAGER'],
//            pageTitle: 'barfitterApp.substitutes.home.title'
//        },
//        canActivate: [UserRouteAccessService],
//        outlet: 'popup'
//    },
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
// ];
