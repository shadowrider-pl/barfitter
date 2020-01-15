import { BarfitterRestaurantsModule } from './admin/restaurants/restaurants.module';
import { BarfitterPrivacyModule } from './main/privacy/privacy.module';
// import { BarfitterAdsenseModule } from './adsense/adsense.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BarfitterVatModule } from './boss/vat/vat.module';
import { BarfitterCategoryModule } from './manager/category/category.module';
import { BarfitterProductDeliveredModule } from './manager/product-delivered/product-delivered.module';
import { BarfitterPaymentModule } from './manager/payment/payment.module';
import { BarfitterDeskModule } from './manager/desk/desk.module';
import { BarfitterXsellModule } from './manager/xsell/xsell.module';
import { BarfitterAuthorizationModule } from './boss/authorization/authorization.module';
import { BarfitterNewOrderModule } from './barman/new-order/new-order.module';
import { BarfitterFastOrderModule } from './barman/fast-order/fast-order.module';
import { BarfitterAllOrdersModule } from './barman/all-orders/all-orders.module';
import { BarfitterNewDayModule } from './barman/new-day/new-day.module';
import { BarfitterOrdersModule } from './barman/orders/orders.module';
import { BarfitterProductOrderedFUModule } from './barman/orders/product-ordered-fu/product-ordered-fu.module';
import { BarfitterAddProductModule } from './barman/orders/add-product/add-product.module';
import { BarfitterPayModule } from './barman/orders/pay/pay.module';
import { BarfitterSubstitutesModule } from './manager/substitutes/substitutes.module';
import { BarfitterStockModule } from './manager/stock/stock.module';
import { BarfitterProductsForChefModule } from './chef/products-for-chef/products-for-chef.module';
import { BarfitterTodaysOrdersModule } from './barman/todays-orders/todays-orders.module';
import { BarfitterBarCashupModule } from './barman/bar-cashup/bar-cashup.module';
import { BarfitterUserModule } from './boss/user/user.module';
import { BarfitterProductsProcessedAtKitchenModule } from './barman/products-processed-at-kitchen/products-processed-at-kitchen.module';
import { BarfitterSaleAnalysisModule } from './manager/sale-analysis/sale-analysis.module';
import { BarfitterMonthlyReportModule } from './manager/monthly-report/';
import { BarfitterFavoritesModule } from './manager/favorites/favorites.module';
import { BarfitterDailyOrdersReportModule } from './manager/daily-orders-report/daily-orders-report.module';
import { BarfitterBarmanPanelModule } from './barman/barman-panel/barman-panel.module';
import { BarfitterChefPanelModule } from './chef/chef-panel/chef-panel.module';
import { BarfitterOrdersForChefModule } from './chef/orders-for-chef/orders-for-chef.module';
import { BarfitterSplitOrderModule } from './barman/orders/split-order/split-order.module';
import { BarfitterRegisterRestaurantModule } from './boss/register-restaurant/register-restaurant.module';
import { BarfitterBossRestaurantModule } from './boss/restaurant/restaurant.module';
import { BarfitterTakeCashModule } from './boss/take-cash/take-cash.module';
import { BarfitterAppContactModule } from './main/contact/contact.module';
import { BarfitterManualModule } from './main/manual/manual.module';
import { BarfitterLoginModule } from './main/login/login.module';
import { BarfitterAppTermsAndConditionsModule } from './main/terms-and-conditions/terms-and-conditions.module';
import { BarfitterDefaultValuesModule } from './boss/vat/default-values/default-values.module';

// dodać import jeszcze poniżej

/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
  imports: [
    BarfitterVatModule,
    BarfitterCategoryModule,
    BarfitterProductDeliveredModule,
    BarfitterPaymentModule,
    BarfitterDeskModule,
    BarfitterXsellModule,
    BarfitterAuthorizationModule,
    BarfitterNewOrderModule,
    BarfitterFastOrderModule,
    BarfitterAllOrdersModule,
    BarfitterNewDayModule,
    BarfitterOrdersModule,
    BarfitterProductOrderedFUModule,
    BarfitterAddProductModule,
    BarfitterPayModule,
    BarfitterSubstitutesModule,
    BarfitterProductsForChefModule,
    BarfitterTodaysOrdersModule,
    BarfitterBarCashupModule,
    BarfitterStockModule,
    BarfitterUserModule,
    BarfitterTakeCashModule,
    BarfitterProductsProcessedAtKitchenModule,
    BarfitterSaleAnalysisModule,
    BarfitterMonthlyReportModule,
    BarfitterFavoritesModule,
    BarfitterDailyOrdersReportModule,
    BarfitterBarmanPanelModule,
    BarfitterChefPanelModule,
    BarfitterOrdersForChefModule,
    BarfitterSplitOrderModule,
    BarfitterBossRestaurantModule,
    BarfitterRegisterRestaurantModule,
    BarfitterPrivacyModule,
    BarfitterManualModule,
    // BarfitterAdsenseModule,
    BarfitterRestaurantsModule,
    BarfitterAppTermsAndConditionsModule,
    BarfitterAppContactModule,
    BarfitterLoginModule,
    BarfitterDefaultValuesModule

    /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterEntityFUModule {}
