import { Category } from '../../../shared/model/category.model';
import { ProductsOfCategoryService } from '../../active-entities/products-of-category.service';
import { ProductOfCategoryWithOrderedQuantity } from '../../models/product-of-category-with-ordered-quantity.model';
import { ProductsOfCategoryWithOrderedQuantity } from '../../models/products-of-category-with-ordered-quantity.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { CategoryPopupService } from './category-popup.service';
import { CategoryService } from './category.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-category-delete-dialog',
  templateUrl: './category-delete-dialog.component.html'
})
export class CategoryDeleteDialogComponent implements OnInit {
  productsFoundInCategory: ProductOfCategoryWithOrderedQuantity[];
  spinner: boolean;
  noProductsFound: boolean;

  category: Category;

  constructor(
    private categoryService: CategoryService,
    private productsOfCategoryService: ProductsOfCategoryService,
    public activeModal: NgbActiveModal,
    private eventManager: JhiEventManager
  ) {}

  loadProductsOnCategory(category) {
    this.noProductsFound = true;
    this.spinner = true;
    this.productsOfCategoryService
      .find(category.id)
      .subscribe((productsOfCategory: HttpResponse<ProductsOfCategoryWithOrderedQuantity>) => {
        const productsOfCategoryObj = productsOfCategory.body;
        this.productsFoundInCategory = productsOfCategoryObj.productsOfCategory;
        if (this.productsFoundInCategory.length > 0) {
          for (let i = 0; i < this.productsFoundInCategory.length; i++) {
            this.productsFoundInCategory[i].orderedQuantity = null;
          }
          this.spinner = false;
          this.noProductsFound = false;
        } else {
          this.spinner = false;
        }
      });
  }

  ngOnInit(): void {
    this.loadProductsOnCategory(this.category);
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.categoryService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'categoryListModification',
        content: 'Deleted an category'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-category-delete-popup',
  template: ''
})
export class CategoryDeletePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private categoryPopupService: CategoryPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.categoryPopupService.open(CategoryDeleteDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
