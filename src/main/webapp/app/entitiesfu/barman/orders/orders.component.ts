import { AccountService } from 'app/core/auth/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { OrderWithProducts } from '../../models/order-opened-with-products.model';
import { DeskService } from '../../../entities/desk/desk.service';
import { OrderWithProductsService } from '../../active-entities/order-with-products.service';
import { Desk } from '../../../shared/model/desk.model';
import { OrderOpened } from '../../../shared/model/order-opened.model';
import { ProductOrdered } from '../../../shared/model/product-ordered.model';
import { ProductOrderedFUService } from '../../active-entities/product-ordered-fu.service';
import { ProductsOrdered } from '../../models/products-ordered.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-order-opened',
  templateUrl: './orders.component.html',
  styleUrls: ['../../../../app/../content/css/scroll-buttons.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  currentAccount: any;
  orderOpeneds = [];
  orderOpenedsTemp = [];
  showButtonSendAllToKitchenArray = [];
  showButtonDeliverAllArray = [];
  productOrdered: ProductOrdered;
  isSaving: boolean;
  spinner = false;

  //    orderOpenedsTemp: OrderOpened[];
  private subscription: Subscription;
  showNoOrders = false;
  showButtonPaymentArray = [];
  choosenRoomDescription = null;
  desk: Desk;
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
  paramId: number;
  scrollInPixels = 200;

  constructor(
    private orderWithProductsService: OrderWithProductsService,
    private deskService: DeskService,
    private parseLinks: JhiParseLinks,
    private jhiAlertService: JhiAlertService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager,
    private productOrderedFUService: ProductOrderedFUService,
    private translateService: TranslateService,
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

  translateStatus(order) {
    for (let i = 0; i < order.productsToOrder.length; i++) {
      if (order.productsToOrder[i].orderedProductStatus) {
        switch (order.productsToOrder[i].orderedProductStatus.id) {
          case 1: {
            order.productsToOrder[i].orderedProductStatus.description = this.translateService.instant(
              'barfitterApp.orderedProductStatus.status.ordered'
            );
            break;
          }
          case 2: {
            order.productsToOrder[i].orderedProductStatus.description = this.translateService.instant(
              'barfitterApp.orderedProductStatus.status.sent'
            );
            break;
          }
          case 3: {
            order.productsToOrder[i].orderedProductStatus.description = this.translateService.instant(
              'barfitterApp.orderedProductStatus.status.accepted'
            );
            break;
          }
          case 4: {
            order.productsToOrder[i].orderedProductStatus.description = this.translateService.instant(
              'barfitterApp.orderedProductStatus.status.ready'
            );
            break;
          }
          case 5: {
            order.productsToOrder[i].orderedProductStatus.description = this.translateService.instant(
              'barfitterApp.orderedProductStatus.status.rejected'
            );
            break;
          }
          case 6: {
            order.productsToOrder[i].orderedProductStatus.description = this.translateService.instant(
              'barfitterApp.orderedProductStatus.status.delivered'
            );
            break;
          }
        }
      }
    }
  }

  deliverAll(order) {
    this.isSaving = true;
    const deliveredProducts: ProductsOrdered = { productsOrdered: [] };
    const nowDate = new Date();
    for (let i = 0; i < order.productsToOrder.length; i++) {
      if (
        order.productsToOrder[i].orderedProductStatus != null &&
        order.productsToOrder[i].orderedProductStatus.id === 4 &&
        order.productsToOrder[i].product.productType.id === 2
      ) {
        order.productsToOrder[i].takenTime = nowDate;
        order.productsToOrder[i].orderedProductStatus = { id: 6 };
        deliveredProducts.productsOrdered.push(order.productsToOrder[i]);
      }
    }
    this.subscribeToSaveProductsListResponse(this.productOrderedFUService.updateProductsList(deliveredProducts));
  }

  sendAllToKitchen(order) {
    this.isSaving = true;
    const sentProducts: ProductsOrdered = { productsOrdered: [] };
    const nowDate = new Date();
    for (let i = 0; i < order.productsToOrder.length; i++) {
      if (
        (order.productsToOrder[i].orderedProductStatus == null || order.productsToOrder[i].orderedProductStatus.id == null) &&
        order.productsToOrder[i].product.productType != null &&
        order.productsToOrder[i].product.productType.id === 2
      ) {
        order.productsToOrder[i].sendTime = nowDate;
        order.productsToOrder[i].orderedProductStatus = { id: 2 };
        sentProducts.productsOrdered.push(order.productsToOrder[i]);
      }
    }
    this.subscribeToSaveProductsListResponse(this.productOrderedFUService.updateProductsList(sentProducts));
    this.showButtonSendAllToKitchen(order);
  }

  showButtonDeliverAll(order) {
    this.isSaving = true;
    let foundProductToDeliver = false;
    for (let i = 0; i < order.productsToOrder.length; i++) {
      const productOrdered = order.productsToOrder[i];
      if (
        productOrdered.orderedProductStatus != null &&
        productOrdered.orderedProductStatus.id === 4 &&
        productOrdered.product.productType.id === 2
      ) {
        foundProductToDeliver = true;
        break;
      }
    }
    if (foundProductToDeliver === false) {
      this.showButtonDeliverAllArray.push('NULL');
    } else {
      this.showButtonDeliverAllArray.push(order.id);
    }
  }

  showButtonSendAllToKitchen(order) {
    this.isSaving = true;
    let foundProductToSend = false;
    for (let i = 0; i < order.productsToOrder.length; i++) {
      const productOrdered = order.productsToOrder[i];
      if (
        (productOrdered.orderedProductStatus == null || productOrdered.orderedProductStatus.id == null) &&
        productOrdered.product.productType != null &&
        productOrdered.product.productType.id === 2
      ) {
        foundProductToSend = true;
        break;
      }
    }
    if (foundProductToSend === false) {
      this.showButtonSendAllToKitchenArray.push('NULL');
    } else {
      this.showButtonSendAllToKitchenArray.push(order.id);
    }
  }

  deliver(id) {
    this.isSaving = true;
    this.productOrderedFUService.find(id).subscribe((productOrderedResponse: HttpResponse<ProductOrdered>) => {
      const nowDate = moment();
      //      const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
      this.productOrdered = productOrderedResponse.body;
      //      this.productOrdered.orderedTime = this.productOrdered.orderedTime.toISOString();
      //      this.productOrdered.sendTime = this.productOrdered.sendTime.toISOString();
      //      this.productOrdered.acceptedTime = this.productOrdered.acceptedTime.toISOString();
      //      this.productOrdered.finishedTime = this.productOrdered.finishedTime.toISOString();
      this.productOrdered.takenTime = nowDate;
      this.productOrdered.orderedProductStatus = { id: 6 };
      this.subscribeToSaveResponse(this.productOrderedFUService.update(this.productOrdered));
    });
  }

  sendToKitchen(id) {
    this.isSaving = true;
    this.productOrderedFUService.find(id).subscribe((productOrderedResponse: HttpResponse<ProductOrdered>) => {
      const nowDate = moment();
      //      const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
      //      console.log(now);
      this.productOrdered = productOrderedResponse.body;
      //      this.productOrdered.orderedTime = this.productOrdered.orderedTime.toISOString();
      this.productOrdered.sendTime = nowDate;
      this.productOrdered.orderedProductStatus = { id: 2 };
      this.subscribeToSaveResponse(this.productOrderedFUService.update(this.productOrdered));
    });
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<ProductOrdered>>) {
    result.subscribe((res: HttpResponse<ProductOrdered>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: ProductOrdered) {
    this.eventManager.broadcast({ name: 'productOrderedListModification', content: 'OK' });
    this.eventManager.broadcast({ name: 'orderOpenedListModification', content: 'OK' });
  }

  private onSaveError() {
    this.isSaving = false;
  }

  loadAll() {
    this.isSaving = true;
    this.spinner = true;
    this.orderWithProductsService.query().subscribe(
      (res: HttpResponse<OrderWithProducts[]>) => {
        this.orderOpenedsTemp = res.body;
        this.filter(this.orderOpenedsTemp);
        this.currentSearch = '';
        this.isSaving = false;
        this.spinner = false;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  filter(orders) {
    this.orderOpeneds.length = 0;
    this.showButtonPaymentArray.length = 0;
    this.showButtonSendAllToKitchenArray.length = 0;
    this.showButtonDeliverAllArray.length = 0;
    this.subscription = this.route.params.subscribe(params => {
      //            this.load(params['id']);
      if (!params['id']) {
        this.orderOpeneds = orders;
        for (let i = 0; i < orders.length; i++) {
          this.showButtonPayment(orders[i]);
          this.showButtonSendAllToKitchen(orders[i]);
          this.showButtonDeliverAll(orders[i]);
          this.translateStatus(orders[i]);
        }
      } else {
        let index = 0;
        for (let i = 0; i < orders.length; i++) {
          const desk: Desk = orders[i].desk;
          this.paramId = Number(params['id']);
          if (desk.parentId === this.paramId || desk.id === this.paramId) {
            this.orderOpeneds.push(orders[i]);
            this.showButtonPayment(orders[i]);
            this.showButtonSendAllToKitchen(orders[i]);
            this.showButtonDeliverAll(orders[i]);
            this.translateStatus(orders[i]);
            index++;
          }
        }
      }
      if (params['id'] !== undefined && orders.length > 0 && this.orderOpeneds.length > 0 && this.orderOpeneds[0].desk.parentId !== 0) {
        this.deskService.find(this.orderOpeneds[0].desk.parentId).subscribe((res: HttpResponse<Desk>) => {
          const desk = res.body;
          this.choosenRoomDescription = desk.description;
        });
      } else {
        this.choosenRoomDescription = this.translateService.instant('home.orders');
      }
      if (orders.length === 0 || this.orderOpeneds.length === 0) {
        this.showNoOrders = true;
      } else {
        this.showNoOrders = false;
      }
    });
  }

  showButtonPayment(order) {
    let allowPayment;
    for (let i = 0; i < order.productsToOrder.length; i++) {
      if (
        order.productsToOrder[i].product.productType !== null &&
        order.productsToOrder[i].product.productType.id === 2 &&
        (order.productsToOrder[i].orderedProductStatus === null ||
          order.productsToOrder[i].orderedProductStatus.id === 2 ||
          order.productsToOrder[i].orderedProductStatus.id === 3 ||
          order.productsToOrder[i].orderedProductStatus.id === 4 ||
          order.productsToOrder[i].orderedProductStatus.id === 5)
      ) {
        allowPayment = false;
        break;
      } else {
        allowPayment = true;
      }
    }

    if (allowPayment === true) {
      this.showButtonPaymentArray.push(order.id);
    } else {
      this.showButtonPaymentArray.push('NULL');
    }
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInOrderOpeneds();
    window.addEventListener('scroll', this.showScrollButtons, true);
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
    window.removeEventListener('scroll', this.showScrollButtons, true);
  }

  trackId(index: number, item: OrderOpened) {
    return item.id;
  }
  registerChangeInOrderOpeneds() {
    this.eventSubscriber = this.eventManager.subscribe('orderOpenedListModification', response => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  //  private onSuccess(data, headers) {
  //    this.links = this.parseLinks.parse(headers.get('link'));
  //    this.totalItems = headers.get('X-Total-Count');
  //    this.queryCount = this.totalItems;
  //    // this.page = pagingParams.page;
  //    this.orderOpeneds = data;
  //  }
  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }

  private subscribeToSaveProductsListResponse(result: Observable<HttpResponse<ProductsOrdered>>) {
    result.subscribe(
      (res: HttpResponse<ProductsOrdered>) => this.onProductsListSaveSuccess(res.body),
      (res: HttpErrorResponse) => this.onSaveError()
    );
  }

  private onProductsListSaveSuccess(result: ProductsOrdered) {
    this.eventManager.broadcast({ name: 'productOrderedListModification', content: 'OK' });
    this.eventManager.broadcast({ name: 'orderOpenedListModification', content: 'OK' });
    this.isSaving = false;
  }
}
