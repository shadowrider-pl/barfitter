import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IProduct, Product } from 'app/shared/model/product.model';
import { ProductService } from './product.service';
import { IVat } from 'app/shared/model/vat.model';
import { VatService } from 'app/entities/vat/vat.service';
import { IProductType } from 'app/shared/model/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from 'app/entities/category/category.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html'
})
export class ProductUpdateComponent implements OnInit {
  isSaving: boolean;

  vats: IVat[];

  producttypes: IProductType[];

  categories: ICategory[];

  restaurants: IRestaurant[];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    purchPriceNet: [],
    sellPriceGross: [null, [Validators.required]],
    active: [],
    purchPriceGross: [],
    purchVatValue: [],
    sellPriceNet: [],
    sellVatValue: [],
    productSellPriceRate: [],
    productPurchPriceRate: [],
    productType: [],
    category: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected productService: ProductService,
    protected vatService: VatService,
    protected productTypeService: ProductTypeService,
    protected categoryService: CategoryService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ product }) => {
      this.updateForm(product);
    });
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

  updateForm(product: IProduct) {
    this.editForm.patchValue({
      id: product.id,
      name: product.name,
      purchPriceNet: product.purchPriceNet,
      sellPriceGross: product.sellPriceGross,
      active: product.active,
      purchPriceGross: product.purchPriceGross,
      purchVatValue: product.purchVatValue,
      sellPriceNet: product.sellPriceNet,
      sellVatValue: product.sellVatValue,
      productSellPriceRate: product.productSellPriceRate,
      productPurchPriceRate: product.productPurchPriceRate,
      productType: product.productType,
      category: product.category,
      restaurant: product.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  private createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      purchPriceNet: this.editForm.get(['purchPriceNet']).value,
      sellPriceGross: this.editForm.get(['sellPriceGross']).value,
      active: this.editForm.get(['active']).value,
      purchPriceGross: this.editForm.get(['purchPriceGross']).value,
      purchVatValue: this.editForm.get(['purchVatValue']).value,
      sellPriceNet: this.editForm.get(['sellPriceNet']).value,
      sellVatValue: this.editForm.get(['sellVatValue']).value,
      productSellPriceRate: this.editForm.get(['productSellPriceRate']).value,
      productPurchPriceRate: this.editForm.get(['productPurchPriceRate']).value,
      productType: this.editForm.get(['productType']).value,
      category: this.editForm.get(['category']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>) {
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

  trackVatById(index: number, item: IVat) {
    return item.id;
  }

  trackProductTypeById(index: number, item: IProductType) {
    return item.id;
  }

  trackCategoryById(index: number, item: ICategory) {
    return item.id;
  }

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }
}
