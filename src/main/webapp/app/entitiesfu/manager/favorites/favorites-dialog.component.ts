import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { FavoritesPopupService } from './favorites-popup.service';
import { FavoritesService } from './favorites.service';
import { ActiveProductService } from '../../../entitiesfu/active-entities/active-product.service';
import { Favorite } from '../../../shared/model/favorite.model';
import { Product } from '../../../shared/model/product.model';

@Component({
  selector: 'jhi-favorites-dialog',
  templateUrl: './favorites-dialog.component.html'
})
export class FavoritesDialogComponent implements OnInit {
  favorite: Favorite;
  isSaving: boolean;

  products: Product[];

  //    restaurants: Restaurant[];

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private favoritesService: FavoritesService,
    private productService: ActiveProductService,
    //        private restaurantService: RestaurantService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.productService.query().subscribe(
      (res: HttpResponse<Product[]>) => {
        this.products = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.favorite.id !== undefined) {
      this.subscribeToSaveResponse(this.favoritesService.update(this.favorite));
    } else {
      this.subscribeToSaveResponse(this.favoritesService.create(this.favorite));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Favorite>>) {
    result.subscribe((res: HttpResponse<Favorite>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: Favorite) {
    this.eventManager.broadcast({ name: 'favoriteListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }

  //    trackRestaurantById(index: number, item: Restaurant) {
  //        return item.id;
  //    }
}

@Component({
  selector: 'jhi-favorites-popup',
  template: ''
})
export class FavoritesPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private favoritesPopupService: FavoritesPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.favoritesPopupService.open(FavoritesDialogComponent as Component, params['id']);
      } else {
        this.favoritesPopupService.open(FavoritesDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
