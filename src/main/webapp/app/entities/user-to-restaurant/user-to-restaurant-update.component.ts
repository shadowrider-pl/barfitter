import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IUserToRestaurant, UserToRestaurant } from 'app/shared/model/user-to-restaurant.model';
import { UserToRestaurantService } from './user-to-restaurant.service';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';
import { IUser } from 'app/core/user/user.model';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'jhi-user-to-restaurant-update',
  templateUrl: './user-to-restaurant-update.component.html'
})
export class UserToRestaurantUpdateComponent implements OnInit {
  isSaving: boolean;

  restaurants: IRestaurant[];

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    restaurant: [],
    user: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected userToRestaurantService: UserToRestaurantService,
    protected restaurantService: RestaurantService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ userToRestaurant }) => {
      this.updateForm(userToRestaurant);
    });
    this.restaurantService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IRestaurant[]>) => mayBeOk.ok),
        map((response: HttpResponse<IRestaurant[]>) => response.body)
      )
      .subscribe((res: IRestaurant[]) => (this.restaurants = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(userToRestaurant: IUserToRestaurant) {
    this.editForm.patchValue({
      id: userToRestaurant.id,
      restaurant: userToRestaurant.restaurant,
      user: userToRestaurant.user
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const userToRestaurant = this.createFromForm();
    if (userToRestaurant.id !== undefined) {
      this.subscribeToSaveResponse(this.userToRestaurantService.update(userToRestaurant));
    } else {
      this.subscribeToSaveResponse(this.userToRestaurantService.create(userToRestaurant));
    }
  }

  private createFromForm(): IUserToRestaurant {
    return {
      ...new UserToRestaurant(),
      id: this.editForm.get(['id']).value,
      restaurant: this.editForm.get(['restaurant']).value,
      user: this.editForm.get(['user']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserToRestaurant>>) {
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

  trackRestaurantById(index: number, item: IRestaurant) {
    return item.id;
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
