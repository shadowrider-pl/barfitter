import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IProductOnStock, ProductOnStock } from 'app/shared/model/product-on-stock.model';
import { ProductOnStockService } from './product-on-stock.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-product-on-stock-update',
  templateUrl: './product-on-stock-update.component.html'
})
export class ProductOnStockUpdateComponent implements OnInit {
  isSaving: boolean;

  products: IProduct[];

  restaurants: IRestaurant[];
  deliveryDateDp: any;

  editForm = this.fb.group({
    id: [],
    deliveryDate: [],
    quantity: [],
    purchPriceNet: [],
    purchPriceGross: [],
    purchVatValue: [],
    sellPriceNet: [],
    sellPriceGross: [null, [Validators.required]],
    sellVatValue: [],
    product: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected productOnStockService: ProductOnStockService,
    protected productService: ProductService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ productOnStock }) => {
      this.updateForm(productOnStock);
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

  updateForm(productOnStock: IProductOnStock) {
    this.editForm.patchValue({
      id: productOnStock.id,
      deliveryDate: productOnStock.deliveryDate,
      quantity: productOnStock.quantity,
      purchPriceNet: productOnStock.purchPriceNet,
      purchPriceGross: productOnStock.purchPriceGross,
      purchVatValue: productOnStock.purchVatValue,
      sellPriceNet: productOnStock.sellPriceNet,
      sellPriceGross: productOnStock.sellPriceGross,
      sellVatValue: productOnStock.sellVatValue,
      product: productOnStock.product,
      restaurant: productOnStock.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const productOnStock = this.createFromForm();
    if (productOnStock.id !== undefined) {
      this.subscribeToSaveResponse(this.productOnStockService.update(productOnStock));
    } else {
      this.subscribeToSaveResponse(this.productOnStockService.create(productOnStock));
    }
  }

  private createFromForm(): IProductOnStock {
    return {
      ...new ProductOnStock(),
      id: this.editForm.get(['id']).value,
      deliveryDate: this.editForm.get(['deliveryDate']).value,
      quantity: this.editForm.get(['quantity']).value,
      purchPriceNet: this.editForm.get(['purchPriceNet']).value,
      purchPriceGross: this.editForm.get(['purchPriceGross']).value,
      purchVatValue: this.editForm.get(['purchVatValue']).value,
      sellPriceNet: this.editForm.get(['sellPriceNet']).value,
      sellPriceGross: this.editForm.get(['sellPriceGross']).value,
      sellVatValue: this.editForm.get(['sellVatValue']).value,
      product: this.editForm.get(['product']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductOnStock>>) {
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
