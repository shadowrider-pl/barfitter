import { ProductService } from '../../../../entities/product/product.service';
import { Category } from '../../../../shared/model/category.model';
import { Desk } from '../../../../shared/model/desk.model';
import { Favorite } from '../../../../shared/model/favorite.model';
import { OrderOpened } from '../../../../shared/model/order-opened.model';
import { ProductOrdered } from '../../../../shared/model/product-ordered.model';
import { Product } from '../../../../shared/model/product.model';
import { Xsell } from '../../../../shared/model/xsell.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { ProductOrderedFUService } from '../../../active-entities/product-ordered-fu.service';
import { ProductsOfCategoryService } from '../../../active-entities/products-of-category.service';
import { ProductsOfCategoryWithOrderedQuantity } from '../../../models/products-of-category-with-ordered-quantity.model';
import { OrderWithProductsService } from '../../../active-entities/order-with-products.service';
import { MXsellService } from '../../../manager/xsell/xsell.service';
import { ActiveCategoryService } from '../../../active-entities/active-category.service';
import { FavoritesService } from '../../../manager/favorites/';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'jhi-add-product',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['../../../../../app/../content/css/scroll-buttons.scss']
})
export class AddProductComponent implements OnInit {
  noProductsFound: boolean;
  deskId: number = null;
  desks: Desk[];

  orderOpened: any;
  private subscription: Subscription;
  productOrdered: ProductOrdered;
  isSaving: boolean;

  categories: Category[];

  productsOfCategoryObj: ProductsOfCategoryWithOrderedQuantity;
  id = null;
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
  favorites: Favorite[];
  noFavoritiesFound = false;
  orderId = null;
  scrollInPixels = 200;
  activeProduct = null;
  cardStyle = 'bg-success';
  interval = 120;
  showSubcategoryName = false;
  subCategoryName: any;

