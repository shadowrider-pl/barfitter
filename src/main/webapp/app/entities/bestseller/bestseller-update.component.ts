import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IBestseller, Bestseller } from 'app/shared/model/bestseller.model';
import { BestsellerService } from './bestseller.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-bestseller-update',
  templateUrl: './bestseller-update.component.html'
})
export class BestsellerUpdateComponent implements OnInit {
  isSaving: boolean;

  products: IProduct[];

  restaurants: IRestaurant[];

  editForm = this.fb.group({
    id: [],
    product: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected bestsellerService: BestsellerService,
    protected productService: ProductService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ bestseller }) => {
      this.updateForm(bestseller);
    });
    this.productService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IProduct[]>) => mayBeOk.ok),
        map((response: HttpResponse<IProduct[]>) => response.body)
      )
      .subscribe((res: IProduct[]) => (this.products = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.restaurantService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IRestaurant[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRestaurant[]>) => response.body)
      )
      .subscribe((res: IRestaurant[]) => (this.restaurants = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(bestseller: IBestseller) {
    this.editForm.patchValue({
      id: bestseller.id,
      product: bestseller.product,
      restaurant: bestseller.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const bestseller = this.createFromForm();
    if (bestseller.id !== undefined) {
      this.subscribeToSaveResponse(this.bestsellerService.update(bestseller));
    } else {
      this.subscribeToSaveResponse(this.bestsellerService.create(bestseller));
    }
  }

  private createFromForm(): IBestseller {
    return {
      ...new Bestseller(),
      id: this.editForm.get(['id']).value,
      product: this.editForm.get(['product']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBestseller>>) {
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

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }
}
