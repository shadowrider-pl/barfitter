import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { OrderWithProductsService } from '../../../entitiesfu/active-entities/order-with-products.service';
import { OrderWithProducts } from '../../../entitiesfu/models/order-opened-with-products.model';
import { Desk } from '../../../shared/model/desk.model';
import { OrderOpened } from '../../../shared/model/order-opened.model';
import { ProductOrdered } from '../../../shared/model/product-ordered.model';
import { OrderWithProductsAndStatus } from '../../models/order-opened-with-products-and-status.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-chef-panel',
  templateUrl: './chef-panel.component.html',
  styleUrls: ['../../../../app/../content/css/scroll-buttons.scss']
})
export class ChefPanelComponent implements OnInit, OnDestroy {
  foundSubDesks: boolean;
  alerts: any[];
  desks: Desk[];
  prtDsk = null;
  prtDskDescr = null;
  subDesks: Desk[];
  showChooseDeskButtonX = false;
  choosenDeskDescription = null;
  orderSpinner = true;
  orderOpened: OrderOpened = {};
  ordersOpenedWithProducts: OrderWithProducts[];
  //  orderWithProductsAndStatus: OrderWithProductsAndStatus ={};
  ordersWithProductsAndStatus: OrderWithProductsAndStatus[] = [];
  account: Account;
  spinner = false;
  registeredBellClick = false;
  eventBellClickSubscriber: Subscription;
  scrollInPixels = 200;

