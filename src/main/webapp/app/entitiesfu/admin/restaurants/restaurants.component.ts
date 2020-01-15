import { AccountService } from 'app/core/auth/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { RestaurantSummary } from '../../models/restaurant-summary.model';
import { AdminRestaurantsService } from './restaurants.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-restaurants',
  templateUrl: './restaurants.component.html'
})
export class RestaurantsComponent implements OnInit, OnDestroy {
  currentAccount: any;
  categories: Array<Object> = [];
  restaurants: RestaurantSummary[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  subString = null;
  subCount = null;
  currentParentCategory = null;
  spinner = false;

  constructor(
    private restaurantService: AdminRestaurantsService,
    private parseLinks: JhiParseLinks,
    private jhiAlertService: JhiAlertService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAll() {
    this.spinner = true;
    this.categories.length = 0;
    //    if (this.currentSearch) {
    //      this.categoryService.search({
    //        query: this.currentSearch,
    //      }).subscribe(
    //                    (res: HttpResponse<Category[]>) => this.onSuccess(res.body, res.headers),
    //                    (res: HttpErrorResponse) => this.onError(res.message)
    //        );
    //      return;
    //    }
    this.restaurantService.query().subscribe(
      (res: HttpResponse<RestaurantSummary[]>) => {
        this.onSuccess(res.body, res.headers);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  private onSuccess(data, headers) {
    this.restaurants = data;
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInRestaurant();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: RestaurantSummary) {
    return item.restaurant.id;
  }
  registerChangeInRestaurant() {
    this.eventSubscriber = this.eventManager.subscribe('restaurantsListModification', response => this.loadAll());
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
