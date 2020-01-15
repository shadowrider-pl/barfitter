import { User } from 'app/core/user/user.model';
// import { UserService } from '../../../core/user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { FastOrderService } from './fast-order.service';
import { ProductsToCategoryForFastOrderService } from './products-to-category-for-fast-order.service';
import { ActivePaymentService } from '../../active-entities/active-payment.service';
import { ProductService } from '../../../entities/product/product.service';
import { Category } from '../../../shared/model/category.model';
import { Desk } from '../../../shared/model/desk.model';
import { OrderOpened } from '../../../shared/model/order-opened.model';
import { Payment } from '../../../shared/model/payment.model';
import { Product } from '../../../shared/model/product.model';
import { Xsell } from '../../../shared/model/xsell.model';
import { ActiveCategoryService } from '../../active-entities/active-category.service';
// import { ProductsOfCategoryService } from '../../active-entities/products-of-category.service';
import { ProductsOfCategoryWithOrderedQuantity } from '../../models/products-of-category-with-ordered-quantity.model';
// import { OrderWithProductsService } from '../../active-entities/order-with-products.service';
import { MXsellService } from '../../manager/xsell/xsell.service';
import { TranslateService } from '@ngx-translate/core';
import { FavoritesService } from '../../manager/favorites/';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-order-opened-dialog',
  templateUrl: './fast-order-dialog.component.html',
  styleUrls: ['../../../../app/../content/css/scroll-buttons.scss']
})
export class FastOrderDialogComponent implements OnInit {
  showMinusSign: boolean;

  orderOpened: OrderOpened;
  isSaving: boolean;

  activePayments: Payment[];

  desks: Desk[];

  //  users: User[];

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
  substitute = null;
  xsellArray = [];
  allXsells = [];
  joinedPaymentClicked = false;
  choosenPayment: Payment;
  joinedPayments = [];
  rest = 0;
  choosenPayments = [];
  sumCorrected = false;
  noFavoritiesFound = false;
  noProductsFound = false;
  cash = 0;
  cardStyle = 'bg-success';
  activeProduct = null;
  interval = 120;
  showSubcategoryName = false;
  subCategoryName: any;
  scrollInPixels = 200;

