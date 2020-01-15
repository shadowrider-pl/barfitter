import { AccountService } from 'app/core/auth/account.service';
import { ProductOrdered } from '../../../shared/model/product-ordered.model';
import { ProductSold } from '../../../shared/model/product-sold.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { SubstitutesService } from './substitutes.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-substitutes',
  templateUrl: './substitutes.component.html'
})
export class SubstitutesComponent implements OnInit, OnDestroy {
  substitutes: ProductSold[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    private substitutesService: SubstitutesService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAll() {
    //        if (this.currentSearch) {
    //            this.substitutesService.search({
    //                query: this.currentSearch,
    //                }).subscribe(
    //                    (res: HttpResponse<ProductOrdered[]>) => this.onSuccess(res.body, res.headers),
    //                    (res: HttpErrorResponse) => this.onError(res.message)
    //                );
    //            return;
    //       }
    this.substitutesService.query().subscribe(
      (res: HttpResponse<ProductOrdered[]>) => {
        this.substitutes = res.body;
        this.currentSearch = '';
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
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
    this.registerChangeInSubstitutes();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ProductOrdered) {
    return item.id;
  }
  registerChangeInSubstitutes() {
    this.eventSubscriber = this.eventManager.subscribe('substitutesListModification', response => this.loadAll());
  }

  private onSuccess(data, headers) {
    this.substitutes = data;
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
