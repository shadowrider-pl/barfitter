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
import { IOrderOpened, OrderOpened } from 'app/shared/model/order-opened.model';
import { OrderOpenedService } from './order-opened.service';
import { IPayment } from 'app/shared/model/payment.model';
import { PaymentService } from 'app/entities/payment/payment.service';
import { IDesk } from 'app/shared/model/desk.model';
import { DeskService } from 'app/entities/desk/desk.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-order-opened-update',
  templateUrl: './order-opened-update.component.html'
})
export class OrderOpenedUpdateComponent implements OnInit {
  isSaving: boolean;

  payments: IPayment[];

  desks: IDesk[];

  users: IUser[];

  restaurants: IRestaurant[];

  editForm = this.fb.group({
    id: [],
    total: [],
    comment: [],
    openingTime: [],
    closingTime: [],
    orderId: [],
    payment: [],
    desk: [],
    barman: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected orderOpenedService: OrderOpenedService,
    protected paymentService: PaymentService,
    protected deskService: DeskService,
    protected userService: UserService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ orderOpened }) => {
      this.updateForm(orderOpened);
    });
    this.paymentService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPayment[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPayment[]>) => response.body)
      )
      .subscribe((res: IPayment[]) => (this.payments = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.deskService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IDesk[]>) => mayBeOk.ok),
        map((response: HttpResponse<IDesk[]>) => response.body)
      )
      .subscribe((res: IDesk[]) => (this.desks = res), (res: HttpErrorResponse) => this.onError(res.message));
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

  updateForm(orderOpened: IOrderOpened) {
    this.editForm.patchValue({
      id: orderOpened.id,
      total: orderOpened.total,
      comment: orderOpened.comment,
      openingTime: orderOpened.openingTime != null ? orderOpened.openingTime.format(DATE_TIME_FORMAT) : null,
      closingTime: orderOpened.closingTime != null ? orderOpened.closingTime.format(DATE_TIME_FORMAT) : null,
      orderId: orderOpened.orderId,
      payment: orderOpened.payment,
      desk: orderOpened.desk,
      barman: orderOpened.barman,
      restaurant: orderOpened.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const orderOpened = this.createFromForm();
    if (orderOpened.id !== undefined) {
      this.subscribeToSaveResponse(this.orderOpenedService.update(orderOpened));
    } else {
      this.subscribeToSaveResponse(this.orderOpenedService.create(orderOpened));
    }
  }

  private createFromForm(): IOrderOpened {
    return {
      ...new OrderOpened(),
      id: this.editForm.get(['id']).value,
      total: this.editForm.get(['total']).value,
      comment: this.editForm.get(['comment']).value,
      openingTime:
        this.editForm.get(['openingTime']).value != null ? moment(this.editForm.get(['openingTime']).value, DATE_TIME_FORMAT) : undefined,
      closingTime:
        this.editForm.get(['closingTime']).value != null ? moment(this.editForm.get(['closingTime']).value, DATE_TIME_FORMAT) : undefined,
      orderId: this.editForm.get(['orderId']).value,
      payment: this.editForm.get(['payment']).value,
      desk: this.editForm.get(['desk']).value,
      barman: this.editForm.get(['barman']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderOpened>>) {
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

  trackPaymentById(index: number, item: IPayment) {
    return item.id;
  }

  trackDeskById(index: number, item: IDesk) {
    return item.id;
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }
}
