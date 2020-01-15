import { AccountService } from 'app/core/auth/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { StockService } from './stock.service';
import { ProductTypeService } from '../../../entities/product-type/product-type.service';
import { ProductOnStock } from '../../../shared/model/product-on-stock.model';
import { ProductType } from '../../../shared/model/product-type.model';
import { Product } from '../../../shared/model/product.model';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-stock',
  templateUrl: './stock.component.html'
})
export class StockComponent implements OnInit, OnDestroy {
  stocks: ProductOnStock[];
  outOfStock: Product[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  producttypes: ProductType[];
  productTypeX = null;
  selectedProductType = 1;
  spinner = false;
  outOfStockSpinner = false;
  showProductsReadyOutOfStockButton = true;
  showProductsReadyOutOfStockBoolean = false;
  constructor(
    private router: Router,
    private stockService: StockService,
    private productTypeService: ProductTypeService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private accountService: AccountService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  navigateTo(value) {
    if (value) {
      this.router.navigate([value]);
    }
    return false;
  }

  changeProductType() {
    this.stocks.length = 0;
    this.spinner = true;
    switch (this.productTypeX) {
      case '1': {
        this.selectedProductType = 1;
        //        console.log(" changeProductType()");
        this.loadAll();
        break;
      }
      case '2': {
        this.selectedProductType = this.productTypeX;
        this.stockService.queryForKitchenProducts().subscribe(
          (res: HttpResponse<ProductOnStock[]>) => {
            this.stocks = res.body;
            this.showProductsReadyOutOfStockButton = false;
            this.spinner = false;
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      }
      case '3': {
        this.selectedProductType = this.productTypeX;
        this.stockService.queryForBarProducts().subscribe(
          (res: HttpResponse<ProductOnStock[]>) => {
            this.stocks = res.body;
            this.showProductsReadyOutOfStockButton = false;
            this.spinner = false;
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
        break;
      }
    }
  }

  showProductsReadyOutOfStock() {
    this.showProductsReadyOutOfStockButton = false;
    this.showProductsReadyOutOfStockBoolean = true;
    if (this.outOfStock == null) {
      this.outOfStockSpinner = true;
      this.stockService.queryForOutOfStock().subscribe(
        (res: HttpResponse<Product[]>) => {
          this.outOfStock = res.body;
          this.outOfStockSpinner = false;
          this.showProductsReadyOutOfStockBoolean = true;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  previousState() {
    this.showProductsReadyOutOfStockButton = true;
    this.showProductsReadyOutOfStockBoolean = false;
  }

  translateProductTypes() {
    for (let i = 0; i < this.producttypes.length; i++) {
      switch (this.producttypes[i].id) {
        case 1: {
          this.producttypes[i].description = this.translateService.instant('barfitterApp.productType.ready');
          break;
        }
        case 2: {
          this.producttypes[i].description = this.translateService.instant('barfitterApp.productType.madeInKithen');
          break;
        }
        case 3: {
          this.producttypes[i].description = this.translateService.instant('barfitterApp.productType.madeAtBar');
          break;
        }
      }
    }
  }

  loadAll() {
    this.spinner = true;
    this.outOfStock = null;
    this.stockService.query().subscribe(
      (res: HttpResponse<ProductOnStock[]>) => {
        this.stocks = res.body;
        this.spinner = false;
        this.productTypeService.query().subscribe(
          (res2: HttpResponse<ProductType[]>) => {
            this.producttypes = res2.body;
            this.productTypeX = this.producttypes[0].id;
            this.translateProductTypes();
          },
          (res3: HttpErrorResponse) => this.onError(res3.message)
        );
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  clear() {
    this.currentSearch = '';
    //    console.log("clear()");
    this.loadAll();
  }
  ngOnInit() {
    //    console.log("ngOnInit()");
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInStocks();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ProductOnStock) {
    return item.id;
  }
  registerChangeInStocks() {
    this.eventSubscriber = this.eventManager.subscribe('stockListModification', response => {
      // console.log('registerChangeInStocks()');
      this.loadAll();
      this.changeProductType();
    });
    this.eventSubscriber = this.eventManager.subscribe('stockKitchenListModification', response => {
      this.spinner = true;
      this.stockService.queryForKitchenProducts().subscribe(
        (res: HttpResponse<ProductOnStock[]>) => {
          this.stocks = res.body;
          this.spinner = false;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    });
    this.eventSubscriber = this.eventManager.subscribe('stockBarListModification', response => {
      this.spinner = true;
      this.stockService.queryForBarProducts().subscribe(
        (res: HttpResponse<ProductOnStock[]>) => {
          this.stocks = res.body;
          this.spinner = false;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    });
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
