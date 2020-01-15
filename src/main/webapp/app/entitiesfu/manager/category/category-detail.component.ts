import { Category } from '../../../shared/model/category.model';
import { ProductsOfCategoryService } from '../../active-entities/products-of-category.service';
import { ProductOfCategoryWithOrderedQuantity } from '../../models/product-of-category-with-ordered-quantity.model';
import { ProductsOfCategoryWithOrderedQuantity } from '../../models/products-of-category-with-ordered-quantity.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { HttpResponse } from '@angular/common/http';
import { CategoryService } from './category.service';

@Component({
  selector: 'jhi-category-detail',
  templateUrl: './category-detail.component.html'
})
export class CategoryDetailComponent implements OnInit, OnDestroy {
  productsFoundInCategory: ProductOfCategoryWithOrderedQuantity[];
  spinner: boolean;
  noProductsFound: boolean;

  category: Category;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(
    private eventManager: JhiEventManager,
    private categoryService: CategoryService,
    private productsOfCategoryService: ProductsOfCategoryService,
    private route: ActivatedRoute
  ) {}

  loadProductsOnCategory(category) {
    this.noProductsFound = false;
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
        } else {
          this.spinner = false;
          this.noProductsFound = true;
        }
      });
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInCategories();
  }

  load(id) {
    this.categoryService.find(id).subscribe((categoryResponse: HttpResponse<Category>) => {
      this.category = categoryResponse.body;
      this.loadProductsOnCategory(this.category);
    });
  }

  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInCategories() {
    this.eventSubscriber = this.eventManager.subscribe('categoryListModification', response => this.load(this.category.id));
  }
}
