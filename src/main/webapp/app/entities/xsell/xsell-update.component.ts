import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IXsell, Xsell } from 'app/shared/model/xsell.model';
import { XsellService } from './xsell.service';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category/category.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-xsell-update',
  templateUrl: './xsell-update.component.html'
})
export class XsellUpdateComponent implements OnInit {
  isSaving: boolean;

  categories: ICategory[];

  restaurants: IRestaurant[];

  editForm = this.fb.group({
    id: [],
    fromCategory: [],
    toCategory: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected xsellService: XsellService,
    protected categoryService: CategoryService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ xsell }) => {
      this.updateForm(xsell);
    });
    this.categoryService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICategory[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICategory[]>) => response.body)
      )
      .subscribe((res: ICategory[]) => (this.categories = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.restaurantService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IRestaurant[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRestaurant[]>) => response.body)
      )
      .subscribe((res: IRestaurant[]) => (this.restaurants = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(xsell: IXsell) {
    this.editForm.patchValue({
      id: xsell.id,
      fromCategory: xsell.fromCategory,
      toCategory: xsell.toCategory,
      restaurant: xsell.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const xsell = this.createFromForm();
    if (xsell.id !== undefined) {
      this.subscribeToSaveResponse(this.xsellService.update(xsell));
    } else {
      this.subscribeToSaveResponse(this.xsellService.create(xsell));
    }
  }

  private createFromForm(): IXsell {
    return {
      ...new Xsell(),
      id: this.editForm.get(['id']).value,
      fromCategory: this.editForm.get(['fromCategory']).value,
      toCategory: this.editForm.get(['toCategory']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IXsell>>) {
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

  trackCategoryById(index: number, item: ICategory) {
    return item.id;
  }

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }
}
