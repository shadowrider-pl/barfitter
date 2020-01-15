import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Route } from '@angular/router';
import { LoginComponent } from './';

export const LOGIN_ROUTE: Route = {
  path: 'login',
  component: LoginComponent,
  data: {
    authorities: [],
    pageTitle: 'login.title'
  }
};
