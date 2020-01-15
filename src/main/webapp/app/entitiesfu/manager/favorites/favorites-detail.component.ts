import { Favorite } from '../../../shared/model/favorite.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { FavoritesService } from './favorites.service';

@Component({
  selector: 'jhi-favorites-detail',
  templateUrl: './favorites-detail.component.html'
})
export class FavoritesDetailComponent implements OnInit, OnDestroy {
  favorite: Favorite;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(private eventManager: JhiEventManager, private favoritesService: FavoritesService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInFavorites();
  }

  load(id) {
    this.favoritesService.find(id).subscribe((favoriteResponse: HttpResponse<Favorite>) => {
      this.favorite = favoriteResponse.body;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInFavorites() {
    this.eventSubscriber = this.eventManager.subscribe('favoriteListModification', response => this.load(this.favorite.id));
  }
}
