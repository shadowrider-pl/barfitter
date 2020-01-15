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
import { ICashup, Cashup } from 'app/shared/model/cashup.model';
import { CashupService } from './cashup.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';

@Component({
  selector: 'jhi-cashup-update',
  templateUrl: './cashup-update.component.html'
})
export class CashupUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  restaurants: IRestaurant[];

  editForm = this.fb.group({
    id: [],
    barmanLoginTime: [null, [Validators.required]],
    cashupTime: [],
    startCash: [],
    endCash: [],
    totalSale: [],
    cashTakenByManager: [],
    cashTakenByBoss: [],
    comment: [],
    cashupUser: [],
    openingUser: [],
    restaurant: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected cashupService: CashupService,
    protected userService: UserService,
    protected restaurantService: RestaurantService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ cashup }) => {
      this.updateForm(cashup);
    });
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

  updateForm(cashup: ICashup) {
    this.editForm.patchValue({
      id: cashup.id,
      barmanLoginTime: cashup.barmanLoginTime != null ? cashup.barmanLoginTime.format(DATE_TIME_FORMAT) : null,
      cashupTime: cashup.cashupTime != null ? cashup.cashupTime.format(DATE_TIME_FORMAT) : null,
      startCash: cashup.startCash,
      endCash: cashup.endCash,
      totalSale: cashup.totalSale,
      cashTakenByManager: cashup.cashTakenByManager,
      cashTakenByBoss: cashup.cashTakenByBoss,
      comment: cashup.comment,
      cashupUser: cashup.cashupUser,
      openingUser: cashup.openingUser,
      restaurant: cashup.restaurant
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const cashup = this.createFromForm();
    if (cashup.id !== undefined) {
      this.subscribeToSaveResponse(this.cashupService.update(cashup));
    } else {
      this.subscribeToSaveResponse(this.cashupService.create(cashup));
    }
  }

  private createFromForm(): ICashup {
    return {
      ...new Cashup(),
      id: this.editForm.get(['id']).value,
      barmanLoginTime:
        this.editForm.get(['barmanLoginTime']).value != null
          ? moment(this.editForm.get(['barmanLoginTime']).value, DATE_TIME_FORMAT)
          : undefined,
      cashupTime:
        this.editForm.get(['cashupTime']).value != null ? moment(this.editForm.get(['cashupTime']).value, DATE_TIME_FORMAT) : undefined,
      startCash: this.editForm.get(['startCash']).value,
      endCash: this.editForm.get(['endCash']).value,
      totalSale: this.editForm.get(['totalSale']).value,
      cashTakenByManager: this.editForm.get(['cashTakenByManager']).value,
      cashTakenByBoss: this.editForm.get(['cashTakenByBoss']).value,
      comment: this.editForm.get(['comment']).value,
      cashupUser: this.editForm.get(['cashupUser']).value,
      openingUser: this.editForm.get(['openingUser']).value,
      restaurant: this.editForm.get(['restaurant']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICashup>>) {
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

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }
}
