import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IProductSold, ProductSold } from 'app/shared/model/product-sold.model';
import { ProductSoldService } from './product-sold.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IOrderClosed } from 'app/shared/model/order-closed.model';
import { OrderClosedService } from 'app/entities/order-closed/order-closed.service';
import { IVat } from 'app/shared/model/vat.model';
import { VatService } from 'app/entities/vat/vat.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-product-sold-update',
  templateUrl: './product-sold-update.component.html'
})
export class ProductSoldUpdateComponent implements OnInit {
  isSaving: boolean;

  products: IProduct[];

  ordercloseds: IOrderClosed[];

  vats: IVat[];

  users: IUser[];

  restaurants: IRestaurant[];
  deliveryDateDp: any;

  editForm = this.fb.group({
    id: [],
    orderedTime: [null, [Validators.required]],
    acceptedTime: [],
    finishedTime: [],
    takenTime: [],
    quantity: [],
    comment: [],
    purchPriceNet: [],
    purchPriceGross: [],
    purchVatValue: [],
    sellPriceNet: [],
    sellPriceGross: [],
    sellVatValue: [],
    difference: [],
    deliveryDate: [],
    sendTime: [],
    product: [],
    order: [],
    productSoldPurchPriceRate: [],
    productSoldSellPriceRate: [],
    chef: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected productSoldService: ProductSoldService,
    protected productService: ProductService,
    protected orderClosedService: OrderClosedService,
    protected vatService: VatService,
    protected userService: UserService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ productSold }) => {
      this.updateForm(productSold);
    });
    this.productService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IProduct[]>) => mayBeOk.ok),
        map((response: HttpResponse<IProduct[]>) => response.body)
      )
      .subscribe((res: IProduct[]) => (this.products = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.orderClosedService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IOrderClosed[]>) => mayBeOk.ok),
        map((response: HttpResponse<IOrderClosed[]>) => response.body)
      )
      .subscribe((res: IOrderClosed[]) => (this.ordercloseds = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.vatService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IVat[]>) => mayBeOk.ok),
        map((response: HttpResponse<IVat[]>) => response.body)
      )
      .subscribe((res: IVat[]) => (this.vats = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.restaurantService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IRestaurant[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRestaurant[]>) => response.body)
      )
      .subscribe((res: IRestaurant[]) => (this.restaurants = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(productSold: IProductSold) {
    this.editForm.patchValue({
      id: productSold.id,
      orderedTime: productSold.orderedTime != null ? productSold.orderedTime.format(DATE_TIME_FORMAT) : null,
      acceptedTime: productSold.acceptedTime != null ? productSold.acceptedTime.format(DATE_TIME_FORMAT) : null,
      finishedTime: productSold.finishedTime != null ? productSold.finishedTime.format(DATE_TIME_FORMAT) : null,
      takenTime: productSold.takenTime != null ? productSold.takenTime.format(DATE_TIME_FORMAT) : null,
      quantity: productSold.quantity,
      comment: productSold.comment,
      purchPriceNet: productSold.purchPriceNet,
      purchPriceGross: productSold.purchPriceGross,
      purchVatValue: productSold.purchVatValue,
      sellPriceNet: productSold.sellPriceNet,
      sellPriceGross: productSold.sellPriceGross,
      sellVatValue: productSold.sellVatValue,
      difference: productSold.difference,
      deliveryDate: productSold.deliveryDate,
      sendTime: productSold.sendTime != null ? productSold.sendTime.format(DATE_TIME_FORMAT) : null,
      product: productSold.product,
      order: productSold.order,
      productSoldPurchPriceRate: productSold.productSoldPurchPriceRate,
      productSoldSellPriceRate: productSold.productSoldSellPriceRate,
      chef: productSold.chef,
      restaurant: productSold.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const productSold = this.createFromForm();
    if (productSold.id !== undefined) {
      this.subscribeToSaveResponse(this.productSoldService.update(productSold));
    } else {
      this.subscribeToSaveResponse(this.productSoldService.create(productSold));
    }
  }

  private createFromForm(): IProductSold {
    return {
      ...new ProductSold(),
      id: this.editForm.get(['id']).value,
      orderedTime:
        this.editForm.get(['orderedTime']).value != null ? moment(this.editForm.get(['orderedTime']).value, DATE_TIME_FORMAT) : undefined,
      acceptedTime:
        this.editForm.get(['acceptedTime']).value != null ? moment(this.editForm.get(['acceptedTime']).value, DATE_TIME_FORMAT) : undefined,
      finishedTime:
        this.editForm.get(['finishedTime']).value != null ? moment(this.editForm.get(['finishedTime']).value, DATE_TIME_FORMAT) : undefined,
      takenTime:
        this.editForm.get(['takenTime']).value != null ? moment(this.editForm.get(['takenTime']).value, DATE_TIME_FORMAT) : undefined,
      quantity: this.editForm.get(['quantity']).value,
      comment: this.editForm.get(['comment']).value,
      purchPriceNet: this.editForm.get(['purchPriceNet']).value,
      purchPriceGross: this.editForm.get(['purchPriceGross']).value,
      purchVatValue: this.editForm.get(['purchVatValue']).value,
      sellPriceNet: this.editForm.get(['sellPriceNet']).value,
      sellPriceGross: this.editForm.get(['sellPriceGross']).value,
      sellVatValue: this.editForm.get(['sellVatValue']).value,
      difference: this.editForm.get(['difference']).value,
      deliveryDate: this.editForm.get(['deliveryDate']).value,
      sendTime: this.editForm.get(['sendTime']).value != null ? moment(this.editForm.get(['sendTime']).value, DATE_TIME_FORMAT) : undefined,
      product: this.editForm.get(['product']).value,
      order: this.editForm.get(['order']).value,
      productSoldPurchPriceRate: this.editForm.get(['productSoldPurchPriceRate']).value,
      productSoldSellPriceRate: this.editForm.get(['productSoldSellPriceRate']).value,
      chef: this.editForm.get(['chef']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductSold>>) {
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

  trackOrderClosedById(index: number, item: IOrderClosed) {
    return item.id;
  }

  trackVatById(index: number, item: IVat) {
    return item.id;
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }
}