  constructor(
    //    private deskService: ActiveDeskService,
    private jhiAlertService: JhiAlertService,
    private orderWithProductsService: OrderWithProductsService,
    private accountService: AccountService,
    private translateService: TranslateService,
    private eventManager: JhiEventManager
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

  ngOnInit() {
    this.getOrders();
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    this.registerAuthenticationSuccess();
    this.registeredBellClick = false;
    this.registerBellClick();
    window.addEventListener('scroll', this.showScrollButtons, true);
  }

  registerBellClick() {
    let bellBadge = null;
    if (!this.registeredBellClick) {
      this.eventBellClickSubscriber = this.eventManager.subscribe('reloadKitchen', response => {
        this.getOrders();
        bellBadge = response;
      });
      this.registeredBellClick = true;
    }
  }

  getOrders() {
    this.spinner = true;
    this.orderWithProductsService.query().subscribe(
      (res: HttpResponse<OrderWithProducts[]>) => {
        this.ordersOpenedWithProducts = res.body;
        //        this.findSubDesks(null);
        //        this.findOrderStatus();
        this.findOrdersForChef();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.spinner = false;
  }

  findOrdersForChef() {
    this.ordersWithProductsAndStatus.length = 0;
    this.orderSpinner = true;
    for (let i = 0; i < this.ordersOpenedWithProducts.length; i++) {
      for (let j = 0; j < this.ordersOpenedWithProducts[i].productsToOrder.length; j++) {
        if (
          this.ordersOpenedWithProducts[i].productsToOrder[j].orderedProductStatus != null &&
          this.ordersOpenedWithProducts[i].productsToOrder[j].orderedProductStatus.id !== 1 &&
          this.ordersOpenedWithProducts[i].productsToOrder[j].orderedProductStatus.id !== 6
        ) {
          this.addOrderForChef(this.ordersOpenedWithProducts[i]);
          break;
        }
      }
    }
    this.orderSpinner = false;
  }

  addOrderForChef(orderWithProducts: OrderWithProducts) {
    //      console.log("order="+orderWithProducts.orderId);
    const orderWithProductsAndStatus: OrderWithProductsAndStatus = {};
    orderWithProductsAndStatus.id = orderWithProducts.id;
    orderWithProductsAndStatus.orderId = orderWithProducts.orderId;
    orderWithProductsAndStatus.barman = orderWithProducts.barman;
    orderWithProductsAndStatus.comment = orderWithProducts.comment;
    orderWithProductsAndStatus.desk = orderWithProducts.desk;
    orderWithProductsAndStatus.productsToOrder = [];
    orderWithProductsAndStatus.status = null;
    let tempStatus = null;
    for (let j = 0; j < orderWithProducts.productsToOrder.length; j++) {
      if (orderWithProducts.productsToOrder[j].product.productType.id === 2) {
        orderWithProductsAndStatus.productsToOrder.push(orderWithProducts.productsToOrder[j]);
      }
      if (orderWithProducts.productsToOrder[j].orderedProductStatus) {
        switch (orderWithProducts.productsToOrder[j].orderedProductStatus.id) {
          case 2: {
            tempStatus = 2;
            break;
          }
          case 3: {
            tempStatus = 3;
            break;
          }
          case 4: {
            tempStatus = 4;
            break;
          }
          case 5: {
            tempStatus = 5;
            break;
          }
        }
      }
    }
    if (orderWithProductsAndStatus.status == null) {
      orderWithProductsAndStatus.status = tempStatus;
      //      console.log("1st="+orderWithProductsAndStatus.status);
    } else if (tempStatus < orderWithProductsAndStatus.status) {
      orderWithProductsAndStatus.status = tempStatus;
      //      console.log("status="+orderWithProductsAndStatus.status);
    }
    if (orderWithProductsAndStatus.productsToOrder.length > 3) {
      orderWithProductsAndStatus.productsToOrder.splice(3, orderWithProductsAndStatus.productsToOrder.length - 3);
      const moreStr = this.translateService.instant('barfitterApp.productOrdered.andMore');
      const more: ProductOrdered = { product: { name: moreStr } };
      orderWithProductsAndStatus.productsToOrder.push(more);
    }
    this.ordersWithProductsAndStatus.push(orderWithProductsAndStatus);
  }

  //    findOrderStatus() {
  //      this.desksWithStatus = [];
  //      //    const deskWithStatus: DeskWithOrderStatus ={};
  //      for (let i = 0; i < this.subDesks.length; i++) {
  //        const deskWithStatus: DeskWithOrderStatus = {};
  //        deskWithStatus.description = this.subDesks[i].description;
  //        deskWithStatus.id = this.subDesks[i].id;
  //        deskWithStatus.parentId = this.subDesks[i].parentId;
  //        deskWithStatus.restaurant = this.subDesks[i].restaurant;
  //        deskWithStatus.active = this.subDesks[i].active;
  //        deskWithStatus.status = 0;
  //        deskWithStatus.hasSubDesk = false;
  //        for (let jj = 0; jj < this.desks.length; jj++) { // find sub desk
  //          if (this.subDesks[i].id === this.desks[jj].parentId) {
  //            deskWithStatus.hasSubDesk = true;
  //          }
  //        }
  //
  //        for (let j = 0; j < this.ordersOpenedWithProducts.length; j++) {
  //          if (this.ordersOpenedWithProducts[j].desk.id === this.subDesks[i].id // if order is assigned to current desk
  //            || this.ordersOpenedWithProducts[j].desk.parentId === this.subDesks[i].id) { // if order is assigned to current room
  //            deskWithStatus.status = 1;
  //            for (let k = 0; k < this.ordersOpenedWithProducts[j].productsToOrder.length; k++) {
  //              if (this.ordersOpenedWithProducts[j].productsToOrder[k].orderedProductStatus != null
  //                && (this.ordersOpenedWithProducts[j].productsToOrder[k].orderedProductStatus.id === 4
  //                  || this.ordersOpenedWithProducts[j].productsToOrder[k].orderedProductStatus.id === 5)) {
  //                deskWithStatus.status = this.ordersOpenedWithProducts[j].productsToOrder[k].orderedProductStatus.id;
  //                break;
  //              }
  //            }
  //          }
  //        }
  //        this.desksWithStatus.push(deskWithStatus);
  //      }
  //    }

  //  findSubDesks(parentDesk) {
  //    this.deskSpinner = true;
  //    if (parentDesk == null || parentDesk.id === 0) {
  //      this.prtDsk = 0;
  //    } else {
  //      this.prtDsk = parentDesk.id;
  //      this.prtDskDescr = parentDesk.description;
  //    }
  //    const previossubDesks = this.subDesks;
  //    this.subDesks = [];
  //    const tempsubDesks = [];
  //    for (let i = 0; i < this.desks.length; i++) {
  //      if (this.desks[i].parentId === this.prtDsk) {
  //        tempsubDesks.push(this.desks[i]);
  //      }
  //
  //    }
  //
  //    if (tempsubDesks.length > 0) {
  //      this.subDesks = tempsubDesks;
  //      this.foundSubDesks = true;
  //      this.findOrderStatus();
  //    } else {
  //      this.subDesks = previossubDesks;
  //      this.foundSubDesks = false;
  //      //      this.findOrders(parentDesk);
  //    }
  //    this.deskSpinner = false;
  //  }
  //
  //  //  findOrders(parentDesk) {
  //  //
  //  //  }
  //
  //  showChooseDeskButton(deskParentId) {
  //    this.showChooseDeskButtonX = true;
  //  }
  //
  //  resetDesk() {
  //    this.findSubDesks(null);
  //    this.showChooseDeskButtonX = false;
  //  }
  //
  //  chooseDesk(id) {
  //    if (this.foundSubDesks) {
  //      for (let i = 0; this.desks.length; i++) {
  //        if (this.desks[i].id === id) {
  //          this.orderOpened.desk = this.desks[i];
  //          this.choosenDeskDescription = this.desks[i].description;
  //          break;
  //        }
  //      }
  //    }
  //  }
  //
  ngOnDestroy() {
    window.removeEventListener('scroll', this.showScrollButtons, true);
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  registerAuthenticationSuccess() {
    this.eventManager.subscribe('authenticationSuccess', message => {
      this.accountService.identity().subscribe(account => {
        this.account = account;
      });
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }
}
