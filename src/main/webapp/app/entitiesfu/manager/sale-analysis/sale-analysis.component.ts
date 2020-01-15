import { AccountService } from 'app/core/auth/account.service';
import { Cashup } from '../../../shared/model/cashup.model';
import { Category } from '../../../shared/model/category.model';
import { ProductSold } from '../../../shared/model/product-sold.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ActiveCategoryService } from '../../active-entities/active-category.service';
import { ProductAnalyzed } from './product-analyzed.model';
import { SaleAnalysisService } from './sale-analysis.service';
import { MonthlyReportToDropdownService } from '../monthly-report/monthly-report-to-dropdown.service';
import { ProductsAnalyzed } from './products-analyzed.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-substitutes',
  templateUrl: './sale-analysis.component.html'
})
export class SaleAnalysisComponent implements OnInit, OnDestroy {
  productsAnalyzed: ProductAnalyzed[];
  filteredProducts: ProductSold[] = [];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  categories: Category[];
  countCategories = [];
  cashups: Cashup[] = [];
  months = [];
  monthX = null;
  products = [];
  allProducts = [];
  countedCategories = [];
  totalsellPriceGross = 0;
  totalsellPriceNet = 0;
  totalsellVatValue = 0;
  totalpurchPriceNet = 0;
  totalpurchVatValue = 0;
  vatDueMinusInputVat = 0;
  profit = 0;
  weeksArray = [
    { id: 1, weeks: 1 },
    { id: 2, weeks: 4 },
    { id: 3, weeks: 6 }
    //          , {id:4, weeks:52}
  ];
  weekX = null;
  dayX = null;
  spinner = false;

