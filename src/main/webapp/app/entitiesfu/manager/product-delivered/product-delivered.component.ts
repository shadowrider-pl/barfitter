import { AccountService } from 'app/core/auth/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { ProductDeliveredService } from './product-delivered.service';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ProductDelivered } from '../../../shared/model/product-delivered.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-product-delivered',
  templateUrl: './product-delivered.component.html'
})
export class ProductDeliveredComponent implements OnInit, OnDestroy {
  currentAccount: any;
  productDelivereds = [];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  routeData: any;
  links: any;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  constructor(
    private productDeliveredService: ProductDeliveredService,
    private parseLinks: JhiParseLinks,
    private jhiAlertService: JhiAlertService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private eventManager: JhiEventManager
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAll() {
    //        if (this.currentSearch) {
    //            this.productDeliveredService.search({
    //                page: this.page - 1,
    //                query: this.currentSearch,
    //                size: this.itemsPerPage,
    //                sort: this.sort()}).subscribe(
    //                    (res: HttpResponse<ProductDelivered[]>) => this.onSuccess(res.body, res.headers),
    //                    (res: HttpErrorResponse) => this.onError(res.message)
    //                );
    //            return;
    //        }
    this.productDeliveredService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort()
      })
      .subscribe(
        (res: HttpResponse<ProductDelivered[]>) => this.onSuccess(res.body, res.headers),
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }
  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
  transition() {
    this.router.navigate(['/product-delivered'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        search: this.currentSearch,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    });
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.router.navigate([
      '/product-delivered',
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }
  search(query) {
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.router.navigate([
      '/product-delivered',
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    ]);
    this.loadAll();
  }
  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInProductDelivereds();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ProductDelivered) {
    return item.id;
  }
  registerChangeInProductDelivereds() {
    this.eventSubscriber = this.eventManager.subscribe('productDeliveredListModification', response => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  private onSuccess(data, headers) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = headers.get('X-Total-Count');
    this.queryCount = this.totalItems;
    // this.page = pagingParams.page;
    this.productDelivereds = data;
    this.translateProducttypes();
  }

  translateProducttypes() {
    for (let i = 0; i < this.productDelivereds.length; i++) {
      switch (this.productDelivereds[i].productType.id) {
        case 1: {
          this.productDelivereds[i].productType.description = this.translateService.instant('barfitterApp.productType.ready');
          break;
        }
        case 2: {
          this.productDelivereds[i].productType.description = this.translateService.instant('barfitterApp.productType.madeInKithen');
          break;
        }
        case 3: {
          this.productDelivereds[i].productType.description = this.translateService.instant('barfitterApp.productType.madeAtBar');
          break;
        }
      }
    }
  }
  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
