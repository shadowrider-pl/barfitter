import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'restaurant',
        loadChildren: () => import('./restaurant/restaurant.module').then(m => m.BarfitterRestaurantModule)
      },
      {
        path: 'vat',
        loadChildren: () => import('./vat/vat.module').then(m => m.BarfitterVatModule)
      },
      {
        path: 'product-type',
        loadChildren: () => import('./product-type/product-type.module').then(m => m.BarfitterProductTypeModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.BarfitterCategoryModule)
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.BarfitterProductModule)
      },
      {
        path: 'cashup',
        loadChildren: () => import('./cashup/cashup.module').then(m => m.BarfitterCashupModule)
      },
      {
        path: 'xsell',
        loadChildren: () => import('./xsell/xsell.module').then(m => m.BarfitterXsellModule)
      },
      {
        path: 'desk',
        loadChildren: () => import('./desk/desk.module').then(m => m.BarfitterDeskModule)
      },
      {
        path: 'favorite',
        loadChildren: () => import('./favorite/favorite.module').then(m => m.BarfitterFavoriteModule)
      },
      {
        path: 'user-to-restaurant',
        loadChildren: () => import('./user-to-restaurant/user-to-restaurant.module').then(m => m.BarfitterUserToRestaurantModule)
      },
      {
        path: 'product-delivered',
        loadChildren: () => import('./product-delivered/product-delivered.module').then(m => m.BarfitterProductDeliveredModule)
      },
      {
        path: 'product-on-stock',
        loadChildren: () => import('./product-on-stock/product-on-stock.module').then(m => m.BarfitterProductOnStockModule)
      },
      {
        path: 'payment',
        loadChildren: () => import('./payment/payment.module').then(m => m.BarfitterPaymentModule)
      },
      {
        path: 'order-opened',
        loadChildren: () => import('./order-opened/order-opened.module').then(m => m.BarfitterOrderOpenedModule)
      },
      {
        path: 'payment-to-cashup',
        loadChildren: () => import('./payment-to-cashup/payment-to-cashup.module').then(m => m.BarfitterPaymentToCashupModule)
      },
      {
        path: 'order-closed',
        loadChildren: () => import('./order-closed/order-closed.module').then(m => m.BarfitterOrderClosedModule)
      },
      {
        path: 'ordered-product-status',
        loadChildren: () =>
          import('./ordered-product-status/ordered-product-status.module').then(m => m.BarfitterOrderedProductStatusModule)
      },
      {
        path: 'product-ordered',
        loadChildren: () => import('./product-ordered/product-ordered.module').then(m => m.BarfitterProductOrderedModule)
      },
      {
        path: 'product-sold',
        loadChildren: () => import('./product-sold/product-sold.module').then(m => m.BarfitterProductSoldModule)
      },
      {
        path: 'bestseller',
        loadChildren: () => import('./bestseller/bestseller.module').then(m => m.BarfitterBestsellerModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class BarfitterEntityModule {}
