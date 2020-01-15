import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';

import { IOrderedProductStatus } from 'app/shared/model/ordered-product-status.model';
import { AccountService } from 'app/core/auth/account.service';
import { OrderedProductStatusService } from './ordered-product-status.service';

@Component({
  selector: 'jhi-ordered-product-status',
  templateUrl: './ordered-product-status.component.html'
})
export class OrderedProductStatusComponent implements OnInit, OnDestroy {
  orderedProductStatuses: IOrderedProductStatus[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected orderedProductStatusService: OrderedProductStatusService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.orderedProductStatusService
      .query()
      .pipe(
        filter((res: HttpResponse<IOrderedProductStatus[]>) => res.ok),
        map((res: HttpResponse<IOrderedProductStatus[]>) => res.body)
      )
      .subscribe((res: IOrderedProductStatus[]) => {
        this.orderedProductStatuses = res;
      });
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInOrderedProductStatuses();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IOrderedProductStatus) {
    return item.id;
  }

  registerChangeInOrderedProductStatuses() {
    this.eventSubscriber = this.eventManager.subscribe('orderedProductStatusListModification', response => this.loadAll());
  }
}
