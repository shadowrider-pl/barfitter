import { Route } from '@angular/router';
import { ManualComponent } from './';

export const MANUAL_ROUTE: Route = {
  path: 'manual',
  component: ManualComponent,
  data: {
    authorities: [],
    pageTitle: 'manual.title'
  }
};
