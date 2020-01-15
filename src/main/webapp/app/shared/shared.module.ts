import { NgModule } from '@angular/core';
import { BarfitterSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { JhiAlertComponent } from './alert/alert.component';
import { JhiAlertErrorComponent } from './alert/alert-error.component';
import { JhiLoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { LocalizedDatePipe } from './language/localizedDate.pipe';
import { LocalizedCurrencyPipe } from './language/localizedCurrency.pipe';

@NgModule({
  imports: [BarfitterSharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    LocalizedDatePipe,
    LocalizedCurrencyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiLoginModalComponent,
    HasAnyAuthorityDirective
  ],
  entryComponents: [JhiLoginModalComponent],
  exports: [
    BarfitterSharedLibsModule,
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    JhiLoginModalComponent,
    HasAnyAuthorityDirective,
    LocalizedDatePipe,
    LocalizedCurrencyPipe
  ]
})
export class BarfitterSharedModule {}
