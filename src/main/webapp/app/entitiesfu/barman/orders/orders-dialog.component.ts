// import { User, UserService } from '../../../core';
import { Desk } from '../../../shared/model/desk.model';
import { OrderOpened } from '../../../shared/model/order-opened.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { OrdersPopupService } from './orders-popup.service';
import { ActiveOrdersOpenedService } from '../../active-entities/active-orders-opened.service';
import { ActiveDeskService } from '../../active-entities/active-desk.service';

@Component({
  selector: 'jhi-order-opened-dialog',
  templateUrl: './orders-dialog.component.html'
})
export class OrdersDialogComponent implements OnInit {
  hasSubDesk: boolean;

  orderOpened: OrderOpened;
  isSaving: boolean;
  changingDesk = false;

  //    payments: Payment[];

  desks: Desk[];

  //  users: User[];
  subDesks = [];
  prtDsk = null;
  prtDskDescr = null;
  showChooseDeskButtonX = false;

  //    restaurants: Restaurant[];

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private orderOpenedService: ActiveOrdersOpenedService,
    //        private paymentService: PaymentService,
    private deskService: ActiveDeskService,
    //    private userService: UserService,
    //        private restaurantService: RestaurantService,
    private eventManager: JhiEventManager
  ) {}

  chooseDesk(id) {
    for (let i = 0; this.desks.length; i++) {
      if (this.desks[i].id === id) {
        this.orderOpened.desk = this.desks[i];
        this.changingDesk = false;
        //        this.choosenDeskDescription = this.desks[i].description;
        break;
      }
    }
  }

  showChooseDeskButton() {
    this.showChooseDeskButtonX = true;
  }

  findSubDesks(parentDesk) {
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
      this.hasSubDesk = false;
    } else {
      this.subDesks = previossubDesks;
      this.hasSubDesk = true;
    }
  }

  startChangingDesk() {
    this.changingDesk = true;
  }

  ngOnInit() {
    this.isSaving = false;
    this.deskService.query().subscribe(
      (res: HttpResponse<Desk[]>) => {
        this.desks = res.body;
        this.findSubDesks(null);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    //    this.userService.query()
    //            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.orderOpened.id !== undefined) {
      this.subscribeToSaveResponse(this.orderOpenedService.update(this.orderOpened));
    } else {
      this.subscribeToSaveResponse(this.orderOpenedService.create(this.orderOpened));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<OrderOpened>>) {
    result.subscribe((res: HttpResponse<OrderOpened>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: OrderOpened) {
    this.eventManager.broadcast({ name: 'orderOpenedListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackDeskById(index: number, item: Desk) {
    return item.id;
  }

  //  trackUserById(index: number, item: User) {
  //    return item.id;
  //  }
}

@Component({
  selector: 'jhi-order-opened-popup',
  template: ''
})
export class OrdersPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private orderOpenedPopupService: OrdersPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderOpenedPopupService.open(OrdersDialogComponent as Component, params['id']);
      } else {
        this.orderOpenedPopupService.open(OrdersDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
