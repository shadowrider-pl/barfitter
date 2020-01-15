import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import * as moment from 'moment';

import { NewOrderService } from './new-order.service';
import { ActivePaymentService } from '../../active-entities/active-payment.service';
import { ProductService } from '../../../entities/product/product.service';
import { ActiveDeskService } from '../../active-entities/active-desk.service';
import { Category } from '../../../shared/model/category.model';
import { Desk } from '../../../shared/model/desk.model';
import { OrderOpened } from '../../../shared/model/order-opened.model';
import { Payment } from '../../../shared/model/payment.model';
import { Product } from '../../../shared/model/product.model';
import { Xsell } from '../../../shared/model/xsell.model';
import { ActiveCategoryService } from '../../active-entities/active-category.service';
import { ProductsOfCategoryService } from '../../active-entities/products-of-category.service';
import { ProductsOfCategoryWithOrderedQuantity } from '../../models/products-of-category-with-ordered-quantity.model';
import { OrderWithProductsService } from '../../active-entities/order-with-products.service';
import { MXsellService } from '../../manager/xsell/xsell.service';
import { FavoritesService } from '../../manager/favorites/';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['../../../../app/../content/css/scroll-buttons.scss']
})
export class NewOrderComponent implements OnInit {
  orderOpened: OrderOpened = new OrderOpened();
  isSaving: boolean;

  payments: Payment[];

  desks: Desk[];

  users: User[];

  categories: Category[];

  productsOfCategoryObj: ProductsOfCategoryWithOrderedQuantity;

  prtDsk = null;
  prtDskDescr = null;
  subDesks = [];
  showChooseDeskButtonX = false;
  choosenDeskDescription = null;
  productsOrdered = [];
  total = 0;
  subtotal = 0;
  orderWithProducts = null;
  showLabels = false;
  subcategories = [];
  previousSubcategories = [];
  prtCat = null;
  spinner = false;
  productsFoundInCategory = [];
  pid = 0;
  orderPosition = 0;
  showSaveAndSendToKitchen = false;
  showSubstitute = false;
  substitute: any;
  xsellArray = [];
  allXsells = [];
  noFavoritiesFound = false;
  noProductsFound = false;
  private subscription: Subscription;
  deskId: number = null;
  cardStyle = 'bg-success';
  interval = 120;
  activeProduct = null;
  scrollInPixels = 200;
  subCategoryName: string;
  showSubcategoryName = false;

  constructor(
    //    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private orderOpenedService: NewOrderService,
    private paymentService: ActivePaymentService,
    private deskService: ActiveDeskService,
    private userService: UserService,
    private categoryService: ActiveCategoryService,
    private productsOfCategoryService: ProductsOfCategoryService,
    private orderWithProductsService: OrderWithProductsService,
    private productService: ProductService,
    private xSellService: MXsellService,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,
    private router: Router,
    //        private restaurantService: RestaurantService,
    private eventManager: JhiEventManager
  ) {}

  showScrollButtons() {
    if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && document.getElementById('upButton') !== null) {
      document.getElementById('upButton').style.display = 'block';
    } else {
      document.getElementById('upButton').style.display = 'none';
    }

