import { AccountService } from 'app/core/auth/account.service';
import { ProductOrdered } from '../../../shared/model/product-ordered.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ProductsForChefService } from './products-for-chef.service';
import * as moment from 'moment';
import { ProductOrderedFUService } from '../../active-entities/product-ordered-fu.service';
import { ProductsOrdered } from '../../models/products-ordered.model';

@Component({
  selector: 'jhi-products-for-chef',
  templateUrl: './products-for-chef.component.html',
  styleUrls: ['../../../../app/../content/css/scroll-buttons.scss']
})
export class ProductsForChefComponent implements OnInit, OnDestroy {
  //  productsForChefs: ProductOrdered[]; // zmienione bo nie chciał przepuścić productType.id
  productsForChefs = [];
  currentAccount: any;
  eventSubscriber: Subscription;
  eventBellClickSubscriber: Subscription;
  currentSearch: string;
  productOrdered: ProductOrdered;
  isSaving: boolean;
  showButtonAcceptAll = false;
  showButtonAllReady = false;
  registeredBellClick = false;
  scrollInPixels = 200;

  constructor(
    private productsForChefService: ProductsForChefService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    //    private activatedRoute: ActivatedRoute,
    private productOrderedFUService: ProductOrderedFUService,
    private accountService: AccountService
  ) {}

  showScrollButtons() {
    if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && document.getElementById('upButton') !== null) {
      document.getElementById('upButton').style.display = 'block';
    } else {
      document.getElementById('upButton').style.display = 'none';
    }

