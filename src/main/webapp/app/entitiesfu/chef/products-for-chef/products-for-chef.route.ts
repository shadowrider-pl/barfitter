import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Routes } from '@angular/router';
import { ProductsForChefComponent } from './products-for-chef.component';

export const productsForChefRoute: Routes = [
  {
    path: 'products-for-chef',
    component: ProductsForChefComponent,
    data: {
      authorities: ['ROLE_CHEF'],
      pageTitle: 'barfitterApp.productsForChef.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
