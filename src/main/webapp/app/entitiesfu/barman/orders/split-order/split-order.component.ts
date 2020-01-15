import { ProductOrdered } from '../../../../shared/model/product-ordered.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { HttpResponse } from '@angular/common/http';
import { OrderWithProductsService } from '../../../active-entities/order-with-products.service';
import { OrderWithProducts } from '../../../models/order-opened-with-products.model';
import { OrdersWithProductsToSplit } from '../../../models/orders-with-products-to-split';
import { SplitOrderService } from './split-order.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'jhi-order-opened-detail',
  templateUrl: './split-order.component.html'
})
export class SplitOrderComponent implements OnInit, OnDestroy {
  originalOrder: OrderWithProducts = new OrderWithProducts();
  isSaving = false;
  orderOpened: OrderWithProducts;
  newOrderOpened: OrderWithProducts = new OrderWithProducts();
  ordersWithProductsToSplit: OrdersWithProductsToSplit = {
    oldOrder: null,
    newOrder: null
  };
  private subscription: Subscription;
  private eventSubscriber: Subscription;
  sendingTime = null;
  acceptingTime = null;
  finishingTime = null;
  takingTime = null;

  constructor(
    private eventManager: JhiEventManager,
    private orderWithProductsService: OrderWithProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private splitOrderService: SplitOrderService
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInOrderOpeneds();
  }

  pushToNewOrder(ii) {
    if (this.orderOpened.productsToOrder[ii].quantity === 1) {
      this.newOrderOpened.productsToOrder.push(this.orderOpened.productsToOrder[ii]);
      this.orderOpened.productsToOrder.splice(ii, 1);
    } else {
      const product: ProductOrdered = new ProductOrdered();
      product.acceptedTime = this.orderOpened.productsToOrder[ii].acceptedTime;
      product.chef = this.orderOpened.productsToOrder[ii].chef;
      product.comment = this.orderOpened.productsToOrder[ii].comment;
      product.deliveryDate = this.orderOpened.productsToOrder[ii].deliveryDate;
      product.difference = this.orderOpened.productsToOrder[ii].difference;
      product.finishedTime = this.orderOpened.productsToOrder[ii].finishedTime;
      product.order = this.orderOpened.productsToOrder[ii].order;
      product.orderedProductStatus = this.orderOpened.productsToOrder[ii].orderedProductStatus;
      product.orderedTime = this.orderOpened.productsToOrder[ii].orderedTime;
      product.orderPosition = this.orderOpened.productsToOrder[ii].orderPosition;
      product.product = this.orderOpened.productsToOrder[ii].product;
      product.productOrderedPurchPriceRate = this.orderOpened.productsToOrder[ii].productOrderedPurchPriceRate;
      product.productOrderedSellPriceRate = this.orderOpened.productsToOrder[ii].productOrderedSellPriceRate;
      product.purchPriceGross = this.orderOpened.productsToOrder[ii].purchPriceGross;
      product.purchPriceNet = this.orderOpened.productsToOrder[ii].purchPriceNet;
      product.purchVatValue = this.orderOpened.productsToOrder[ii].purchVatValue;
      product.restaurant = this.orderOpened.productsToOrder[ii].restaurant;
      product.sellPriceGross = this.orderOpened.productsToOrder[ii].sellPriceGross;
      product.sellPriceNet = this.orderOpened.productsToOrder[ii].sellPriceNet;
      product.sellVatValue = this.orderOpened.productsToOrder[ii].sellVatValue;
      product.sendTime = this.orderOpened.productsToOrder[ii].sendTime;
      product.takenTime = this.orderOpened.productsToOrder[ii].takenTime;
      product.quantity = 1;
      this.orderOpened.productsToOrder[ii].quantity = this.orderOpened.productsToOrder[ii].quantity - 1;
      this.newOrderOpened.productsToOrder.push(product);
    }
    this.countTotals();
  }

  //  pushToOldOrder(ii) {
  //    this.orderOpened.productsToOrder.push(this.newOrderOpened.productsToOrder[ii]);
  //    this.newOrderOpened.productsToOrder.splice(ii, 1);
  //    this.countTotals();
  //  }

