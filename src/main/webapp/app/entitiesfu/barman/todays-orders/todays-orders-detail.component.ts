import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { HttpResponse } from '@angular/common/http';

import { TodaysOrders } from './todays-orders.model';
import { TodaysOrdersService } from './todays-orders.service';

@Component({
  selector: 'jhi-todays-orders-detail',
  templateUrl: './todays-orders-detail.component.html'
})
export class TodaysOrdersDetailComponent implements OnInit, OnDestroy {
  todaysOrders: TodaysOrders;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(private eventManager: JhiEventManager, private todaysOrdersService: TodaysOrdersService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInTodaysOrders();
  }

  load(id) {
    this.todaysOrdersService.find(id).subscribe((todaysOrders: HttpResponse<TodaysOrders>) => {
      this.todaysOrders = todaysOrders.body;
    });
  }
  //    load(id) {
  //        this.todaysOrdersService.find(id).subscribe((todaysOrders) => {
  //            this.todaysOrders = todaysOrders;
  //        });
  //    }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInTodaysOrders() {
    this.eventSubscriber = this.eventManager.subscribe('todaysOrdersListModification', response => this.load(this.todaysOrders.id));
  }
}
