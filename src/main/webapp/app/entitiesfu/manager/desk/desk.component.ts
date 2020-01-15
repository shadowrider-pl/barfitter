import { AccountService } from 'app/core/auth/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DeskService } from './desk.service';
import { Desk } from '../../../shared/model/desk.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-desk',
  templateUrl: './desk.component.html'
})
export class DeskComponent implements OnInit, OnDestroy {
  currentAccount: any;
  desks: Array<Object> = [];
  eventSubscriber: Subscription;
  currentSearch: string;
  simpleDesks: Desk[];
  prtDesk = 0;
  c = 0;

  subString = '';
  subCount = 0;
  currentParentDesk = 0;
  spinner = false;
  showLoadDefaults = false;

  constructor(
    private deskService: DeskService,
    private jhiAlertService: JhiAlertService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private eventManager: JhiEventManager
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAll() {
    this.spinner = true;
    this.desks.length = 0;
    //        if (this.currentSearch) {
    //            this.deskService.search({
    //                query: this.currentSearch,
    //                }).subscribe(
    //                    (res: HttpResponse<Desk[]>) => this.onSuccess(res.body, res.headers),
    //                    (res: HttpErrorResponse) => this.onError(res.message)
    //                );
    //            return;
    //        }
    this.deskService.query().subscribe(
      (res: HttpResponse<Desk[]>) => {
        this.onSuccess(res.body, res.headers);
        this.findSubdesks(null);
        this.currentSearch = '';
        this.spinner = false;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  findSubdesks(parentDesk) {
    let prtDesk;
    if (parentDesk === null) {
      prtDesk = 0;
    } else {
      prtDesk = parentDesk.id;
    }
    for (let i = 0; i < this.simpleDesks.length; i++) {
      if (this.simpleDesks[i].parentId === prtDesk) {
        this.subString = '';
        if (this.simpleDesks[i].parentId === 0) {
          this.subCount = 0;
        } else if (this.simpleDesks[i].parentId > this.currentParentDesk) {
          this.subCount++;
        } else if (this.simpleDesks[i].parentId < this.currentParentDesk) {
          this.subCount--;
        }

        for (let ii = 1; ii <= this.subCount; ii++) {
          this.subString += '|' + '\xa0' + '\xa0' + '\xa0' + '\xa0' + '\xa0' + '\xa0' + '\xa0' + '\xa0';
        }
        this.simpleDesks[i].description = this.subString + this.simpleDesks[i].description;
        this.desks.push(this.simpleDesks[i]);
        this.subString = '';
        this.currentParentDesk = this.simpleDesks[i].parentId;
        this.findSubdesks(this.simpleDesks[i]);
      }
    }
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }
  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }
  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInDesks();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: Desk) {
    return item.id;
  }
  registerChangeInDesks() {
    this.eventSubscriber = this.eventManager.subscribe('deskListModification', response => this.loadAll());
  }

  private onSuccess(data, headers) {
    this.simpleDesks = data;
    this.simpleDesks.sort(this.compare);
    if (this.simpleDesks.length === 0) this.showLoadDefaults = true;
  }

  compare(a, b) {
    if (a.description < b.description) {
      return -1;
    }
    if (a.description > b.description) {
      return 1;
    }
    return 0;
  }

  //    sort() {
  //        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
  //        if (this.predicate !== 'id') {
  //            result.push('id');
  //        }
  //        return result;
  //    }

  //    private onSuccess(data, headers) {
  //        this.links = this.parseLinks.parse(headers.get('link'));
  //        this.totalItems = headers.get('X-Total-Count');
  //        this.queryCount = this.totalItems;
  //        // this.page = pagingParams.page;
  //        this.desks = data;
  //    }
  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
