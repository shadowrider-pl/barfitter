import { BossRestaurantService } from '../../entitiesfu/boss/restaurant/restaurant.service';
import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { HttpResponse } from '@angular/common/http';

@Pipe({
  name: 'localizedCurrency'
})
export class LocalizedCurrencyPipe implements PipeTransform {
  lang = 'en';
  currency = '$';
  constructor(private restaurantService: BossRestaurantService, private languageService: JhiLanguageService) {
    this.getlang();
    this.checkRestaurantCurrency();
  }

  getlang() {
    this.languageService.getCurrent().then(
      function(langKeyValue) {
        registerLocaleData(localePl, 'pl');
        switch (langKeyValue) {
          case 'en': {
            this.lang = 'en';
            this.currency = '$';
            break;
          }
          case 'pl': {
            this.lang = 'pl';
            this.currency = 'zł';
            break;
          }
        }
      }.bind(this)
    );
    //    this.checkRestaurantLangAndCurrency();
  }

  checkRestaurantCurrency() {
    this.restaurantService.findCurrency().subscribe((restaurantResponse: HttpResponse<CurrencyForLocalizedCurrencyPipe>) => {
      this.currency = restaurantResponse.body.currency;
    });
  }

  transform(value: any): any {
    const currencyPipe: CurrencyPipe = new CurrencyPipe(this.lang);
    return currencyPipe.transform(value, this.currency);
  }
}

export class CurrencyForLocalizedCurrencyPipe {
  currency: string;
}
