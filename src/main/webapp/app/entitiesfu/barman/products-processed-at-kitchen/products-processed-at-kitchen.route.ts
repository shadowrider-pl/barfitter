import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { ProductsProcessedAtKitchenComponent } from './products-processed-at-kitchen.component';

export const productsProcessedAtKitchenRoute: Routes = [
  {
    path: 'products-processed-at-kitchen',
    component: ProductsProcessedAtKitchenComponent,
    data: {
      authorities: ['ROLE_BARMAN'],
      pageTitle: 'barfitterApp.orderOpened.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
