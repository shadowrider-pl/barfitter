import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IVat, Vat } from 'app/shared/model/vat.model';
import { VatService } from './vat.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-vat-update',
  templateUrl: './vat-update.component.html'
})
export class VatUpdateComponent implements OnInit {
  isSaving: boolean;

  restaurants: IRestaurant[];

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.required]],
    rate: [null, [Validators.required]],
    active: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected vatService: VatService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ vat }) => {
      this.updateForm(vat);
    });
    this.restaurantService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IRestaurant[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRestaurant[]>) => response.body)
      )
      .subscribe((res: IRestaurant[]) => (this.restaurants = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(vat: IVat) {
    this.editForm.patchValue({
      id: vat.id,
      description: vat.description,
      rate: vat.rate,
      active: vat.active,
      restaurant: vat.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const vat = this.createFromForm();
    if (vat.id !== undefined) {
      this.subscribeToSaveResponse(this.vatService.update(vat));
    } else {
      this.subscribeToSaveResponse(this.vatService.create(vat));
    }
  }

  private createFromForm(): IVat {
    return {
      ...new Vat(),
      id: this.editForm.get(['id']).value,
      description: this.editForm.get(['description']).value,
      rate: this.editForm.get(['rate']).value,
      active: this.editForm.get(['active']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVat>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }
}
