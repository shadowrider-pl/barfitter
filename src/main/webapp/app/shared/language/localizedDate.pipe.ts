import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

// add it to BarfitterSharedModule in declarations and exports
@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  lang = 'en';
  constructor(private languageService: JhiLanguageService) {
    this.getlang();
  }

  getlang() {
    this.languageService.getCurrent().then(
      function(langKeyValue) {
        registerLocaleData(localePl, 'pl');
        switch (langKeyValue) {
          case 'en': {
            this.lang = 'en';
            break;
          }
          case 'pl': {
            this.lang = 'pl';
            break;
          }
        }
      }.bind(this)
    );
  }

  transform(value: any, pattern = 'mediumDate'): any {
    const datePipe: DatePipe = new DatePipe(this.lang);
    return datePipe.transform(value, pattern);
  }
}
