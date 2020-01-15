import { AccountService } from 'app/core/auth/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { CategoryService } from './category.service';
import { Category } from '../../../shared/model/category.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit, OnDestroy {
  currentAccount: any;
  categories: Array<Object> = [];
  simpleCategories: Category[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  subString = null;
  subCount = null;
  currentParentCategory = null;
  spinner = false;
  showLoadDefaults = false;

  constructor(
    private categoryService: CategoryService,
    private parseLinks: JhiParseLinks,
    private jhiAlertService: JhiAlertService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventManager: JhiEventManager
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAll() {
    this.spinner = true;
    this.categories.length = 0;
    //    if (this.currentSearch) {
    //      this.categoryService.search({
    //        query: this.currentSearch,
    //      }).subscribe(
    //                    (res: HttpResponse<Category[]>) => this.onSuccess(res.body, res.headers),
    //                    (res: HttpErrorResponse) => this.onError(res.message)
    //        );
    //      return;
    //    }
    this.categoryService.query().subscribe(
      (res: HttpResponse<Category[]>) => {
        this.onSuccess(res.body, res.headers);
        this.findSubcategories(null);
        this.currentSearch = '';
        this.spinner = false;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  private onSuccess(data, headers) {
    this.simpleCategories = data;
    this.simpleCategories.sort(this.compare);
    if (this.simpleCategories.length === 0) this.showLoadDefaults = true;
  }

  compare(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  findSubcategories(parentCategory) {
    let prtCat;
    if (parentCategory === null) {
      prtCat = 0;
    } else {
      prtCat = parentCategory.id;
    }
    for (let i = 0; i < this.simpleCategories.length; i++) {
      if (this.simpleCategories[i].parentId === prtCat) {
        this.subString = '';
        if (this.simpleCategories[i].parentId === 0) {
          this.subCount = 0;
        } else if (this.simpleCategories[i].parentId > this.currentParentCategory) {
          this.subCount++;
        } else if (this.simpleCategories[i].parentId < this.currentParentCategory) {
          this.subCount--;
        }

        for (let ii = 1; ii <= this.subCount; ii++) {
          this.subString += '|' + '\xa0' + '\xa0' + '\xa0' + '\xa0' + '\xa0' + '\xa0' + '\xa0' + '\xa0';
        }
        this.simpleCategories[i].name = this.subString + this.simpleCategories[i].name;
        this.categories.push(this.simpleCategories[i]);
        this.subString = '';
        this.currentParentCategory = this.simpleCategories[i].parentId;
        this.findSubcategories(this.simpleCategories[i]);
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
    this.registerChangeInCategories();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: Category) {
    return item.id;
  }
  registerChangeInCategories() {
    this.eventSubscriber = this.eventManager.subscribe('categoryListModification', response => this.loadAll());
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
