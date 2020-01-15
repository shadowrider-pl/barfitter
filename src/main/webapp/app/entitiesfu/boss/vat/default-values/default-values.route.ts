import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';

import { DefaultValuesComponent } from './default-values.component';

export const defaultValuesRoute: Routes = [
  {
    path: 'load-defaults',
    component: DefaultValuesComponent,
    data: {
      authorities: ['ROLE_BOSS', 'ROLE_MANAGER'],
      pageTitle: 'barfitterApp.vat.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
