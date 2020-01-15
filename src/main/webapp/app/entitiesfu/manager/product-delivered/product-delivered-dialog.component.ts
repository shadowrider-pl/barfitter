import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { ProductDeliveredPopupService } from './product-delivered-popup.service';
import { ProductDeliveredService } from './product-delivered.service';
import { ActiveReadyProductService } from '../../active-entities/active-ready-product.service';
import { ActiveCategoryService } from '../../active-entities/active-category.service';
import { ActiveVatService } from '../../active-entities/active-vat.service';
import { ProductTypeService } from '../../../entities/product-type/product-type.service';
import { RestaurantService } from '../../../entities/restaurant/restaurant.service';
import { Category } from '../../../shared/model/category.model';
import { ProductDelivered } from '../../../shared/model/product-delivered.model';
import { ProductType } from '../../../shared/model/product-type.model';
import { Product } from '../../../shared/model/product.model';
import { Restaurant } from '../../../shared/model/restaurant.model';
import { Vat } from '../../../shared/model/vat.model';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'jhi-product-delivered-dialog',
  templateUrl: './product-delivered-dialog.component.html'
})
export class ProductDeliveredDialogComponent implements OnInit {
  productDelivered: ProductDelivered;
  isSaving: boolean;

  products: Product[];

  categories: Category[];

  vats: Vat[];

  producttypes: ProductType[];

  restaurants: Restaurant[];
  deliveryDateDp: any;
  choosenNotReadyProduct = false;
  productFound = null;
  showProductType = true;
  foundExistingProduct = false;

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private productDeliveredService: ProductDeliveredService,
    private productService: ActiveReadyProductService,
    private categoryService: ActiveCategoryService,
    private vatService: ActiveVatService,
    private productTypeService: ProductTypeService,
    private restaurantService: RestaurantService,
    private translateService: TranslateService,
    private eventManager: JhiEventManager
  ) {}

  updateProductType() {
    if (this.productDelivered.productType !== null && this.productDelivered.productType.id !== 1) {
      this.choosenNotReadyProduct = true;
      // zerowanie na wypadek gdyby ktoś wpisał te dane a potem dopiero wybrał typ produktu
      this.productDelivered.purchPriceNet = 0;
      this.productDelivered.productDeliveredPurchPriceRate = null;
      this.productDelivered.deliveryDate = null;
      this.productDelivered.quantity = null;
    } else {
      this.choosenNotReadyProduct = false;
    }
  }

  checkDescription() {
    this.foundExistingProduct = false;
    for (let i = 0; i < this.products.length; i++) {
      if (this.productDelivered.name === this.products[i].name) {
        this.foundExistingProduct = true;
        break;
      }
    }
  }

  updateProductTypeIfExists() {
    if (this.productDelivered.id !== undefined) {
      this.updateProductType();
    }
  }

  updateDetails() {
    if (this.productDelivered.product != null) {
      this.productFound = this.findProduct(this.productDelivered.product.id);
      this.productDelivered.sellPriceGross = this.productFound.sellPriceGross;
      this.productDelivered.purchPriceNet = this.productFound.purchPriceNet;
      this.productDelivered.category = this.productFound.category;
      this.productDelivered.productDeliveredPurchPriceRate = this.productFound.productPurchPriceRate;
      this.productDelivered.productDeliveredSellPriceRate = this.productFound.productSellPriceRate;
      this.productDelivered.productType = this.productFound.productType;
      this.showProductType = false;
    } else {
      // żeby zerowało wartości gdy najpierw wybierzemy jakiś produkt a potem z niego zrezygnujemy
      this.productDelivered.sellPriceGross = null;
      this.productDelivered.purchPriceNet = null;
      this.productDelivered.category = null;
      this.productDelivered.productDeliveredPurchPriceRate = null;
      this.productDelivered.productDeliveredSellPriceRate = null;
      this.productDelivered.productType = null;
      this.productFound = null;
      this.showProductType = true;
      //      console.log('updateDetails else');
    }
  }

  findProduct(id) {
    let prod = null;
    for (let i = 0; i < this.products.length; i++) {
      if (id === this.products[i].id) {
        prod = this.products[i];
        break;
      }
    }
    return prod;
  }

  translateProducttypes() {
    for (let i = 0; i < this.producttypes.length; i++) {
      switch (this.producttypes[i].id) {
        case 1: {
          this.producttypes[i].description = this.translateService.instant('barfitterApp.productType.ready');
          break;
        }
        case 2: {
          this.producttypes[i].description = this.translateService.instant('barfitterApp.productType.madeInKithen');
          break;
        }
        case 3: {
          this.producttypes[i].description = this.translateService.instant('barfitterApp.productType.madeAtBar');
          break;
        }
      }
    }
  }

  selectToday() {
    //    const now = new Date();
    //    this.productDelivered.deliveryDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    const now = moment();
    this.productDelivered.deliveryDate = now;
  }

  ngOnInit() {
    this.isSaving = false;
    this.productService.query().subscribe(
      (res: HttpResponse<Product[]>) => {
        this.products = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.categoryService.query().subscribe(
      (res: HttpResponse<Category[]>) => {
        this.categories = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.vatService.query().subscribe(
      (res: HttpResponse<Vat[]>) => {
        this.vats = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.productTypeService.query().subscribe(
      (res: HttpResponse<ProductType[]>) => {
        this.producttypes = res.body;
        this.translateProducttypes();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.restaurantService.query().subscribe(
      (res: HttpResponse<Restaurant[]>) => {
        this.restaurants = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.productDelivered.id !== undefined) {
      this.subscribeToSaveResponse(this.productDeliveredService.update(this.productDelivered));
    } else {
      this.subscribeToSaveResponse(this.productDeliveredService.create(this.productDelivered));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<ProductDelivered>>) {
    result.subscribe((res: HttpResponse<ProductDelivered>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: ProductDelivered) {
    this.eventManager.broadcast({ name: 'productDeliveredListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }

  trackCategoryById(index: number, item: Category) {
    return item.id;
  }

  trackVatById(index: number, item: Vat) {
    return item.id;
  }

  trackProductTypeById(index: number, item: ProductType) {
    return item.id;
  }

  trackRestaurantById(index: number, item: Restaurant) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-product-delivered-popup',
  template: ''
})
export class ProductDeliveredPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private productDeliveredPopupService: ProductDeliveredPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.productDeliveredPopupService.open(ProductDeliveredDialogComponent as Component, params['id']);
      } else {
        this.productDeliveredPopupService.open(ProductDeliveredDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