  countTotals() {
    this.orderOpened.total = 0;
    this.newOrderOpened.total = 0;
    for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
      this.orderOpened.total += this.orderOpened.productsToOrder[i].sellPriceGross * this.orderOpened.productsToOrder[i].quantity;
    }
    for (let i = 0; i < this.newOrderOpened.productsToOrder.length; i++) {
      this.newOrderOpened.total += this.newOrderOpened.productsToOrder[i].sellPriceGross * this.newOrderOpened.productsToOrder[i].quantity;
    }
  }

  createNewOrder() {
    this.newOrderOpened.comment =
      this.translateService.instant('barfitterApp.orderOpened.orderSplited') + ' => ' + this.orderOpened.orderId;
    this.newOrderOpened.barman = this.orderOpened.barman;
    this.newOrderOpened.desk = this.orderOpened.desk;
    this.newOrderOpened.productsToOrder = [];
    this.newOrderOpened.restaurant = this.orderOpened.restaurant;
    this.newOrderOpened.total = 0;
  }

  save() {
    this.orderOpened.openingTime = moment();
    this.newOrderOpened.openingTime = this.orderOpened.openingTime;
    this.ordersWithProductsToSplit.newOrder = this.newOrderOpened;
    this.ordersWithProductsToSplit.oldOrder = this.orderOpened;
    this.isSaving = true;
    this.subscribeToSaveNewOrderResponse(this.splitOrderService.create(this.ordersWithProductsToSplit));
  }

  private subscribeToSaveNewOrderResponse(result: Observable<HttpResponse<OrdersWithProductsToSplit>>) {
    result.subscribe(
      (res: HttpResponse<OrdersWithProductsToSplit>) => this.onSaveNewOrderSuccess(res.body),
      (res: HttpErrorResponse) => this.onSaveError()
    );
  }

  private onSaveNewOrderSuccess(result: OrdersWithProductsToSplit) {
    //    this.orderOpened.openingTime = new Date(this.orderOpened.openingTime.getTime() - (this.orderOpened.openingTime.getTimezoneOffset() * 60000)).toISOString();
    //    this.subscribeToSaveOldOrderResponse(
    //      this.orderWithProductsService.update(this.orderOpened));
    this.router.navigate(['../orders-in-room/' + this.newOrderOpened.desk.id]);
    this.isSaving = false;
  }

  //  private subscribeToSaveOldOrderResponse(result: Observable<HttpResponse<OrderWithProducts>>) {
  //    result.subscribe((res: HttpResponse<OrderWithProducts>) =>
  //      this.onSaveOldOrderSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  //  }
  //
  //  private onSaveOldOrderSuccess(result: OrderWithProducts) {
  //    this.isSaving = false;
  //    this.router.navigate(['../orders-in-room/' + this.newOrderOpened.desk.id]);
  //  }

  private onSaveError() {
    this.isSaving = false;
  }

  load(id) {
    this.orderWithProductsService.find(id).subscribe((orderOpenedResponse: HttpResponse<OrderWithProducts>) => {
      this.orderOpened = orderOpenedResponse.body;
      for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
        if (this.orderOpened.productsToOrder[i].sendTime != null) {
          const startDate = this.orderOpened.productsToOrder[i].orderedTime;
          const endDate = this.orderOpened.productsToOrder[i].sendTime;
          this.sendingTime = moment.duration(endDate.diff(startDate)).humanize();
          //                      const startDate = new Date(this.orderOpened.productsToOrder[i].orderedTime).getTime();
          //                      const endDate = new Date(this.orderOpened.productsToOrder[i].sendTime).getTime();
          //                      const milisecondsDiff: number = (endDate - startDate) > 0 ? (endDate - startDate) : 0 ;
          // przy wciśnięciu zapisz i wyślij na kuchnię, czasy są robione asynchronicznie i różnica może być <0
          //                    this.sendingTime = Math.floor(milisecondsDiff / (1000 * 60));
        }
        if (this.orderOpened.productsToOrder[i].acceptedTime != null) {
          const startDate = this.orderOpened.productsToOrder[i].sendTime;
          const endDate = this.orderOpened.productsToOrder[i].acceptedTime;
          this.acceptingTime = moment.duration(endDate.diff(startDate)).humanize();
          //                      const startDate = new Date(this.orderOpened.productsToOrder[i].sendTime).getTime();
          //                      const endDate = new Date(this.orderOpened.productsToOrder[i].acceptedTime).getTime();
          //                      const milisecondsDiff = endDate - startDate;
          //                    this.acceptingTime = Math.floor(milisecondsDiff / (1000 * 60));
        }
        if (this.orderOpened.productsToOrder[i].finishedTime != null) {
          const startDate = this.orderOpened.productsToOrder[i].acceptedTime;
          const endDate = this.orderOpened.productsToOrder[i].finishedTime;
          this.finishingTime = moment.duration(endDate.diff(startDate)).humanize();
          //                      const startDate = new Date(this.orderOpened.productsToOrder[i].acceptedTime).getTime();
          //                      const endDate = new Date(this.orderOpened.productsToOrder[i].finishedTime).getTime();
          //                      const milisecondsDiff = endDate - startDate;
          //                    this.finishingTime = Math.floor(milisecondsDiff / (1000 * 60));
        }
        if (this.orderOpened.productsToOrder[i].takenTime != null) {
          const startDate = this.orderOpened.productsToOrder[i].finishedTime;
          const endDate = this.orderOpened.productsToOrder[i].takenTime;
          this.takingTime = moment.duration(endDate.diff(startDate)).humanize();
          //                      const startDate = new Date(this.orderOpened.productsToOrder[i].finishedTime).getTime();
          //                      const endDate = new Date(this.orderOpened.productsToOrder[i].takenTime).getTime();
          //                      const milisecondsDiff = endDate - startDate;
          //                    this.takingTime = Math.floor(milisecondsDiff / (1000 * 60));
        }
      }
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInOrderOpeneds() {
    this.eventSubscriber = this.eventManager.subscribe('orderOpenedListModification', response => this.load(this.orderOpened.id));
  }
}