    if (
      (document.body.scrollTop > document.body.scrollHeight - window.innerHeight * 1.05 ||
        document.documentElement.scrollTop > document.documentElement.scrollHeight - window.innerHeight * 1.05) &&
      document.getElementById('downButton') !== null
    ) {
      document.getElementById('downButton').style.display = 'none';
    } else {
      document.getElementById('downButton').style.display = 'block';
    }
    return null;
  }

  scrollDown() {
    window.scrollBy({
      top: this.scrollInPixels,
      left: 0,
      behavior: 'smooth'
    });
  }

  scrollUp() {
    window.scrollBy({
      top: -1 * this.scrollInPixels,
      left: 0,
      behavior: 'smooth'
    });
  }

  registerBellClick() {
    //        console.log("start registerBellClick()");
    let bellBadge = null;
    if (!this.registeredBellClick) {
      this.eventBellClickSubscriber = this.eventManager.subscribe('reloadKitchen', response => {
        this.loadAll();
        bellBadge = response;
        //        console.log("registerBellClick()");
      });
      this.registeredBellClick = true;
    }
  }

  allReady() {
    const readyProducts: ProductsOrdered = { productsOrdered: [] };
    const nowDate = moment();
    for (let i = 0; i < this.productsForChefs.length; i++) {
      if (
        this.productsForChefs[i].orderedProductStatus != null &&
        this.productsForChefs[i].orderedProductStatus.id === 3 &&
        this.productsForChefs[i].product.productType.id === 2
      ) {
        this.productsForChefs[i].finishedTime = nowDate;
        this.productsForChefs[i].orderedProductStatus = { id: 4 };
        readyProducts.productsOrdered.push(this.productsForChefs[i]);
      }
    }
    this.subscribeToSaveProductsListResponse(this.productOrderedFUService.updateProductsList(readyProducts));
    this.showButtonAllReady = false;
  }

  rejectAll() {
    const rejectedProducts: ProductsOrdered = { productsOrdered: [] };
    const nowDate = moment();
    for (let i = 0; i < this.productsForChefs.length; i++) {
      if (
        this.productsForChefs[i].orderedProductStatus != null &&
        this.productsForChefs[i].orderedProductStatus.id === 2 &&
        this.productsForChefs[i].product.productType.id === 2
      ) {
        this.productsForChefs[i].acceptedTime = nowDate;
        this.productsForChefs[i].orderedProductStatus = { id: 5 };
        rejectedProducts.productsOrdered.push(this.productsForChefs[i]);
      }
    }
    this.subscribeToSaveProductsListResponse(this.productOrderedFUService.updateProductsList(rejectedProducts));
    this.showButtonAcceptAll = false;
  }

  acceptAll() {
    const acceptedProducts: ProductsOrdered = { productsOrdered: [] };
    const nowDate = moment();
    for (let i = 0; i < this.productsForChefs.length; i++) {
      if (
        this.productsForChefs[i].orderedProductStatus != null &&
        this.productsForChefs[i].orderedProductStatus.id === 2 &&
        this.productsForChefs[i].product.productType.id === 2
      ) {
        this.productsForChefs[i].acceptedTime = nowDate;
        this.productsForChefs[i].orderedProductStatus = { id: 3 };
        acceptedProducts.productsOrdered.push(this.productsForChefs[i]);
      }
    }
    this.subscribeToSaveProductsListResponse(this.productOrderedFUService.updateProductsList(acceptedProducts));
    this.showButtonAcceptAll = false;
  }

  checkButtonAllReady() {
    for (let i = 0; i < this.productsForChefs.length; i++) {
      if (this.productsForChefs[i].orderedProductStatus.id === 3) {
        this.showButtonAllReady = true;
        break;
      }
    }
  }

  checkButtonAcceptAll() {
    for (let i = 0; i < this.productsForChefs.length; i++) {
      if (this.productsForChefs[i].orderedProductStatus.id === 2) {
        this.showButtonAcceptAll = true;
        break;
      }
    }
  }

  ready(id) {
    this.isSaving = true;
    this.productOrderedFUService.find(id).subscribe((productOrderedResponse: HttpResponse<ProductOrdered>) => {
      const nowDate = moment();
      //      const now = moment(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
      this.productOrdered = productOrderedResponse.body;
      this.productOrdered.finishedTime = nowDate;
      this.productOrdered.orderedProductStatus = { id: 4 };
      this.subscribeToSaveResponse(this.productOrderedFUService.update(this.productOrdered));
    });
  }

  accept(id) {
    this.isSaving = true;
    this.productOrderedFUService.find(id).subscribe((productOrderedResponse: HttpResponse<ProductOrdered>) => {
      const nowDate = moment();
      //      const now = moment(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
      this.productOrdered = productOrderedResponse.body;
      //      this.productOrdered.orderedTime = this.productOrdered.orderedTime.toISOString();
      this.productOrdered.acceptedTime = nowDate;
      this.productOrdered.orderedProductStatus = { id: 3 };
      this.subscribeToSaveResponse(this.productOrderedFUService.update(this.productOrdered));
    });
  }

  reject(id) {
    this.isSaving = true;
    this.productOrderedFUService.find(id).subscribe((productOrderedResponse: HttpResponse<ProductOrdered>) => {
      const nowDate = moment();
      //      const now = moment(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
      this.productOrdered = productOrderedResponse.body;
      //      this.productOrdered.orderedTime = productOrdered.orderedTime.toISOString();
      //      this.productOrdered.sendTime = productOrdered.sendTime.toISOString();
      this.productOrdered.acceptedTime = nowDate;
      this.productOrdered.orderedProductStatus = { id: 5 };
      this.subscribeToSaveResponse(this.productOrderedFUService.update(this.productOrdered));
    });
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<ProductOrdered>>) {
    result.subscribe((res: HttpResponse<ProductOrdered>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: ProductOrdered) {
    this.eventManager.broadcast({ name: 'productsForChefListModification', content: 'OK' });
    this.isSaving = false;
  }

  private subscribeToSaveProductsListResponse(result: Observable<HttpResponse<ProductsOrdered>>) {
    result.subscribe(
      (res: HttpResponse<ProductsOrdered>) => this.onProductsListSaveSuccess(res.body),
      (res: HttpErrorResponse) => this.onSaveError()
    );
  }

  private onProductsListSaveSuccess(result: ProductsOrdered) {
    this.eventManager.broadcast({ name: 'productsForChefListModification', content: 'OK' });
    this.isSaving = false;
  }

  private onSaveError() {
    this.isSaving = false;
  }

  loadAll() {
    this.showButtonAcceptAll = false;
    this.showButtonAllReady = false;
    this.productsForChefService.query().subscribe(
      (res: HttpResponse<ProductOrdered[]>) => {
        this.productsForChefs = res.body;
        this.currentSearch = '';
        this.checkButtonAcceptAll();
        this.checkButtonAllReady();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }
  ngOnInit() {
    //    console.log("ngOnInit() ")
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInProductsForChefs();
    this.registeredBellClick = false;
    this.registerBellClick();
    window.addEventListener('scroll', this.showScrollButtons, true);
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
    this.eventManager.destroy(this.eventBellClickSubscriber);
    window.removeEventListener('scroll', this.showScrollButtons, true);
  }

  trackId(index: number, item: ProductOrdered) {
    return item.id;
  }
  registerChangeInProductsForChefs() {
    this.eventSubscriber = this.eventManager.subscribe('productsForChefListModification', response => this.loadAll());
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
