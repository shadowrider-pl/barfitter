import { AccountService } from 'app/core/auth/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { ActiveOrdersOpenedService } from '../../active-entities/active-orders-opened.service';
import { Desk } from '../../../shared/model/desk.model';
import { OrderOpened } from '../../../shared/model/order-opened.model';
import { ActiveDeskService } from '../../active-entities/active-desk.service';

@Component({
  selector: 'jhi-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['../../../../app/../content/css/scroll-buttons.scss']
})
export class AllOrdersComponent implements OnInit, OnDestroy {
  orderOpeneds: OrderOpened[];
  desks: Desk[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  spinner = false;

  rooms = [];
  desksInRoom = [];
  roomsToDesks = {};
  countAll = 0;
  count = 0;
  scrollInPixels = 200;

  constructor(
    private orderOpenedService: ActiveOrdersOpenedService,
    private activeDeskService: ActiveDeskService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

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

  findRooms(orders) {
    this.desksInRoom.length = 0;
    this.countAll = 0;
    this.rooms.length = 0;
    let countOrdersWithoutDesk = 0;
    let foundOrdersWithoutDesk = false;
    //      console.log("start");
    for (let i = 0; i < this.desks.length; i++) {
      if (this.desks[i].parentId === 0) {
        this.rooms.push(this.desks[i]);
      }
    }

    for (let i = 0; i < this.rooms.length; i++) {
      this.count = 0;
      for (let j = 0; j < orders.length; j++) {
        const desk = orders[j].desk;
        //          console.log("desk: "+desk.parentId);
        if (desk != null && (desk.parentId === this.rooms[i].id || desk.id === this.rooms[i].id)) {
          this.count++;
          //            console.log("this.count: "+this.count);
        }
        if (desk === null && foundOrdersWithoutDesk === false) {
          countOrdersWithoutDesk++;
        }
      }
      if (countOrdersWithoutDesk > 0) {
        foundOrdersWithoutDesk = true;
      }
      this.roomsToDesks = { room: this.rooms[i], count: this.count };
      this.desksInRoom.push(this.roomsToDesks);
      this.countAll = this.countAll + this.count;
    }
    this.countAll = this.countAll + countOrdersWithoutDesk;
  }

  loadAll() {
    this.spinner = true;
    this.orderOpenedService.query().subscribe(
      (res: HttpResponse<OrderOpened[]>) => {
        this.orderOpeneds = res.body;
        this.currentSearch = '';
        this.activeDeskService.query().subscribe(
          (res2: HttpResponse<Desk[]>) => {
            this.desks = res2.body;
            this.findRooms(this.orderOpeneds);
            this.currentSearch = '';
            this.spinner = false;
          },
          (res2: HttpErrorResponse) => this.onError(res2.message)
        );
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }
  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInProductTypes();
    window.addEventListener('scroll', this.showScrollButtons, true);
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
    window.removeEventListener('scroll', this.showScrollButtons, true);
  }

  trackId(index: number, item: OrderOpened) {
    return item.id;
  }
  registerChangeInProductTypes() {
    this.eventSubscriber = this.eventManager.subscribe('orderOpenedListModification', response => this.loadAll());
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
