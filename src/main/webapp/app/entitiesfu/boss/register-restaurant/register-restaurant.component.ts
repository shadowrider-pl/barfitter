import { LoginModalService } from 'app/core/login/login-modal.service';
import { User } from 'app/core/user/user.model';
import { RestaurantRegistration } from '../../models/restaurant-registration.model';
import { Component, OnInit, AfterViewInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';

import { RegisterRestaurantService } from './register-restaurant.service';
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/shared/constants/error.constants';
import { Restaurant } from '../../../shared/model/restaurant.model';
import { CountryService } from '../../active-entities/country.service';
import { Country } from '../../models/country.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';

@Component({
  selector: 'jhi-register',
  templateUrl: './register-restaurant.component.html'
})
export class RegisterRestaurantComponent implements OnInit, AfterViewInit {
  confirmPassword: string;
  doNotMatch: string;
  error: string;
  errorEmailExists: string;
  errorUserExists: string;
  registerAccount: any;
  success: boolean;
  modalRef: NgbModalRef;
  restaurantRegistration: RestaurantRegistration;
  user: User;
  restaurant: Restaurant;
  countries: Country[];
  countryX = null;
  currencyX = null;
  privacyCheck = false;
  recaptchaVerified: boolean;
  errormsg: string;

  @ViewChild('recaptchaDiv', { static: true }) recaptchaDiv: ElementRef;
  // recaptchaDiv: any;

  private _reCaptchaId: number;
  private SITE_ID = '6Lf8bMUUAAAAABtbHDKmsXotN0qd0BHcg7mb_ZuF';
  recaptchaError: string;

  constructor(
    private languageService: JhiLanguageService,
    private jhiAlertService: JhiAlertService,
    private countryService: CountryService,
    private loginModalService: LoginModalService,
    private registerRestaurantService: RegisterRestaurantService,
    private elementRef: ElementRef,
    private renderer: Renderer
  ) {}

  ngOnInit() {
    this.recaptchaVerified = false;
    this.countryService.query().subscribe(
      (res: HttpResponse<Country[]>) => {
        this.countries = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.success = false;
    this.restaurantRegistration = { restaurant: null, user: null };
    this.user = {};
    this.restaurant = {};
    window['onloadCallback'] = this.onloadCallback.bind(this);
  }

  onloadCallback(response) {
    //    console.log('verifyCallback=' + response);
    const grecaptcha = (window as any).grecaptcha;
    if (grecaptcha) {
      this._reCaptchaId = grecaptcha.render(this.recaptchaDiv.nativeElement, {
        sitekey: this.SITE_ID,
        callback: resonse => this.reCapchaSuccess(resonse),
        'expired-callback': () => this.reCapchaExpired()
      });
    }
  }

  reCapchaSuccess(data: any) {
    if (data) {
      //      console.log('Congratulation! reCAPTCHA verified.');
      this.recaptchaVerified = true;
    }
  }

  reCapchaExpired() {
    //    console.log('Oops! reCAPTCHA expired.');
    this.recaptchaVerified = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#login'), 'focus', []);
  }

  register() {
    if (this.user.password !== this.confirmPassword) {
      this.doNotMatch = 'ERROR';
      // } else if (this.recaptchaVerified === false) {
      //   this.recaptchaError = 'ERROR';
    } else {
      this.doNotMatch = null;
      this.error = null;
      this.errorUserExists = null;
      this.errorEmailExists = null;
      this.languageService.getCurrent().then(key => {
        //                this.registerAccount.langKey = key;
        this.user.langKey = key;
        this.restaurantRegistration.user = this.user;
        this.restaurantRegistration.restaurant = this.restaurant;
        this.registerRestaurantService.save(this.restaurantRegistration).subscribe(
          () => {
            this.success = true;
          },
          response => this.processError(response)
        );
      });
    }
  }

  changeCountry(countryCode) {
    this.restaurant.country = countryCode;
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].countryCode === countryCode) {
        this.restaurant.currency = this.countries[i].currency;
        this.currencyX = this.countries[i].currency;
        break;
      }
    }
  }

  changeCurrency(currency) {
    this.restaurant.currency = currency;
  }

  openLogin() {
    this.modalRef = this.loginModalService.open();
  }

  private processError(response: HttpErrorResponse) {
    this.success = null;
    // console.log(response.error.type);
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = 'ERROR';
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = 'ERROR';
    } else {
      this.error = 'ERROR';
    }
  }

  //    private processError(response) {
  //      console.log('response='+JSON.stringify(response));
  //      console.log('response.json().type='+response.json().type);
  //        this.success = null;
  //        if (response.status === 400 && response.json().type === LOGIN_ALREADY_USED_TYPE) {
  //            this.errorUserExists = 'ERROR';
  //        } else if (response.status === 400 && response.json().type === EMAIL_ALREADY_USED_TYPE) {
  //            this.errorEmailExists = 'ERROR';
  //        } else {
  //            this.error = 'ERROR';
  //        }
  //    }
}
