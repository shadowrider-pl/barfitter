import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Route } from '@angular/router';
import { TermsAndConditionsComponent } from './';

export const TERMS_ROUTE: Route = {
  path: 'terms-and-conditions',
  component: TermsAndConditionsComponent,
  data: {
    authorities: [],
    pageTitle: 'manual.title'
  },
  canActivate: [UserRouteAccessService]
};
