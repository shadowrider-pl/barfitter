import { ProductOrdered } from '../../../shared/model/product-ordered.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { OrderWithProductsService } from '../../active-entities/order-with-products.service';
import { OrderWithProducts } from '../../models/order-opened-with-products.model';
import { ProductOrderedFUService } from '../../active-entities/product-ordered-fu.service';
import { ProductsOrdered } from '../../models/products-ordered.model';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'jhi-order-opened-detail',
  templateUrl: './orders-for-chef-detail.component.html',
  styleUrls: ['../../../../app/../content/css/scroll-buttons.scss']
})
export class OrdersForChefDetailComponent implements OnInit, OnDestroy {
  productOrdered: ProductOrdered;
  isSaving: boolean;
  showButtonAcceptAll: boolean;
  showButtonAllReady: boolean;
  scrollInPixels = 200;

  orderOpened: OrderWithProducts;
  private subscription: Subscription;
  private eventSubscriber: Subscription;
  sendingTime = null;
  acceptingTime = null;
  finishingTime = null;
  takingTime = null;

  constructor(
    private eventManager: JhiEventManager,
    private orderWithProductsService: OrderWithProductsService,
    private productOrderedFUService: ProductOrderedFUService,
    //    private productsForChefService: ProductsForChefService,
    private route: ActivatedRoute
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

  allReady() {
    this.isSaving = true;
    const readyProducts: ProductsOrdered = { productsOrdered: [] };
    const nowDate = moment();
    for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
      if (
        this.orderOpened.productsToOrder[i].orderedProductStatus != null &&
        this.orderOpened.productsToOrder[i].orderedProductStatus.id === 3 &&
        this.orderOpened.productsToOrder[i].product.productType.id === 2
      ) {
        this.orderOpened.productsToOrder[i].finishedTime = nowDate;
        this.orderOpened.productsToOrder[i].orderedProductStatus = { id: 4 };
        readyProducts.productsOrdered.push(this.orderOpened.productsToOrder[i]);
      }
    }
    this.subscribeToSaveProductsListResponse(this.productOrderedFUService.updateProductsList(readyProducts));
    this.showButtonAllReady = false;
  }

