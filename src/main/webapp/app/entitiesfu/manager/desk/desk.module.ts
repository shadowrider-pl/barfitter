import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  DeskService,
  DeskPopupService,
  DeskComponent,
  DeskDetailComponent,
  DeskDialogComponent,
  DeskPopupComponent,
  DeskDeletePopupComponent,
  DeskDeleteDialogComponent,
  deskRoute,
  deskPopupRoute,
  DeskResolvePagingParams
} from './';

const ENTITY_STATES = [...deskRoute, ...deskPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DeskComponent,
    DeskDetailComponent,
    DeskDialogComponent,
    DeskDeleteDialogComponent,
    DeskPopupComponent,
    DeskDeletePopupComponent
  ],
  entryComponents: [DeskComponent, DeskDialogComponent, DeskPopupComponent, DeskDeleteDialogComponent, DeskDeletePopupComponent],
  providers: [DeskService, DeskPopupService, DeskResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterDeskModule {}
