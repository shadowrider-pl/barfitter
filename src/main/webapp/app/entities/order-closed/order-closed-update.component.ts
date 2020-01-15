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
import { IOrderClosed, OrderClosed } from 'app/shared/model/order-closed.model';
import { OrderClosedService } from './order-closed.service';
import { ICashup } from 'app/shared/model/cashup.model';
import { CashupService } from 'app/entities/cashup/cashup.service';
import { IDesk } from 'app/shared/model/desk.model';
import { DeskService } from 'app/entities/desk/desk.service';
import { IPayment } from 'app/shared/model/payment.model';
import { PaymentService } from 'app/entities/payment/payment.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-order-closed-update',
  templateUrl: './order-closed-update.component.html'
})
export class OrderClosedUpdateComponent implements OnInit {
  isSaving: boolean;

  cashups: ICashup[];

  desks: IDesk[];

  payments: IPayment[];

  users: IUser[];

  restaurants: IRestaurant[];

  editForm = this.fb.group({
    id: [],
    openingTime: [null, [Validators.required]],
    closingTime: [null, [Validators.required]],
    total: [],
    comment: [],
    orderId: [],
    cashupDay: [],
    desk: [],
    payment: [],
    barman: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected orderClosedService: OrderClosedService,
    protected cashupService: CashupService,
    protected deskService: DeskService,
    protected paymentService: PaymentService,
    protected userService: UserService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ orderClosed }) => {
      this.updateForm(orderClosed);
    });
    this.cashupService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICashup[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICashup[]>) => response.body)
      )
      .subscribe((res: ICashup[]) => (this.cashups = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.deskService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IDesk[]>) => mayBeOk.ok),
        map((response: HttpResponse<IDesk[]>) => response.body)
      )
      .subscribe((res: IDesk[]) => (this.desks = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.paymentService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPayment[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPayment[]>) => response.body)
      )
      .subscribe((res: IPayment[]) => (this.payments = res), (res: HttpErrorResponse) => this.onError(res.message));
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

  updateForm(orderClosed: IOrderClosed) {
    this.editForm.patchValue({
      id: orderClosed.id,
      openingTime: orderClosed.openingTime != null ? orderClosed.openingTime.format(DATE_TIME_FORMAT) : null,
      closingTime: orderClosed.closingTime != null ? orderClosed.closingTime.format(DATE_TIME_FORMAT) : null,
      total: orderClosed.total,
      comment: orderClosed.comment,
      orderId: orderClosed.orderId,
      cashupDay: orderClosed.cashupDay,
      desk: orderClosed.desk,
      payment: orderClosed.payment,
      barman: orderClosed.barman,
      restaurant: orderClosed.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const orderClosed = this.createFromForm();
    if (orderClosed.id !== undefined) {
      this.subscribeToSaveResponse(this.orderClosedService.update(orderClosed));
    } else {
      this.subscribeToSaveResponse(this.orderClosedService.create(orderClosed));
    }
  }

  private createFromForm(): IOrderClosed {
    return {
      ...new OrderClosed(),
      id: this.editForm.get(['id']).value,
      openingTime:
        this.editForm.get(['openingTime']).value != null ? moment(this.editForm.get(['openingTime']).value, DATE_TIME_FORMAT) : undefined,
      closingTime:
        this.editForm.get(['closingTime']).value != null ? moment(this.editForm.get(['closingTime']).value, DATE_TIME_FORMAT) : undefined,
      total: this.editForm.get(['total']).value,
      comment: this.editForm.get(['comment']).value,
      orderId: this.editForm.get(['orderId']).value,
      cashupDay: this.editForm.get(['cashupDay']).value,
      desk: this.editForm.get(['desk']).value,
      payment: this.editForm.get(['payment']).value,
      barman: this.editForm.get(['barman']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderClosed>>) {
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

  trackCashupById(index: number, item: ICashup) {
    return item.id;
  }

  trackDeskById(index: number, item: IDesk) {
    return item.id;
  }

  trackPaymentById(index: number, item: IPayment) {
    return item.id;
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }
}
