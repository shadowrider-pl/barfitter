import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  CategoryService,
  CategoryPopupService,
  CategoryComponent,
  CategoryDetailComponent,
  CategoryDialogComponent,
  CategoryPopupComponent,
  CategoryDeletePopupComponent,
  CategoryDeleteDialogComponent,
  categoryRoute,
  categoryPopupRoute,
  CategoryResolvePagingParams
} from './';

const ENTITY_STATES = [...categoryRoute, ...categoryPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CategoryComponent,
    CategoryDetailComponent,
    CategoryDialogComponent,
    CategoryDeleteDialogComponent,
    CategoryPopupComponent,
    CategoryDeletePopupComponent
  ],
  entryComponents: [
    CategoryComponent,
    CategoryDialogComponent,
    CategoryPopupComponent,
    CategoryDeleteDialogComponent,
    CategoryDeletePopupComponent
  ],
  providers: [CategoryService, CategoryPopupService, CategoryResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterCategoryModule {}
