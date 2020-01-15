import { Restaurant } from '../../../shared/model/restaurant.model';
import { CountryService } from '../../active-entities/country.service';
import { Country } from '../../models/country.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { RestaurantPopupService } from './restaurant-popup.service';
import { BossRestaurantService } from './restaurant.service';

@Component({
  selector: 'jhi-restaurant-dialog',
  templateUrl: './restaurant-dialog.component.html'
})
export class RestaurantDialogComponent implements OnInit {
  restaurant: Restaurant;
  isSaving: boolean;
  licenceDateDp: any;
  createdDateDp: any;
  countries: Country[];
  countryX = null;
  currencyX = null;

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private countryService: CountryService,
    private restaurantService: BossRestaurantService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.countryService.query().subscribe(
      (res: HttpResponse<Country[]>) => {
        this.countries = res.body;
        for (let i = 0; i < this.countries.length; i++) {
          if (this.countries[i].countryCode === this.restaurant.country) {
            this.countryX = this.countries[i].countryCode;
            this.currencyX = this.restaurant.currency;
            break;
          }
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.isSaving = false;
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

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.restaurant.id !== undefined) {
      this.subscribeToSaveResponse(this.restaurantService.update(this.restaurant));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Restaurant>>) {
    result.subscribe((res: HttpResponse<Restaurant>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: Restaurant) {
    this.eventManager.broadcast({ name: 'restaurantListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }
}

@Component({
  selector: 'jhi-restaurant-popup',
  template: ''
})
export class RestaurantPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private restaurantPopupService: RestaurantPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.restaurantPopupService.open(RestaurantDialogComponent as Component, params['id']);
      } else {
        this.restaurantPopupService.open(RestaurantDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
