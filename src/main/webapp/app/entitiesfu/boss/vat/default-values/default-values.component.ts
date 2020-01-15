import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { Restaurant } from '../../../../shared/model/restaurant.model';
import { Vat } from '../../../../shared/model/vat.model';
import { Desk } from 'app/shared/model/desk.model';
import { Category } from 'app/shared/model/category.model';
import { BossVatService } from '../vat.service';
import { DeskService } from 'app/entitiesfu/manager/desk/desk.service';
import { CategoryService } from 'app/entitiesfu/manager/category/category.service';
import { Defaults } from 'app/entitiesfu/models/defaults';
import { DefaultValuesService } from './default-values.service';

@Component({
  selector: 'jhi-default-values',
  templateUrl: './default-values.component.html'
})
export class DefaultValuesComponent implements OnInit {
  isVats = true;
  isDesks = true;
  isCategories = true;
  vats: Vat[] = [];
  desks: Desk[] = [];
  categories: Category[] = [];
  eventSubscriber: Subscription;

  isSaving: boolean;

  restaurants: Restaurant[];
  showAllDone = false;

  constructor(
    private categoryService: CategoryService,
    private deskService: DeskService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private vatService: BossVatService,
    private defaultValuesService: DefaultValuesService
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.loadAllVats();
    this.loadAllDesks();
    this.loadAllCategories();
    // if(!this.isVats)        this.buildSampleVats();
    if (!this.isDesks) this.buildSampleDesks();
    if (!this.isCategories) this.buildSampleCategories();

    this.registerChange();
  }

  registerChange() {
    this.eventSubscriber = this.eventManager.subscribe('defaultListModification', response => (this.showAllDone = true));
  }

  loadAllCategories() {
    this.categoryService
      .query()
      .subscribe(
        (res: HttpResponse<Desk[]>) => this.onCategoriesSuccess(res.body),
        (res: HttpErrorResponse) => this.onCategoriesError(res.message)
      );
  }

  private onCategoriesSuccess(data) {
    if (data.length === 0) {
      this.isCategories = false;
      this.buildSampleCategories();
    }
  }
  private onCategoriesError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }

  loadAllDesks() {
    this.deskService
      .query()
      .subscribe((res: HttpResponse<Desk[]>) => this.onDesksSuccess(res.body), (res: HttpErrorResponse) => this.onDesksError(res.message));
  }

  private onDesksSuccess(data) {
    if (data.length === 0) {
      this.isDesks = false;
      this.buildSampleDesks();
    }
  }
  private onDesksError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }

  loadAllVats() {
    this.vatService
      .query()
      .subscribe((res: HttpResponse<Vat[]>) => this.onVatSuccess(res.body), (res: HttpErrorResponse) => this.onVatError(res.message));
  }

  private onVatSuccess(data) {
    if (data.length === 0) {
      this.isVats = false;
      this.buildSampleVats();
    }
  }
  private onVatError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }

  getDeskParentName(parent) {
    return parent === undefined || this.desks[parent - 1] === undefined ? '' : this.desks[parent - 1].description;
  }

  getCategoryParentName(parent) {
    return parent === undefined || this.categories[parent - 1] === undefined ? '' : this.categories[parent - 1].name;
  }

  buildSampleCategories() {
    let category = new Category();
    category.id = 1;
    category.active = true;
    category.name = 'Napoje';
    category.parentId = 0;
    this.categories.push(category);

    category = new Category();
    category.id = 2;
    category.parentId = 1;
    category.active = true;
    category.name = 'Napoje gorące';
    this.categories.push(category);

    category = new Category();
    category.id = 3;
    category.parentId = 1;
    category.active = true;
    category.name = 'Napoje zimne';
    this.categories.push(category);

    category = new Category();
    category.id = 4;
    category.active = true;
    category.name = 'Zupy';
    category.parentId = 0;
    this.categories.push(category);

    category = new Category();
    category.id = 5;
    category.active = true;
    category.name = 'Dania główne';
    category.parentId = 0;
    this.categories.push(category);
  }

  buildSampleDesks() {
    let desk = new Desk();
    desk.active = true;
    desk.description = 'Sala główna';
    desk.id = 1;
    desk.parentId = 0;
    this.desks.push(desk);

    desk = new Desk();
    desk.active = true;
    desk.description = 'Stolik 1';
    desk.id = 2;
    desk.parentId = 1;
    this.desks.push(desk);

    desk = new Desk();
    desk.active = true;
    desk.description = 'Stolik 2';
    desk.id = 3;
    desk.parentId = 1;
    this.desks.push(desk);
  }

  buildSampleVats() {
    const vatValues = [0.23, 0.8, 0.5, 0];
    const vatDescriptions = ['23%', '8%', '5%', '0%'];
    for (let i = 0; i < vatValues.length; i++) {
      const vat = new Vat();
      vat.active = true;
      vat.description = vatDescriptions[i];
      vat.rate = vatValues[i];
      this.vats.push(vat);
    }
  }

  checkParentDesk(desk: Desk) {
    if (desk.active === false) {
      this.desks.forEach(function(iteratedDesk) {
        if (iteratedDesk.parentId === desk.id) iteratedDesk.active = false;
      });
    } else {
      this.desks.forEach(function(iteratedDesk) {
        if (desk.parentId === iteratedDesk.id && iteratedDesk.parentId === 0) iteratedDesk.active = true;
      });
    }
  }

  checkParentCategory(category: Category) {
    if (category.active === false) {
      this.categories.forEach(function(iteratedCategory) {
        if (iteratedCategory.parentId === category.id) iteratedCategory.active = false;
      });
    } else {
      this.categories.forEach(function(iteratedCategory) {
        if (category.parentId === iteratedCategory.id && iteratedCategory.parentId === 0) iteratedCategory.active = true;
      });
    }
  }

  save() {
    this.isSaving = true;
    const defaults: Defaults = new Defaults();
    defaults.vats = this.vats.filter(vat => vat.active === true);
    defaults.categories = this.categories.filter(category => category.active === true);
    defaults.desks = this.desks.filter(desk => desk.active === true);

    this.subscribeToSaveResponse(this.defaultValuesService.create(defaults));
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Defaults>>) {
    result.subscribe((res: HttpResponse<Defaults>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: Defaults) {
    this.eventManager.broadcast({ name: 'defaultListModification', content: 'OK' });
    this.desks.length = 0;
    this.vats.length = 0;
    this.categories.length = 0;
    this.isCategories = true;
    this.isVats = true;
    this.isDesks = true;
    this.isSaving = false;
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackVatId(index: number, item: Vat) {
    return item.id;
  }

  trackCategoryId(index: number, item: Category) {
    return item.id;
  }

  trackDeskId(index: number, item: Desk) {
    return item.id;
  }
}
