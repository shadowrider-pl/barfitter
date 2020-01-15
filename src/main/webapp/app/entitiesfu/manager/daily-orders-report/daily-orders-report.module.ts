import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BarfitterSharedModule } from '../../../shared/shared.module';
import {
  DailyOrdersReportService,
  DailyOrdersReportPopupService,
  DailyOrdersReportComponent,
  //    DailyOrdersReportDetailComponent,
  DailyOrdersReportDialogComponent,
  DailyOrdersReportPopupComponent,
  //    DailyOrdersReportDeletePopupComponent,
  //    DailyOrdersReportDeleteDialogComponent,
  dailyOrdersReportRoute,
  dailyOrdersReportPopupRoute
} from './';

const ENTITY_STATES = [...dailyOrdersReportRoute, ...dailyOrdersReportPopupRoute];

@NgModule({
  imports: [BarfitterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DailyOrdersReportComponent,
    //        DailyOrdersReportDetailComponent,
    DailyOrdersReportDialogComponent,
    //        DailyOrdersReportDeleteDialogComponent,
    DailyOrdersReportPopupComponent
    //        DailyOrdersReportDeletePopupComponent,
  ],
  entryComponents: [
    DailyOrdersReportComponent,
    DailyOrdersReportDialogComponent,
    DailyOrdersReportPopupComponent
    //        DailyOrdersReportDeleteDialogComponent,
    //        DailyOrdersReportDeletePopupComponent,
  ],
  providers: [DailyOrdersReportService, DailyOrdersReportPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BarfitterDailyOrdersReportModule {}