  constructor(
    private jhiAlertService: JhiAlertService,
    private productOrderedService: ProductOrderedFUService,
    private eventManager: JhiEventManager,
    private categoryService: ActiveCategoryService,
    private productsOfCategoryService: ProductsOfCategoryService,
    private orderWithProductsService: OrderWithProductsService,
    private productService: ProductService,
    private xSellService: MXsellService,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  showScrollButtons() {
    if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && document.getElementById('upButton') !== null) {
      document.getElementById('upButton').style.display = 'block';
    } else {
      document.getElementById('upButton').style.display = 'none';
    }

    if (
      (document.body.scrollTop > document.body.scrollHeight - window.innerHeight * 1.05 ||
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

  updateOrder(sendToKitchen) {
    //    console.log("sendToKitchen="+sendToKitchen);
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
    const now = moment();
    this.isSaving = true;
    if (!this.total) {
      this.total = this.subtotal;
    }

    if (sendToKitchen === 'send') {
      //      console.log("send");
      for (let i = 0; i < this.productsOrdered.length; i++) {
        //      console.log("this.productsOrdered[i].product.orderedProductStatus="+this.productsOrdered[i].product.orderedProductStatus);
        //      console.log("this.productsOrdered[i].product.productType.id="+this.productsOrdered[i].product.productType.id);
        if (this.productsOrdered[i].product.orderedProductStatus === undefined && this.productsOrdered[i].product.productType.id === 2) {
          this.productsOrdered[i].orderedProductStatus = { id: 2 };
          this.productsOrdered[i].sendTime = now;
          //                  console.log("wyślij na kuchnię "+JSON.stringify(this.productsOrdered));
        }
      }
    }

    this.orderWithProducts = {
      id: this.orderOpened.id,
      total: this.orderOpened.total + this.total,
      productsToOrder: this.productsOrdered,
      openingTime: now
    };
    this.subscribeToSaveResponse(this.orderWithProductsService.update(this.orderWithProducts));
  }

  loadXsell() {
    for (let i = 0; i < this.productsOrdered.length; i++) {
      let catId = null;
      if (this.productsOrdered[i].product.category != null) {
        catId = this.productsOrdered[i].product.category.id;
      }
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
  }

  toggleShowSubstitute() {
    const now = moment();
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
    this.showSubstitute = !this.showSubstitute;
    if (this.showSubstitute) {
      this.substitute = {
        id: 0,
        order: { id: this.orderOpened.id },
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
    //    const nowDate = new Date();
    //    const now = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();
    const now = moment();
    for (let i = 0; i < this.productsFoundInCategory.length; i++) {
      if (this.productsFoundInCategory[i].orderedQuantity > 0) {
        const nextId = this.productsOrdered.length + 1;
        this.orderPosition++;
        let productOrdered = {
          id: nextId,
          order: { id: this.orderOpened.id },
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
        //        productOrdered.orderedTime = now;
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
    this.showLabels = false;
    this.spinner = true;
    this.productsOfCategoryService.find(category.id).subscribe(
      (productOrderedResponse: HttpResponse<ProductsOfCategoryWithOrderedQuantity>) => {
        const productsOfCategoryObj = productOrderedResponse.body;
        this.productsFoundInCategory = productsOfCategoryObj.productsOfCategory;
        if (this.productsFoundInCategory.length > 0) {
          for (let i = 0; i < this.productsFoundInCategory.length; i++) {
            this.productsFoundInCategory[i].orderedQuantity = null;
          }
          this.showLabels = true;
          this.spinner = false;
        } else {
          this.noProductsFound = true;
          this.showLabels = false;
          this.spinner = false;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  findSubcategories(parentCategory) {
    this.showSubcategoryName = false;
    if (parentCategory == null) {
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

  loadFavoriteProducts() {
    this.favoritesService.findForBarman().subscribe(
      (productOrderedResponse: HttpResponse<ProductsOfCategoryWithOrderedQuantity>) => {
        //        console.log('this.favoritesService.findForBarman()');
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

  loadOrder(id) {
    this.orderWithProductsService.find(id).subscribe((orderOpenedResponse: HttpResponse<OrderOpened>) => {
      this.orderOpened = orderOpenedResponse.body;
    });
  }

  ngOnInit() {
    //    console.log("this.orderOpened.id: " + this.orderOpened.id);
    this.isSaving = false;
    this.subscription = this.route.params.subscribe(params => {
      this.loadOrder(params['id']);
      this.orderId = params['id'];
    });
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
    this.isSaving = true;
    if (this.productOrdered.id !== undefined) {
      this.subscribeToSaveResponse(this.productOrderedService.update(this.productOrdered));
    } else {
      this.subscribeToSaveResponse(this.productOrderedService.create(this.productOrdered));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<ProductOrdered>>) {
    result.subscribe((res: HttpResponse<ProductOrdered>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: ProductOrdered) {
    this.eventManager.broadcast({ name: 'productOrderedListModification', content: 'OK' });
    this.eventManager.broadcast({ name: 'orderOpenedListModification', content: 'OK' });
    this.isSaving = false;
    window.removeEventListener('scroll', this.showScrollButtons, true);
    this.router.navigate(['../orders-in-room', this.orderOpened.desk.id]);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  previousState() {
    window.history.back();
  }
}

// @Component({
//  selector: 'jhi-add-product',
//  template: ''
// })
// export class AddProductComponent implements OnInit, OnDestroy {
//  deskId: any;
//
//  routeSub: any;
//  private subscription: Subscription;
//
//  constructor(
//    private route: ActivatedRoute,
//    private productOrderedPopupService: AddProductPopupService
//  ) {}
//
//  ngOnInit() {
//    this.subscription = this.route.params.subscribe((params) => {
//      this.deskId = params['id'];
//      this.deskId = this.deskId * 1;
//    });
//  }
//
//  ngOnDestroy() {
//    this.routeSub.unsubscribe();
//  }
// }
