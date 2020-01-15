import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import { ProductsForChefService, ProductsForChefComponent, productsForChefRoute } from './';

const ENTITY_STATES = [...productsForChefRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [ProductsForChefComponent],
  entryComponents: [ProductsForChefComponent],
  providers: [ProductsForChefService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterProductsForChefModule {}
