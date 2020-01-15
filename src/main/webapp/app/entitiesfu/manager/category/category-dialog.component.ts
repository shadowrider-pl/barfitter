import { Category } from '../../../shared/model/category.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { CategoryPopupService } from './category-popup.service';
import { CategoryService } from './category.service';

import { Router } from '@angular/router';

@Component({
  selector: 'jhi-category-dialog',
  templateUrl: './category-dialog.component.html'
})
export class CategoryDialogComponent implements OnInit {
  category: Category;
  isSaving: boolean;
  simpleCategory: Category[];
  categories: Category[];
  parentId = null;
  parent = null;
  newCategory = null;
  location = '';
  foundExistingCategory = false;
  deletedCategory = null;

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private categoryService: CategoryService,
    private eventManager: JhiEventManager,
    public _router: Router
  ) {
    this.location = _router.url;
  }

  checkDescription() {
    this.foundExistingCategory = false;
    for (let i = 0; i < this.categories.length; i++) {
      if (
        this.category.name === this.categories[i].name ||
        (this.newCategory != null && this.newCategory === this.categories[i].name)
        // || this.deletedCategory === this.newCategory
      ) {
        this.foundExistingCategory = true;
        break;
      }
    }
  }

  ngOnInit() {
    this.isSaving = false;
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.query().subscribe(
      (res: HttpResponse<Category[]>) => {
        this.onSuccess(res.body, res.headers);
        this.loadParent(this.simpleCategory);
        this.setActiveOnNew();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  setActiveOnNew() {
    if (this.category.id === undefined) {
      this.category.active = true;
    }
  }

  private onSuccess(data, headers) {
    // this.page = pagingParams.page;
    this.simpleCategory = data;
    this.simpleCategory.sort(this.compare);
  }

  loadParent(categories) {
    for (let i = categories.length - 1; i >= 0; i--) {
      // żeby nie pozwolił wybrac siebie
      if (categories[i].id === this.category.id) {
        this.deletedCategory = categories[i].name;
        categories.splice(i, 1);
      }
      if (categories[i].id === this.category.parentId) {
        this.parentId = this.category.parentId;
      }
    }
    this.categories = categories;
  }

  changeParentCategory(category) {
    this.category.parentId = category.id;
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

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.parent) {
      // console.log('this.parent: ' + this.parent);
      this.category.parentId = this.parent.id;
    } else if (!this.category.parentId) {
      this.category.parentId = 0;
    }
    if (this.category.id !== undefined) {
      this.subscribeToSaveResponse(this.categoryService.update(this.category));
    } else {
      this.subscribeToSaveResponse(this.categoryService.create(this.category));
    }
  }

  saveNew() {
    this.isSaving = true;
    this.category.name = this.newCategory;
    this.category.parentId = this.category.id;
    this.category.id = null;
    this.subscribeToSaveResponse(this.categoryService.create(this.category));
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Category>>) {
    result.subscribe((res: HttpResponse<Category>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: Category) {
    this.eventManager.broadcast({ name: 'categoryListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  //    trackRestaurantById(index: number, item: Restaurant) {
  //        return item.id;
  //    }
}

@Component({
  selector: 'jhi-category-popup',
  template: ''
})
export class CategoryPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private categoryPopupService: CategoryPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.categoryPopupService.open(CategoryDialogComponent as Component, params['id']);
      } else {
        this.categoryPopupService.open(CategoryDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
