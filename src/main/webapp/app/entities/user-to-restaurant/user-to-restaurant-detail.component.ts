import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserToRestaurant } from 'app/shared/model/user-to-restaurant.model';

@Component({
  selector: 'jhi-user-to-restaurant-detail',
  templateUrl: './user-to-restaurant-detail.component.html'
})
export class UserToRestaurantDetailComponent implements OnInit {
  userToRestaurant: IUserToRestaurant;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ userToRestaurant }) => {
      this.userToRestaurant = userToRestaurant;
    });
  }

  previousState() {
    window.history.back();
  }
}
