import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { NewDayPopupComponent } from './new-day-dialog.component';

@Injectable()
export class CashupResolvePagingParams implements Resolve<any> {
  constructor(private paginationUtil: JhiPaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
    const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
    return {
      page: this.paginationUtil.parsePage(page),
      predicate: this.paginationUtil.parsePredicate(sort),
      ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

export const cashupPopupRoute: Routes = [
  {
    path: 'new-day',
    component: NewDayPopupComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.cashup.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
