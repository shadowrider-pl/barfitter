import { AccountService } from 'app/core/auth/account.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActiveDeskService } from '../../../entitiesfu/active-entities/active-desk.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { OrderWithProductsService } from '../../../entitiesfu/active-entities/order-with-products.service';
import { DeskWithOrderStatus } from '../../../entitiesfu/models/desk-with-order-status';
import { OrderWithProducts } from '../../../entitiesfu/models/order-opened-with-products.model';
import { Desk } from '../../../shared/model/desk.model';
import { OrderOpened } from '../../../shared/model/order-opened.model';
import { Account } from 'app/core/user/account.model';

@Component({
  selector: 'jhi-barman-panel',
  templateUrl: './barman-panel.component.html',
  styleUrls: ['../../../../app/../content/css/scroll-buttons.scss']
})
export class BarmanPanelComponent implements OnInit, OnDestroy {
  foundSubDesks: boolean;
  alerts: any[];
  desks: Desk[];
  prtDsk = null;
  prtDskDescr = null;
  subDesks: Desk[];
  showChooseDeskButtonX = false;
  choosenDeskDescription = null;
  deskSpinner = true;
  orderOpened: OrderOpened = {};
  ordersOpenedWithProducts: OrderWithProducts[];
  desksWithStatus: DeskWithOrderStatus[];
  deskWithStatus: DeskWithOrderStatus = {};
  account: Account;
  scrollInPixels = 200;

  constructor(
    private deskService: ActiveDeskService,
    private jhiAlertService: JhiAlertService,
    private orderWithProductsService: OrderWithProductsService,
    private accountService: AccountService,
    private eventManager: JhiEventManager
  ) {}

  showScrollButtons() {
    if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && document.getElementById('upButton') !== null) {
      document.getElementById('upButton').style.display = 'block';
    } else {
      document.getElementById('upButton').style.display = 'none';
    }

    if (
      (document.body.scrollTop > 20 ||
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
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.registerAuthenticationSuccess();
    });
    this.getDesks();
    window.addEventListener('scroll', this.showScrollButtons, true);
  }

  getDesks() {
    this.deskService.query().subscribe(
      (res: HttpResponse<Desk[]>) => {
        this.desks = res.body;
        this.getOrders();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  getOrders() {
    this.orderWithProductsService.query().subscribe(
      (res: HttpResponse<OrderWithProducts[]>) => {
        this.ordersOpenedWithProducts = res.body;
        this.findSubDesks(null);
        this.findDesksWithOrderStatus();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  findDesksWithOrderStatus() {
    this.desksWithStatus = [];
    //    const deskWithStatus: DeskWithOrderStatus ={};
    for (let i = 0; i < this.subDesks.length; i++) {
      const deskWithStatus: DeskWithOrderStatus = {};
      deskWithStatus.description = this.subDesks[i].description;
      deskWithStatus.id = this.subDesks[i].id;
      deskWithStatus.parentId = this.subDesks[i].parentId;
      deskWithStatus.restaurant = this.subDesks[i].restaurant;
      deskWithStatus.active = this.subDesks[i].active;
      deskWithStatus.status = 0;
      deskWithStatus.hasSubDesk = false;
      for (let jj = 0; jj < this.desks.length; jj++) {
        // find sub desk
        if (this.subDesks[i].id === this.desks[jj].parentId) {
          deskWithStatus.hasSubDesk = true;
        }
      }

      for (let j = 0; j < this.ordersOpenedWithProducts.length; j++) {
        if (
          this.ordersOpenedWithProducts[j].desk.id === this.subDesks[i].id || // if order is assigned to current desk
          this.ordersOpenedWithProducts[j].desk.parentId === this.subDesks[i].id
        ) {
          // if order is assigned to current room
          deskWithStatus.status = 1;
          for (let k = 0; k < this.ordersOpenedWithProducts[j].productsToOrder.length; k++) {
            if (
              this.ordersOpenedWithProducts[j].productsToOrder[k].orderedProductStatus != null &&
              (this.ordersOpenedWithProducts[j].productsToOrder[k].orderedProductStatus.id === 4 ||
                this.ordersOpenedWithProducts[j].productsToOrder[k].orderedProductStatus.id === 5)
            ) {
              deskWithStatus.status = this.ordersOpenedWithProducts[j].productsToOrder[k].orderedProductStatus.id;
              break;
            }
          }
        }
      }
      this.desksWithStatus.push(deskWithStatus);
    }
  }

  findSubDesks(parentDesk) {
    this.deskSpinner = true;
    if (parentDesk == null || parentDesk.id === 0) {
      this.prtDsk = 0;
    } else {
      this.prtDsk = parentDesk.id;
      this.prtDskDescr = parentDesk.description;
    }
    const previossubDesks = this.subDesks;
    this.subDesks = [];
    const tempsubDesks = [];
    for (let i = 0; i < this.desks.length; i++) {
      if (this.desks[i].parentId === this.prtDsk) {
        tempsubDesks.push(this.desks[i]);
      }
    }

    if (tempsubDesks.length > 0) {
      this.subDesks = tempsubDesks;
      this.foundSubDesks = true;
      this.findDesksWithOrderStatus();
    } else {
      this.subDesks = previossubDesks;
      this.foundSubDesks = false;
      //      this.findOrders(parentDesk);
    }
    this.deskSpinner = false;
  }

  //  findOrders(parentDesk) {
  //
  //  }

  showChooseDeskButton(deskParentId) {
    this.showChooseDeskButtonX = true;
  }

  resetDesk() {
    this.findSubDesks(null);
    this.showChooseDeskButtonX = false;
  }

  chooseDesk(id) {
    if (this.foundSubDesks) {
      for (let i = 0; this.desks.length; i++) {
        if (this.desks[i].id === id) {
          this.orderOpened.desk = this.desks[i];
          this.choosenDeskDescription = this.desks[i].description;
          break;
        }
      }
    }
  }

  ngOnDestroy() {
    this.alerts = [];
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
