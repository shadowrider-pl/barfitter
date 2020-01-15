import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  MXsellService,
  XsellPopupService,
  XsellComponent,
  XsellDetailComponent,
  XsellDialogComponent,
  XsellPopupComponent,
  XsellDeletePopupComponent,
  XsellDeleteDialogComponent,
  xsellRoute,
  xsellPopupRoute,
  XsellResolvePagingParams
} from './';

const ENTITY_STATES = [...xsellRoute, ...xsellPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    XsellComponent,
    XsellDetailComponent,
    XsellDialogComponent,
    XsellDeleteDialogComponent,
    XsellPopupComponent,
    XsellDeletePopupComponent
  ],
  entryComponents: [XsellComponent, XsellDialogComponent, XsellPopupComponent, XsellDeleteDialogComponent, XsellDeletePopupComponent],
  providers: [MXsellService, XsellPopupService, XsellResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterXsellModule {}