  rejectAll() {
    this.isSaving = true;
    const rejectedProducts: ProductsOrdered = { productsOrdered: [] };
    const nowDate = moment();
    for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
      if (
        this.orderOpened.productsToOrder[i].orderedProductStatus != null &&
        this.orderOpened.productsToOrder[i].orderedProductStatus.id === 2 &&
        this.orderOpened.productsToOrder[i].product.productType.id === 2
      ) {
        this.orderOpened.productsToOrder[i].acceptedTime = nowDate;
        this.orderOpened.productsToOrder[i].orderedProductStatus = { id: 5 };
        rejectedProducts.productsOrdered.push(this.orderOpened.productsToOrder[i]);
      }
    }
    this.subscribeToSaveProductsListResponse(this.productOrderedFUService.updateProductsList(rejectedProducts));
    this.showButtonAcceptAll = false;
  }

  acceptAll() {
    this.isSaving = true;
    const acceptedProducts: ProductsOrdered = { productsOrdered: [] };
    const nowDate = moment();
    for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
      if (
        this.orderOpened.productsToOrder[i].orderedProductStatus != null &&
        this.orderOpened.productsToOrder[i].orderedProductStatus.id === 2 &&
        this.orderOpened.productsToOrder[i].product.productType.id === 2
      ) {
        this.orderOpened.productsToOrder[i].acceptedTime = nowDate;
        this.orderOpened.productsToOrder[i].orderedProductStatus = { id: 3 };
        acceptedProducts.productsOrdered.push(this.orderOpened.productsToOrder[i]);
      }
    }
    this.subscribeToSaveProductsListResponse(this.productOrderedFUService.updateProductsList(acceptedProducts));
    this.showButtonAcceptAll = false;
  }

  //  allReady() {
  //    for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
  //      if (this.orderOpened.productsToOrder[i].orderedProductStatus != null && this.orderOpened.productsToOrder[i].orderedProductStatus.id === 3
  //        && this.orderOpened.productsToOrder[i].product.productType.id === 2) {
  //        this.ready(this.orderOpened.productsToOrder[i].id);
  //      }
  //    }
  //    this.checkButtonAllReady();
  //  }
  //
  //  rejectAll() {
  //    for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
  //      if (this.orderOpened.productsToOrder[i].orderedProductStatus != null && this.orderOpened.productsToOrder[i].orderedProductStatus.id === 2
  //        && this.orderOpened.productsToOrder[i].product.productType.id === 2) {
  //        this.reject(this.orderOpened.productsToOrder[i].id);
  //      }
  //    }
  //    this.checkButtonAcceptAll();
  //  }
  //
  //  acceptAll() {
  //    for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
  //      if (this.orderOpened.productsToOrder[i].orderedProductStatus != null && this.orderOpened.productsToOrder[i].orderedProductStatus.id === 2
  //        && this.orderOpened.productsToOrder[i].product.productType.id === 2) {
  //        this.accept(this.orderOpened.productsToOrder[i].id);
  //      }
  //    }
  //    this.checkButtonAcceptAll();
  //  }

  checkButtonAllReady() {
    this.showButtonAllReady = false;
    for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
      if (this.orderOpened.productsToOrder[i].orderedProductStatus && this.orderOpened.productsToOrder[i].orderedProductStatus.id === 3) {
        this.showButtonAllReady = true;
        break;
      }
    }
  }

  checkButtonAcceptAll() {
    this.showButtonAcceptAll = false;
    for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
      if (
        this.orderOpened.productsToOrder[i].orderedProductStatus != null &&
        this.orderOpened.productsToOrder[i].orderedProductStatus.id === 2
      ) {
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
      //      this.productOrdered.orderedTime = productOrdered.orderedTime.toISOString();
      //      this.productOrdered.sendTime = productOrdered.sendTime.toISOString();
      //      this.productOrdered.acceptedTime = productOrdered.acceptedTime.toISOString();
      this.productOrdered.finishedTime = nowDate;
      this.productOrdered.orderedProductStatus = { id: 4 };
      this.subscribeToSaveResponse(this.productOrderedFUService.update(this.productOrdered));
    });
    this.checkButtonAllReady();
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
    this.checkButtonAcceptAll();
  }

  reject(id) {
    this.isSaving = true;
    this.productOrderedFUService.find(id).subscribe((productOrderedResponse: HttpResponse<ProductOrdered>) => {
      const nowDate = moment();
      //      const now = moment(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
      this.productOrdered = productOrderedResponse.body;
      this.productOrdered.acceptedTime = nowDate;
      this.productOrdered.orderedProductStatus = { id: 5 };
      this.subscribeToSaveResponse(this.productOrderedFUService.update(this.productOrdered));
    });
    this.checkButtonAcceptAll();
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInOrderOpeneds();
    window.addEventListener('scroll', this.showScrollButtons, true);
  }

  load(id) {
    this.isSaving = true;
    this.orderWithProductsService.find(id).subscribe((orderOpenedResponse: HttpResponse<OrderWithProducts>) => {
      this.orderOpened = orderOpenedResponse.body;
      this.filterProducts();
      this.checkButtonAcceptAll();
      this.checkButtonAllReady();
    });
    this.isSaving = false;
  }

  filterProducts() {
    for (let i = this.orderOpened.productsToOrder.length - 1; i >= 0; i--) {
      if (this.orderOpened.productsToOrder[i].product.productType.id !== 2) {
        this.orderOpened.productsToOrder.splice(i, 1);
      }
    }
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
    window.removeEventListener('scroll', this.showScrollButtons, true);
  }

  registerChangeInOrderOpeneds() {
    this.eventSubscriber = this.eventManager.subscribe('productsForChefListModification', response => this.load(this.orderOpened.id));
  }
  private subscribeToSaveResponse(result: Observable<HttpResponse<ProductOrdered>>) {
    result.subscribe((res: HttpResponse<ProductOrdered>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: ProductOrdered) {
    this.eventManager.broadcast({ name: 'productsForChefListModification', content: 'OK' });
    this.isSaving = false;
    this.checkButtonAcceptAll();
    this.checkButtonAllReady();
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
    this.checkButtonAcceptAll();
    this.checkButtonAllReady();
  }

  private onSaveError() {
    this.isSaving = false;
  }
}
