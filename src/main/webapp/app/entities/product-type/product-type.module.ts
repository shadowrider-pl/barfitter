import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from 'app/shared/shared.module';
import { ProductTypeComponent } from './product-type.component';
import { ProductTypeDetailComponent } from './product-type-detail.component';
import { ProductTypeUpdateComponent } from './product-type-update.component';
import { ProductTypeDeletePopupComponent, ProductTypeDeleteDialogComponent } from './product-type-delete-dialog.component';
import { productTypeRoute, productTypePopupRoute } from './product-type.route';

const ENTITY_STATES = [...productTypeRoute, ...productTypePopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProductTypeComponent,
    ProductTypeDetailComponent,
    ProductTypeUpdateComponent,
    ProductTypeDeleteDialogComponent,
    ProductTypeDeletePopupComponent
  ],
  entryComponents: [ProductTypeDeleteDialogComponent]
})
export class BarfitterProductTypeModule {}
