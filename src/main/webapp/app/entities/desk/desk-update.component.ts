import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDesk, Desk } from 'app/shared/model/desk.model';
import { DeskService } from './desk.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-desk-update',
  templateUrl: './desk-update.component.html'
})
export class DeskUpdateComponent implements OnInit {
  isSaving: boolean;

  restaurants: IRestaurant[];

  editForm = this.fb.group({
    id: [],
    description: [null, [Validators.required]],
    active: [],
    parentId: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected deskService: DeskService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ desk }) => {
      this.updateForm(desk);
    });
    this.restaurantService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IRestaurant[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRestaurant[]>) => response.body)
      )
      .subscribe((res: IRestaurant[]) => (this.restaurants = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(desk: IDesk) {
    this.editForm.patchValue({
      id: desk.id,
      description: desk.description,
      active: desk.active,
      parentId: desk.parentId,
      restaurant: desk.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const desk = this.createFromForm();
    if (desk.id !== undefined) {
      this.subscribeToSaveResponse(this.deskService.update(desk));
    } else {
      this.subscribeToSaveResponse(this.deskService.create(desk));
    }
  }

  private createFromForm(): IDesk {
    return {
      ...new Desk(),
      id: this.editForm.get(['id']).value,
      description: this.editForm.get(['description']).value,
      active: this.editForm.get(['active']).value,
      parentId: this.editForm.get(['parentId']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDesk>>) {
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
