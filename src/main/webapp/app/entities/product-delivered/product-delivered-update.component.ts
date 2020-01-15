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
import { IProductDelivered, ProductDelivered } from 'app/shared/model/product-delivered.model';
import { ProductDeliveredService } from './product-delivered.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category/category.service';
import { IVat } from 'app/shared/model/vat.model';
import { VatService } from 'app/entities/vat/vat.service';
import { IProductType } from 'app/shared/model/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-product-delivered-update',
  templateUrl: './product-delivered-update.component.html'
})
export class ProductDeliveredUpdateComponent implements OnInit {
  isSaving: boolean;

  products: IProduct[];

  categories: ICategory[];

  vats: IVat[];

  producttypes: IProductType[];

  restaurants: IRestaurant[];
  deliveryDateDp: any;

  editForm = this.fb.group({
    id: [],
    name: [],
    deliveryDate: [],
    quantity: [],
    purchPriceGross: [],
    sellPriceGross: [null, [Validators.required]],
    purchPriceNet: [],
    purchVatValue: [],
    sellPriceNet: [],
    sellVatValue: [],
    product: [],
    category: [],
    productDeliveredPurchPriceRate: [],
    productDeliveredSellPriceRate: [],
    productType: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected productDeliveredService: ProductDeliveredService,
    protected productService: ProductService,
    protected categoryService: CategoryService,
    protected vatService: VatService,
    protected productTypeService: ProductTypeService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ productDelivered }) => {
      this.updateForm(productDelivered);
    });
    this.productService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IProduct[]>) => mayBeOk.ok),
        map((response: HttpResponse<IProduct[]>) => response.body)
      )
      .subscribe((res: IProduct[]) => (this.products = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.categoryService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICategory[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICategory[]>) => response.body)
      )
      .subscribe((res: ICategory[]) => (this.categories = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.vatService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IVat[]>) => mayBeOk.ok),
        map((response: HttpResponse<IVat[]>) => response.body)
      )
      .subscribe((res: IVat[]) => (this.vats = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.productTypeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IProductType[]>) => mayBeOk.ok),
        map((response: HttpResponse<IProductType[]>) => response.body)
      )
      .subscribe((res: IProductType[]) => (this.producttypes = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.restaurantService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IRestaurant[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRestaurant[]>) => response.body)
      )
      .subscribe((res: IRestaurant[]) => (this.restaurants = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(productDelivered: IProductDelivered) {
    this.editForm.patchValue({
      id: productDelivered.id,
      name: productDelivered.name,
      deliveryDate: productDelivered.deliveryDate,
      quantity: productDelivered.quantity,
      purchPriceGross: productDelivered.purchPriceGross,
      sellPriceGross: productDelivered.sellPriceGross,
      purchPriceNet: productDelivered.purchPriceNet,
      purchVatValue: productDelivered.purchVatValue,
      sellPriceNet: productDelivered.sellPriceNet,
      sellVatValue: productDelivered.sellVatValue,
      product: productDelivered.product,
      category: productDelivered.category,
      productDeliveredPurchPriceRate: productDelivered.productDeliveredPurchPriceRate,
      productDeliveredSellPriceRate: productDelivered.productDeliveredSellPriceRate,
      productType: productDelivered.productType,
      restaurant: productDelivered.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const productDelivered = this.createFromForm();
    if (productDelivered.id !== undefined) {
      this.subscribeToSaveResponse(this.productDeliveredService.update(productDelivered));
    } else {
      this.subscribeToSaveResponse(this.productDeliveredService.create(productDelivered));
    }
  }

  private createFromForm(): IProductDelivered {
    return {
      ...new ProductDelivered(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      deliveryDate: this.editForm.get(['deliveryDate']).value,
      quantity: this.editForm.get(['quantity']).value,
      purchPriceGross: this.editForm.get(['purchPriceGross']).value,
      sellPriceGross: this.editForm.get(['sellPriceGross']).value,
      purchPriceNet: this.editForm.get(['purchPriceNet']).value,
      purchVatValue: this.editForm.get(['purchVatValue']).value,
      sellPriceNet: this.editForm.get(['sellPriceNet']).value,
      sellVatValue: this.editForm.get(['sellVatValue']).value,
      product: this.editForm.get(['product']).value,
      category: this.editForm.get(['category']).value,
      productDeliveredPurchPriceRate: this.editForm.get(['productDeliveredPurchPriceRate']).value,
      productDeliveredSellPriceRate: this.editForm.get(['productDeliveredSellPriceRate']).value,
      productType: this.editForm.get(['productType']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductDelivered>>) {
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

  trackCategoryById(index: number, item: ICategory) {
    return item.id;
  }

  trackVatById(index: number, item: IVat) {
    return item.id;
  }

  trackProductTypeById(index: number, item: IProductType) {
    return item.id;
  }

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }
}
