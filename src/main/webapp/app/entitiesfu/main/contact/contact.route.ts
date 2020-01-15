import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Route } from '@angular/router';
import { ContactComponent } from './';

export const CONTACT_ROUTE: Route = {
  path: 'contact',
  component: ContactComponent,
  data: {
    authorities: [],
    pageTitle: 'contact.title'
  }
};
