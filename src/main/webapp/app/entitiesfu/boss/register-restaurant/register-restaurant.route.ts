import { Route } from '@angular/router';

import { RegisterRestaurantComponent } from './register-restaurant.component';
import { Routes } from '@angular/router';

export const registerRestaurantRoute: Route = {
  path: 'register-restaurant',
  component: RegisterRestaurantComponent,
  data: {
    authorities: [],
    pageTitle: 'register.title'
  }
};
const ACCOUNT_ROUTES = [registerRestaurantRoute];

export const accountRestState: Routes = [
  {
    path: '',
    children: ACCOUNT_ROUTES
  }
];
