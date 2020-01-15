import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
// import { BarfitterAdminModule } from '../../../admin/admin.module';
import {
  NewDayService,
  NewDayPopupService,
  //    CashupComponent,
  //    CashupDetailComponent,
  NewDayDialogComponent,
  NewDayPopupComponent,
  //    CashupDeletePopupComponent,
  //    CashupDeleteDialogComponent,
  //    cashupRoute,
  cashupPopupRoute,
  CashupResolvePagingParams
} from './';

const ENTITY_STATES = [
  //    ...cashupRoute,
  ...cashupPopupRoute
];

@NgModule({
  imports: [
    BarfitterSharedModule,
    // BarfitterAdminModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [
    //        CashupComponent,
    //        CashupDetailComponent,
    NewDayDialogComponent,
    //        CashupDeleteDialogComponent,
    NewDayPopupComponent
    //        CashupDeletePopupComponent,
  ],
  entryComponents: [
    //        CashupComponent,
    NewDayDialogComponent,
    NewDayPopupComponent
    //        CashupDeleteDialogComponent,
    //        CashupDeletePopupComponent,
  ],
  providers: [NewDayService, NewDayPopupService, CashupResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterNewDayModule {}
