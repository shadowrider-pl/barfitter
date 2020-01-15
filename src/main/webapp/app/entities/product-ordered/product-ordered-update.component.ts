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
import { IProductOrdered, ProductOrdered } from 'app/shared/model/product-ordered.model';
import { ProductOrderedService } from './product-ordered.service';
import { IOrderOpened } from 'app/shared/model/order-opened.model';
import { OrderOpenedService } from 'app/entities/order-opened/order-opened.service';
import { IOrderedProductStatus } from 'app/shared/model/ordered-product-status.model';
import { OrderedProductStatusService } from 'app/entities/ordered-product-status/ordered-product-status.service';
import { IVat } from 'app/shared/model/vat.model';
import { VatService } from 'app/entities/vat/vat.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-product-ordered-update',
  templateUrl: './product-ordered-update.component.html'
})
export class ProductOrderedUpdateComponent implements OnInit {
  isSaving: boolean;

  orderopeneds: IOrderOpened[];

  orderedproductstatuses: IOrderedProductStatus[];

  vats: IVat[];

  products: IProduct[];

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
    orderPosition: [],
    sendTime: [],
    order: [],
    orderedProductStatus: [],
    productOrderedPurchPriceRate: [],
    productOrderedSellPriceRate: [],
    product: [],
    chef: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected productOrderedService: ProductOrderedService,
    protected orderOpenedService: OrderOpenedService,
    protected orderedProductStatusService: OrderedProductStatusService,
    protected vatService: VatService,
    protected productService: ProductService,
    protected userService: UserService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ productOrdered }) => {
      this.updateForm(productOrdered);
    });
    this.orderOpenedService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IOrderOpened[]>) => mayBeOk.ok),
        map((response: HttpResponse<IOrderOpened[]>) => response.body)
      )
      .subscribe((res: IOrderOpened[]) => (this.orderopeneds = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.orderedProductStatusService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IOrderedProductStatus[]>) => mayBeOk.ok),
        map((response: HttpResponse<IOrderedProductStatus[]>) => response.body)
      )
      .subscribe(
        (res: IOrderedProductStatus[]) => (this.orderedproductstatuses = res),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.vatService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IVat[]>) => mayBeOk.ok),
        map((response: HttpResponse<IVat[]>) => response.body)
      )
      .subscribe((res: IVat[]) => (this.vats = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.productService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IProduct[]>) => mayBeOk.ok),
        map((response: HttpResponse<IProduct[]>) => response.body)
      )
      .subscribe((res: IProduct[]) => (this.products = res), (res: HttpErrorResponse) => this.onError(res.message));
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

  updateForm(productOrdered: IProductOrdered) {
    this.editForm.patchValue({
      id: productOrdered.id,
      orderedTime: productOrdered.orderedTime != null ? productOrdered.orderedTime.format(DATE_TIME_FORMAT) : null,
      acceptedTime: productOrdered.acceptedTime != null ? productOrdered.acceptedTime.format(DATE_TIME_FORMAT) : null,
      finishedTime: productOrdered.finishedTime != null ? productOrdered.finishedTime.format(DATE_TIME_FORMAT) : null,
      takenTime: productOrdered.takenTime != null ? productOrdered.takenTime.format(DATE_TIME_FORMAT) : null,
      quantity: productOrdered.quantity,
      comment: productOrdered.comment,
      purchPriceNet: productOrdered.purchPriceNet,
      purchPriceGross: productOrdered.purchPriceGross,
      purchVatValue: productOrdered.purchVatValue,
      sellPriceNet: productOrdered.sellPriceNet,
      sellPriceGross: productOrdered.sellPriceGross,
      sellVatValue: productOrdered.sellVatValue,
      difference: productOrdered.difference,
      deliveryDate: productOrdered.deliveryDate,
      orderPosition: productOrdered.orderPosition,
      sendTime: productOrdered.sendTime != null ? productOrdered.sendTime.format(DATE_TIME_FORMAT) : null,
      order: productOrdered.order,
      orderedProductStatus: productOrdered.orderedProductStatus,
      productOrderedPurchPriceRate: productOrdered.productOrderedPurchPriceRate,
      productOrderedSellPriceRate: productOrdered.productOrderedSellPriceRate,
      product: productOrdered.product,
      chef: productOrdered.chef,
      restaurant: productOrdered.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const productOrdered = this.createFromForm();
    if (productOrdered.id !== undefined) {
      this.subscribeToSaveResponse(this.productOrderedService.update(productOrdered));
    } else {
      this.subscribeToSaveResponse(this.productOrderedService.create(productOrdered));
    }
  }

  private createFromForm(): IProductOrdered {
    return {
      ...new ProductOrdered(),
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
      orderPosition: this.editForm.get(['orderPosition']).value,
      sendTime: this.editForm.get(['sendTime']).value != null ? moment(this.editForm.get(['sendTime']).value, DATE_TIME_FORMAT) : undefined,
      order: this.editForm.get(['order']).value,
      orderedProductStatus: this.editForm.get(['orderedProductStatus']).value,
      productOrderedPurchPriceRate: this.editForm.get(['productOrderedPurchPriceRate']).value,
      productOrderedSellPriceRate: this.editForm.get(['productOrderedSellPriceRate']).value,
      product: this.editForm.get(['product']).value,
      chef: this.editForm.get(['chef']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductOrdered>>) {
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

  trackOrderOpenedById(index: number, item: IOrderOpened) {
    return item.id;
  }

  trackOrderedProductStatusById(index: number, item: IOrderedProductStatus) {
    return item.id;
  }

  trackVatById(index: number, item: IVat) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }
}