  constructor(
    private activeCategoryService: ActiveCategoryService,
    private saleAnalysisService: SaleAnalysisService,
    private jhiAlertService: JhiAlertService,
    private accountService: AccountService,
    private monthlyReportToDropdownService: MonthlyReportToDropdownService
  ) {
    //        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
    //            this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAllCategories() {
    this.activeCategoryService.query().subscribe(
      (res: HttpResponse<Category[]>) => {
        this.categories = res.body;
        for (let i = 0; i < this.categories.length; i++) {
          this.countCategories[i] = { category: this.categories[i], count: 0 };
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.loadMonths();
  }

  loadMonths() {
    this.monthlyReportToDropdownService.query().subscribe(
      (res: HttpResponse<Cashup[]>) => {
        this.onCashupSuccess(res.body, res.headers);
        if (this.monthX == null) {
          this.monthX = this.months[0].id;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadAllThisMonthProducts() {
    this.spinner = true;
    this.saleAnalysisService.query().subscribe(
      (res: HttpResponse<ProductAnalyzed[]>) => {
        this.onProductAnalyzedSuccess(res.body, res.headers);
        if (this.monthX == null) {
          this.monthX = this.months[0];
        }
        this.allProducts = this.products;
        this.countProductsInCategories();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  countProductsInCategories() {
    this.countedCategories.length = 0;
    this.resetCategoriesCount();
    //          angular.forEach(this.products, function(productSold) {
    for (let j = 0; j < this.products.length; j++) {
      for (let i = 0; i < this.countCategories.length; i++) {
        if (this.products[j].product.category != null && this.countCategories[i].category.id === this.products[j].product.category.id) {
          this.countCategories[i].count = this.countCategories[i].count + this.products[j].quantity;
          break;
        }
      }
    }
    for (let i = 0; i < this.countCategories.length; i++) {
      if (this.countCategories[i].count !== 0) {
        this.countedCategories.push(this.countCategories[i]);
      }
    }
    this.sumFiltered();
  }

  resetCategoriesCount() {
    for (let i = 0; i < this.categories.length; i++) {
      this.countCategories[i].count = 0;
    }
  }

  categoryFilter(category) {
    this.filteredProducts.length = 0;
    for (let i = 0; i < this.allProducts.length; i++) {
      //          angular.forEach(allProducts, function(productSold) {
      if (this.allProducts[i].product.category != null && category.id === this.allProducts[i].product.category.id) {
        this.filteredProducts.push(this.allProducts[i]);
      }
    }
    this.products = this.filteredProducts;
    this.sumFiltered();
    return this.products;
  }

  reset() {
    this.products = this.allProducts;
    this.filteredProducts.length = 0;
    this.sumFiltered();
  }

  sumFiltered() {
    this.totalsellPriceGross = 0;
    this.totalsellPriceNet = 0;
    this.totalsellVatValue = 0;
    this.totalpurchPriceNet = 0;
    this.totalpurchVatValue = 0;
    this.vatDueMinusInputVat = 0;
    this.profit = 0;
    //    angular.forEach(this.products, function(product) {
    for (let i = 0; i < this.products.length; i++) {
      this.totalsellPriceGross += this.products[i].sellPriceGross;
      this.totalsellPriceNet += this.products[i].sellPriceNet;
      this.totalsellVatValue += this.products[i].sellVatValue;
      this.totalpurchPriceNet += this.products[i].purchPriceNet;
      this.totalpurchVatValue += this.products[i].purchVatValue;
      this.vatDueMinusInputVat = this.totalsellVatValue - this.totalpurchVatValue;
    }

    this.profit = this.totalsellPriceNet - this.totalpurchPriceNet;
    this.spinner = false;
  }

  changeMonth(monthId) {
    this.spinner = true;
    this.weekX = null;
    this.dayX = null;
    const cashupId = monthId;
    const weeks = 0;
    const leadingZero = '0';
    const cashupIdStr = cashupId.toString();
    let weeksStr = null;
    if (weeks >= 10) {
      weeksStr = weeks.toString();
    } else {
      weeksStr = leadingZero + weeks.toString();
    }
    const cashupIdPlusWeeks = cashupIdStr + weeksStr;
    // dwie ostatnie cyfry to ilość tygodni

    this.saleAnalysisService.find(cashupIdPlusWeeks).subscribe((productSoldResponse: HttpResponse<ProductsAnalyzed>) => {
      this.products = productSoldResponse.body.productsAnalyzed;
      this.allProducts = this.products;
      this.countProductsInCategories();
    });
  }

  changeWeeks(weekId) {
    this.spinner = true;
    //   weekId = +weekId; // number
    this.monthX = null;
    this.dayX = null;
    const cashupId = this.months[0].id;
    const leadingZero = '0';
    const cashupIdStr = cashupId.toString();
    let weeksStr: string = null;
    if (weekId >= 10) {
      weeksStr = weekId.toString();
    } else {
      weeksStr = leadingZero + weekId.toString();
    }
    const cashupIdPlusWeeks = +(cashupIdStr + weeksStr);
    this.countedCategories.length = 0;
    this.products.length = 0;
    // dwie ostatnie cyfry to ilość tygodni
    //          console.log("cashupIdPlusWeeks: "+cashupIdPlusWeeks);
    this.saleAnalysisService.find(cashupIdPlusWeeks).subscribe((productSoldResponse: HttpResponse<ProductsAnalyzed>) => {
      this.products = productSoldResponse.body.productsAnalyzed;
      this.allProducts = this.products;
      this.countProductsInCategories();
    });
  }

  changeDay(cashupId) {
    this.spinner = true;
    this.monthX = null;
    this.weekX = null;
    this.countedCategories.length = 0;
    this.products.length = 0;
    //          const weeks = 99;
    //          const cashupIdStr = cashupId.toString();
    //          const weeksStr = weeks.toString();
    //          const cashupIdPlusWeeks = +(cashupIdStr + weeksStr);
    this.saleAnalysisService.findCashup(cashupId).subscribe((productSoldResponse: HttpResponse<ProductsAnalyzed>) => {
      this.products = productSoldResponse.body.productsAnalyzed;
      this.allProducts = this.products;
      this.countProductsInCategories();
    });
  }

  loadCashups() {
    this.saleAnalysisService.queryForCashups().subscribe((res: HttpResponse<Cashup[]>) => {
      this.cashups = res.body;
    });
  }

  ngOnInit() {
    this.loadAllCategories();
    this.loadCashups();
    this.loadAllThisMonthProducts();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    //    this.registerChangeInSubstitutes();
  }

  ngOnDestroy() {
    //    this.eventManager.destroy(this.eventSubscriber);
  }

  //  trackId(index: number, item: Substitutes) {
  //    return item.id;
  //  }
  //  registerChangeInSubstitutes() {
  //    this.eventSubscriber = this.eventManager.subscribe('substitutesListModification', (response) => this.loadAll());
  //  }

  //  private onSuccess(data, headers) {
  //    this.substitutes = data;
  //  }

  private onCashupSuccess(data, headers) {
    this.months = data;
  }

  private onProductAnalyzedSuccess(data, headers) {
    this.products = data;
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
