import { Route } from '@angular/router';
import { PrivacyComponent } from './';

export const PRIVACY_ROUTE: Route = {
  path: 'privacy',
  component: PrivacyComponent,
  data: {
    authorities: [],
    pageTitle: 'privacy.title'
  }
};
