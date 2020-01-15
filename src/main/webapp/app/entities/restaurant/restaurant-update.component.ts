import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { IRestaurant, Restaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from './restaurant.service';

@Component({
  selector: 'jhi-restaurant-update',
  templateUrl: './restaurant-update.component.html'
})
export class RestaurantUpdateComponent implements OnInit {
  isSaving: boolean;
  licenceDateDp: any;
  createdDateDp: any;

  editForm = this.fb.group({
    id: [],
    name: [],
    country: [],
    address: [],
    zipCode: [],
    city: [],
    vatNumber: [],
    licenceDate: [],
    licenceType: [],
    nextLicenceType: [],
    adsLevel: [],
    currency: [],
    createdDate: []
  });

  constructor(protected restaurantService: RestaurantService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ restaurant }) => {
      this.updateForm(restaurant);
    });
  }

  updateForm(restaurant: IRestaurant) {
    this.editForm.patchValue({
      id: restaurant.id,
      name: restaurant.name,
      country: restaurant.country,
      address: restaurant.address,
      zipCode: restaurant.zipCode,
      city: restaurant.city,
      vatNumber: restaurant.vatNumber,
      licenceDate: restaurant.licenceDate,
      licenceType: restaurant.licenceType,
      nextLicenceType: restaurant.nextLicenceType,
      adsLevel: restaurant.adsLevel,
      currency: restaurant.currency,
      createdDate: restaurant.createdDate
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const restaurant = this.createFromForm();
    if (restaurant.id !== undefined) {
      this.subscribeToSaveResponse(this.restaurantService.update(restaurant));
    } else {
      this.subscribeToSaveResponse(this.restaurantService.create(restaurant));
    }
  }

  private createFromForm(): IRestaurant {
    return {
      ...new Restaurant(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      country: this.editForm.get(['country']).value,
      address: this.editForm.get(['address']).value,
      zipCode: this.editForm.get(['zipCode']).value,
      city: this.editForm.get(['city']).value,
      vatNumber: this.editForm.get(['vatNumber']).value,
      licenceDate: this.editForm.get(['licenceDate']).value,
      licenceType: this.editForm.get(['licenceType']).value,
      nextLicenceType: this.editForm.get(['nextLicenceType']).value,
      adsLevel: this.editForm.get(['adsLevel']).value,
      currency: this.editForm.get(['currency']).value,
      createdDate: this.editForm.get(['createdDate']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRestaurant>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