    if (
      (document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > document.documentElement.scrollHeight - window.innerHeight * 1.05) &&
      document.getElementById('downButton') !== null
    ) {
      document.getElementById('downButton').style.display = 'none';
    } else {
      document.getElementById('downButton').style.display = 'block';
    }
    return null;
  }

  scrollDown() {
    window.scrollBy({
      top: this.scrollInPixels,
      left: 0,
      behavior: 'smooth'
    });
  }

  scrollUp() {
    window.scrollBy({
      top: -1 * this.scrollInPixels,
      left: 0,
      behavior: 'smooth'
    });
  }

  loadFavoriteProducts() {
    this.favoritesService.findForBarman().subscribe(
      (productOrderedResponse: HttpResponse<ProductsOfCategoryWithOrderedQuantity>) => {
        const productsOfCategoryObj = productOrderedResponse.body;
        if (productsOfCategoryObj != null && productsOfCategoryObj.productsOfCategory != null) {
          this.productsFoundInCategory = productsOfCategoryObj.productsOfCategory;
          if (this.productsFoundInCategory.length > 0) {
            for (let i = 0; i < this.productsFoundInCategory.length; i++) {
              this.productsFoundInCategory[i].orderedQuantity = null;
            }
            this.showLabels = true;
            this.spinner = false;
          } else {
            this.showLabels = false;
            this.spinner = false;
          }
        } else {
          this.noFavoritiesFound = true;
          this.productsFoundInCategory = null;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  //  resetDesk() {
  //    this.findSubDesks(null);
  //    this.showChooseDeskButtonX = false;
  //  }

  loadXsell() {
    for (let i = 0; i < this.productsOrdered.length; i++) {
      const catId = this.productsOrdered[i].product.category.id;
      //      const toCategoryId = null;
      //      const toCategoryName = null;
      //      const toCategoryObj = null;

      // foundInXsell - znaleziony Xsell
      const foundInXsell = this.allXsells.filter(function(cat) {
        return cat.fromCategory.id === catId;
      })[0];

      if (foundInXsell != null) {
        // znajdź całą kategorię
        const toCategory = this.categories.filter(function(catObj) {
          return catObj.id === foundInXsell.toCategory.id;
        })[0];

        if (this.xsellArray.length === 0) {
          this.xsellArray.push(toCategory);
        } else {
          const checkIfAlreadyAdded = this.xsellArray.filter(function(checkCat) {
            return checkCat.id === toCategory.id;
          })[0];

          if (checkIfAlreadyAdded == null) {
            this.xsellArray.push(toCategory);
          }
        }
      }
    }
  }

  addSubstitute() {
    const now = moment();
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
    this.productService.find(1).subscribe((productSubstitute: HttpResponse<Product>) => {
      const nextId = this.productsOrdered.length + 1;
      this.orderPosition++;
      this.substitute.id = nextId;
      this.substitute.quantity = this.substitute.orderedQuantity;
      this.substitute.orderPosition = this.orderPosition;
      this.substitute.product = productSubstitute.body;
      this.substitute.orderedTime = now;
      this.productsOrdered.push(this.substitute);
      this.total = this.total + this.substitute.sellPriceGross * this.substitute.orderedQuantity;
      this.showSubstitute = false;
      this.substitute = null;
    });
  }

  toggleShowSubstitute() {
    const now = moment();
    this.showSubstitute = !this.showSubstitute;
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
    if (this.showSubstitute) {
      this.substitute = {
        id: 0,
        order: { id: '1' },
        product: {
          id: '1',
          category: { id: '1' },
          name: 'prod. zast.',
          productType: { id: '3' }
        },
        orderedTime: now,
        sellPriceGross: 0,
        quantity: '0',
        orderPosition: 0
      };
    } else {
      this.substitute = null;
    }
  }

  deleteProduct(id) {
    this.total = this.total - this.productsOrdered[id].sellPriceGross;
    this.productsOrdered.splice(id, 1);
  }

  addProduct() {
    const now = moment();
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
    for (let i = 0; i < this.productsFoundInCategory.length; i++) {
      if (this.productsFoundInCategory[i].orderedQuantity > 0) {
        const nextId = this.productsOrdered.length + 1;
        this.orderPosition++;
        let productOrdered = {
          id: nextId,
          order: { id: '1' },
          product: {
            id: '1',
            category: { id: '1' },
            name: '',
            productType: 0
          },
          orderedTime: now,
          sellPriceGross: 0,
          quantity: '0',
          orderPosition: 0
        };
        productOrdered.quantity = this.productsFoundInCategory[i].orderedQuantity;
        productOrdered.sellPriceGross = this.productsFoundInCategory[i].sellPriceGross;
        productOrdered.product.id = this.productsFoundInCategory[i].product.id;
        productOrdered.product.name = this.productsFoundInCategory[i].product.name;
        productOrdered.product.category.id = this.productsFoundInCategory[i].product.category.id;
        productOrdered.product.productType = this.productsFoundInCategory[i].product.productType;
        productOrdered.orderPosition = this.orderPosition;
        this.productsOrdered.push(productOrdered);
        this.total = this.total + productOrdered.sellPriceGross * this.productsFoundInCategory[i].orderedQuantity;
        if (this.productsFoundInCategory[i].product.productType.id === 2) {
          this.showSaveAndSendToKitchen = true;
        }
        this.loadXsell();
        productOrdered = null;
      }
    }
  }

  getSubtotal() {
    this.subtotal = 0;
    if (this.productsFoundInCategory != null) {
      for (let i = 0; i < this.productsFoundInCategory.length; i++) {
        this.subtotal += this.productsFoundInCategory[i].sellPriceGross * this.productsFoundInCategory[i].orderedQuantity;
      }
      return this.subtotal;
    }
  }

  back() {
    for (let i = 0, len = this.categories.length; i < len; i++) {
      if (this.categories[i].id === this.prtCat) {
        this.pid = this.categories[i].parentId;
        break;
      }
    }
    return this.pid;
  }

  loadProductsOnCategory(category) {
    this.noFavoritiesFound = false;
    this.noProductsFound = false;
    this.showLabels = false;
    this.spinner = true;
    this.productsOfCategoryService.find(category.id).subscribe(
      (productsOfCategory: HttpResponse<ProductsOfCategoryWithOrderedQuantity>) => {
        const productsOfCategoryObj = productsOfCategory.body;
        this.productsFoundInCategory = productsOfCategoryObj.productsOfCategory;
        if (this.productsFoundInCategory.length > 0) {
          for (let i = 0; i < this.productsFoundInCategory.length; i++) {
            this.productsFoundInCategory[i].orderedQuantity = null;
          }
          this.showLabels = true;
          this.spinner = false;
        } else {
          this.showLabels = false;
          this.spinner = false;
          this.noProductsFound = true;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  findSubcategories(parentCategory) {
    this.showSubcategoryName = false;
    if (parentCategory == null || parentCategory.id === 0) {
      this.prtCat = 0;
    } else {
      this.prtCat = parentCategory.id;
    }
    this.previousSubcategories = this.subcategories;
    this.subcategories = [];
    const tempSubcategories = [];
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].parentId === this.prtCat) {
        tempSubcategories.push(this.categories[i]);
      }
    }

    if (tempSubcategories.length > 0) {
      this.subcategories = tempSubcategories;
    } else {
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].id === this.prtCat) {
          this.subCategoryName = this.categories[i].name;
          break;
        }
      }
      this.subcategories = null;
      this.showSubcategoryName = true;
    }
  }

  //  findSubDesks(parentDesk) {
  //    if (parentDesk == null || parentDesk.id === 0) {
  //      this.prtDsk = 0;
  //    } else {
  //      this.prtDsk = parentDesk.id;
  //      this.prtDskDescr = parentDesk.description;
  //    }
  //    const previossubDesks = this.subDesks;
  //    this.subDesks = [];
  //    const tempsubDesks = [];
  //    for (let i = 0; i < this.desks.length; i++) {
  //      if (this.desks[i].parentId === this.prtDsk) {
  //        tempsubDesks.push(this.desks[i]);
  //      }
  //
  //    }
  //
  //    if (tempsubDesks.length > 0) {
  //      this.subDesks = tempsubDesks;
  //    } else {
  //      this.subDesks = previossubDesks;
  //    }
  //  }

  //  showChooseDeskButton(deskParentId) {
  //    this.showChooseDeskButtonX = true;
  //  }
  //
  //  chooseDesk(id) {
  //    for (let i = 0; this.desks.length; i++) {
  //      if (this.desks[i].id === id) {
  //        this.orderOpened.desk = this.desks[i];
  //        this.choosenDeskDescription = this.desks[i].description;
  //        break;
  //      }
  //    }
  //  }

  findDesk() {
    for (let i = 0; i < this.desks.length; i++) {
      if (this.desks[i].id === this.deskId * 1) {
        this.orderOpened = {
          total: this.total,
          comment: null,
          desk: this.desks[i],
          openingTime: null
        };
        break;
      }
    }
  }

  createOrder(sendToKitchen) {
    this.isSaving = true;
    if (!this.total) {
      this.total = this.subtotal;
    }

    const now = moment();
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();

    if (sendToKitchen === '1') {
      for (let i = 0; i < this.productsOrdered.length; i++) {
        if (this.productsOrdered[i].product.productType.id === 2) {
          this.productsOrdered[i].orderedProductStatus = { id: 2 };
          this.productsOrdered[i].sendTime = now;
        }
      }
    }

    this.orderWithProducts = {
      total: this.total,
      productsToOrder: this.productsOrdered,
      comment: this.orderOpened.comment,
      desk: this.orderOpened.desk,
      openingTime: now
    };
    this.subscribeToSaveResponse(this.orderWithProductsService.create(this.orderWithProducts));
  }

  decrement(index) {
    this.productsFoundInCategory[index].orderedQuantity--;
    if (this.activeProduct.product.productType.id === '2' && this.productsFoundInCategory[index].orderedQuantity === '0') {
      this.showSaveAndSendToKitchen = false;
    }
  }
  increment(index) {
    this.productsFoundInCategory[index].orderedQuantity++;
    this.activeProduct = this.productsFoundInCategory[index];
    if (this.activeProduct.product.productType.id === 2) {
      this.showSaveAndSendToKitchen = true;
    }
    this.cardStyle = 'bg-danger';
    setTimeout(() => {
      this.changeColor1();
    }, this.interval);
  }

  changeColor1() {
    this.cardStyle = 'bg-success';
    setTimeout(() => {
      this.changeColor2();
    }, this.interval);
  }

  changeColor2() {
    this.cardStyle = 'bg-danger';
    setTimeout(() => {
      this.cardStyle = 'bg-success';
    }, this.interval);
  }

  ngOnInit() {
    window.addEventListener('scroll', this.showScrollButtons, true);
    this.isSaving = false;
    this.subscription = this.route.params.subscribe(params => {
      this.deskId = params['id'];
    });
    this.paymentService.query().subscribe(
      (res: HttpResponse<Payment[]>) => {
        this.payments = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.categoryService.query().subscribe(
      (res: HttpResponse<Category[]>) => {
        this.categories = res.body;
        this.findSubcategories(null);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.deskService.query().subscribe(
      (res: HttpResponse<Desk[]>) => {
        this.desks = res.body;
        this.findDesk();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.xSellService.query().subscribe(
      (res: HttpResponse<Xsell[]>) => {
        this.allXsells = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  save() {
    this.isSaving = true;
    if (this.orderOpened.id !== undefined) {
      this.subscribeToSaveResponse(this.orderOpenedService.update(this.orderOpened));
    } else {
      this.subscribeToSaveResponse(this.orderOpenedService.create(this.orderOpened));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<OrderOpened>>) {
    result.subscribe((res: HttpResponse<OrderOpened>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: OrderOpened) {
    this.eventManager.broadcast({ name: 'orderOpenedListModification', content: 'OK' });
    this.isSaving = false;
    window.removeEventListener('scroll', this.showScrollButtons, true);
    this.router.navigate(['../barman-panel']);
    //    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackPaymentById(index: number, item: Payment) {
    return item.id;
  }

  trackDeskById(index: number, item: Desk) {
    return item.id;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }

  //    trackRestaurantById(index: number, item: Restaurant) {
  //        return item.id;
  //    }
}

// @Component({
//  selector: 'jhi-order-opened-popup',
//  template: ''
// })
// export class OrderOpenedPopupComponent implements OnInit, OnDestroy {
//
//  routeSub: any;
//
//  constructor(
//    private route: ActivatedRoute,
//    private orderOpenedPopupService: NewOrderPopupService
//  ) {}
//
//  ngOnInit() {
//    this.routeSub = this.route.params.subscribe((params) => {
//      if (params['id']) {
//        this.orderOpenedPopupService
//          .open(NewOrderComponent as Component, params['id']);
//      } else {
//        this.orderOpenedPopupService
//          .open(NewOrderComponent as Component);
//      }
//    });
//  }
//
//  ngOnDestroy() {
//    this.routeSub.unsubscribe();
//  }
// }
