import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFavorite } from 'app/shared/model/favorite.model';

@Component({
  selector: 'jhi-favorite-detail',
  templateUrl: './favorite-detail.component.html'
})
export class FavoriteDetailComponent implements OnInit {
  favorite: IFavorite;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ favorite }) => {
      this.favorite = favorite;
    });
  }

  previousState() {
    window.history.back();
  }
}
