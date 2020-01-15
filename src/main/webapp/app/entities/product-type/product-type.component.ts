import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';

import { IProductType } from 'app/shared/model/product-type.model';
import { AccountService } from 'app/core/auth/account.service';
import { ProductTypeService } from './product-type.service';

@Component({
  selector: 'jhi-product-type',
  templateUrl: './product-type.component.html'
})
export class ProductTypeComponent implements OnInit, OnDestroy {
  productTypes: IProductType[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected productTypeService: ProductTypeService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.productTypeService
      .query()
      .pipe(
        filter((res: HttpResponse<IProductType[]>) => res.ok),
        map((res: HttpResponse<IProductType[]>) => res.body)
      )
      .subscribe((res: IProductType[]) => {
        this.productTypes = res;
      });
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInProductTypes();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IProductType) {
    return item.id;
  }

  registerChangeInProductTypes() {
    this.eventSubscriber = this.eventManager.subscribe('productTypeListModification', response => this.loadAll());
  }
}
