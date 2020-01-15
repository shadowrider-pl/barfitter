import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';

import { RestaurantPopupComponent } from './restaurant-dialog.component';

// @Injectable()
// export class RestaurantResolvePagingParams implements Resolve<any> {
//
//    constructor(private paginationUtil: JhiPaginationUtil) {}
//
//    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
//        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
//        return {
//            page: this.paginationUtil.parsePage(page),
//            predicate: this.paginationUtil.parsePredicate(sort),
//            ascending: this.paginationUtil.parseAscending(sort)
//      };
//    }
// }

// export const restaurantRoute: Routes = [
//    {
//        path: 'restaurant',
//        component: RestaurantComponent,
//        resolve: {
//            'pagingParams': RestaurantResolvePagingParams
//        },
//        data: {
//            authorities: ['ROLE_BOSS'],
//            pageTitle: 'barfitterApp.restaurant.home.title'
//        },
//        canActivate: [UserRouteAccessService]
//    }, {
//        path: 'restaurant/:id',
//        component: RestaurantDetailComponent,
//        data: {
//            authorities: ['ROLE_BOSS'],
//            pageTitle: 'barfitterApp.restaurant.home.title'
//        },
//        canActivate: [UserRouteAccessService]
//    }
// ];

export const bossRestaurantPopupRoute: Routes = [
  //    {
  //        path: 'restaurant-new',
  //        component: RestaurantPopupComponent,
  //        data: {
  //            authorities: ['ROLE_BOSS'],
  //            pageTitle: 'barfitterApp.restaurant.home.title'
  //        },
  //        canActivate: [UserRouteAccessService],
  //        outlet: 'popup'
  //    },
  {
    path: 'boss-restaurant',
    component: RestaurantPopupComponent,
    data: {
      authorities: ['ROLE_BOSS'],
      pageTitle: 'barfitterApp.restaurant.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
  //    {
  //        path: 'restaurant/:id/delete',
  //        component: RestaurantDeletePopupComponent,
  //        data: {
  //            authorities: ['ROLE_BOSS'],
  //            pageTitle: 'barfitterApp.restaurant.home.title'
  //        },
  //        canActivate: [UserRouteAccessService],
  //        outlet: 'popup'
  //    }
];