  constructor(
    //    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private fastOrderService: FastOrderService,
    private productsToCategoryForFastOrderService: ProductsToCategoryForFastOrderService,
    private activePaymentService: ActivePaymentService,
    //    private deskService: ActiveDeskService,
    //    private userService: UserService,
    private categoryService: ActiveCategoryService,
    //    private productsOfCategoryService: ProductsOfCategoryService,
    //    private orderWithProductsService: OrderWithProductsService,
    private productService: ProductService,
    private xSellService: MXsellService,
    private translateService: TranslateService,
    private eventManager: JhiEventManager,
    private favoritesService: FavoritesService,
    private router: Router
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

  quantityExceded() {
    let excceded = false;
    for (let i = 0; i < this.productsFoundInCategory.length; i++) {
      if (this.productsFoundInCategory[i].orderedQuantity > this.productsFoundInCategory[i].quantity) {
        excceded = true;
        break;
      }
    }
    return excceded;
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
          this.showLabels = true;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  getRest() {
    this.rest = 0;
    this.subtotal = 0;
    this.choosenPayments.length = 0;
    for (let i = 0; i < this.joinedPayments.length; i++) {
      if (this.joinedPayments[i].amount !== 0 && this.joinedPayments[i].amount != null) {
        this.subtotal = this.subtotal + this.joinedPayments[i].amount;
        this.choosenPayments.push(this.joinedPayments[i]);
      }
    }
    if (this.subtotal === this.total) {
      this.sumCorrected = true;
    } else {
      this.sumCorrected = false;
    }
    this.rest = this.total - this.subtotal;
    return this.rest;
  }

  activePaymentsForJoined() {
    //    this.joinedPayments = null;
    for (let i = 0; i < this.activePayments.length; i++) {
      const joinedPayment = { payment: this.activePayments[i], amount: null };
      this.joinedPayments.push(joinedPayment);
    }
  }

  joinedPayment() {
    this.joinedPaymentClicked = !this.joinedPaymentClicked;
  }

  decrement(index) {
    this.productsFoundInCategory[index].orderedQuantity--;
  }
  increment(index) {
    this.productsFoundInCategory[index].orderedQuantity++;
    this.activeProduct = this.productsFoundInCategory[index];
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
  loadXsell() {
    for (let i = 0; i < this.productsOrdered.length; i++) {
      const catId = this.productsOrdered[i].product.category.id;
      //      let toCategoryId = null;
      //      let toCategoryName = null;
      //      let toCategoryObj = null;

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
      //        console.log("this.substitute.id: "+this.substitute.id);
      this.substitute.quantity = this.substitute.orderedQuantity;
      this.substitute.orderPosition = this.orderPosition;
      this.substitute.product = productSubstitute.body;
      this.substitute.orderedTime = now;
      this.productsOrdered.push(this.substitute);
      this.total = this.total + this.substitute.sellPriceGross * this.substitute.orderedQuantity;
      this.showSubstitute = false;
      this.substitute = null;
    });
    this.showMinusSign = false;
  }

  toggleShowSubstitute() {
    this.showSubstitute = !this.showSubstitute;
    const now = moment();
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
    if (this.showSubstitute) {
      this.substitute = {
        id: 0,
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
    this.showMinusSign = false;
    this.noFavoritiesFound = false;
  }

  getSubtotal() {
    this.subtotal = 0;
    if (this.productsFoundInCategory != null) {
      for (let i = 0; i < this.productsFoundInCategory.length; i++) {
        this.subtotal += this.productsFoundInCategory[i].sellPriceGross * this.productsFoundInCategory[i].orderedQuantity;
      }
    }
    return this.subtotal;
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
    this.noProductsFound = false;
    this.showMinusSign = false;
    this.showLabels = false;
    this.spinner = true;
    this.noFavoritiesFound = false;
    this.productsFoundInCategory = null;
    this.productsToCategoryForFastOrderService.find(category.id).subscribe(
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
          this.showMinusSign = true;
          this.noProductsFound = true;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  findSubcategories(parentCategory) {
    this.showSubcategoryName = false;
    if (parentCategory == null) {
      this.prtCat = 0;
      this.showMinusSign = false;
      this.productsFoundInCategory = null;
      this.showLabels = false;
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

  createOrder() {
    this.isSaving = true;
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
    const now = moment();
    if (!this.total) {
      this.total = this.subtotal;
    }
    const fastOrderCommentString = this.translateService.instant('barfitterApp.orderOpened.fastOrder');
    if (this.orderOpened.comment == null) {
      this.orderOpened.comment = fastOrderCommentString;
    } else {
      this.orderOpened.comment = fastOrderCommentString + ': ' + this.orderOpened.comment;
    }

    this.orderWithProducts = {
      total: this.total,
      productsToOrder: this.productsOrdered,
      comment: this.orderOpened.comment,
      desk: this.orderOpened.desk,
      openingTime: now,
      payment: this.choosenPayment
    };

    //    this.subscribeToSaveResponse(
    //      this.orderWithProductsService.create(this.orderWithProducts));

    //      OrderOpened.save(this.orderWithProducts, onSaveSuccess, onSaveError);
  }

  pay(paymentId) {
    this.choosenPayment = { id: paymentId };
  }

  jpay() {
    this.isSaving = true;
    const now = moment();
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
    for (let i = 0; i < this.joinedPayments.length; i++) {
      if (this.choosenPayments[i] !== undefined) {
        if (i !== 0) {
          this.productsOrdered = null;
        }
        this.orderWithProducts = {
          openingTime: now,
          total: this.choosenPayments[i].amount,
          productsToOrder: this.productsOrdered,
          comment:
            this.choosenPayments[i].payment.description + ' -> #' + this.translateService.instant('barfitterApp.orderOpened.fastOrder'),
          payment: { id: this.choosenPayments[i].payment.id }
        };
        this.subscribeToSaveResponse(this.fastOrderService.create(this.orderWithProducts));
      }
    }
  }

  ngOnInit() {
    this.isSaving = false;
    this.orderOpened = {
      total: this.total,
      comment: null,
      desk: null,
      openingTime: null
    };
    this.activePaymentService.query().subscribe(
      (res: HttpResponse<Payment[]>) => {
        this.activePayments = res.body;
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
    this.xSellService.query().subscribe(
      (res: HttpResponse<Xsell[]>) => {
        this.allXsells = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    window.addEventListener('scroll', this.showScrollButtons, true);
  }

  save() {
    this.createOrder();
    this.isSaving = true;
    this.subscribeToSaveResponse(this.fastOrderService.create(this.orderWithProducts));
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

@Component({
  selector: 'jhi-order-opened-popup',
  template: ''
})
export class FastOrderPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    //    this.routeSub = this.route.params.subscribe((params) => {
    //      if (params['id']) {
    //        this.orderOpenedPopupService
    //          .open(FastOrderDialogComponent as Component, params['id']);
    //      } else {
    //        this.orderOpenedPopupService
    //          .open(FastOrderDialogComponent as Component);
    //      }
    //    });
  }

  ngOnDestroy() {
    //    this.routeSub.unsubscribe();
  }
}
