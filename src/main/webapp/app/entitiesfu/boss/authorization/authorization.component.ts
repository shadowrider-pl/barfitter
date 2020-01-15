import { AccountService } from 'app/core/auth/account.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthorizationService } from './authorization.service';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ProductDelivered } from '../../../shared/model/product-delivered.model';
import { ProductsDelivered } from '../../models/products-delivered.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-product-delivered',
  templateUrl: './authorization.component.html'
})
export class ProductDeliveredComponent implements OnInit, OnDestroy {
  currentAccount: any;
  productDelivereds: ProductDelivered[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  routeData: any;
  links: any;
  totalItems: any;
  queryCount: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;
  isSaving: boolean;

  productDeliveredWithSelect = {};
  productsDeliveredWithSelect = [];

  constructor(
    private authorizationService: AuthorizationService,
    private parseLinks: JhiParseLinks,
    private jhiAlertService: JhiAlertService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private eventManager: JhiEventManager
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  translateProducttypes(productDeliveredWithSelect) {
    switch (productDeliveredWithSelect.productType.id) {
      case 1: {
        productDeliveredWithSelect.productType.description = this.translateService.instant('barfitterApp.productType.ready');
        break;
      }
      case 2: {
        productDeliveredWithSelect.productType.description = this.translateService.instant('barfitterApp.productType.madeInKithen');
        break;
      }
      case 3: {
        productDeliveredWithSelect.productType.description = this.translateService.instant('barfitterApp.productType.madeAtBar');
        break;
      }
    }
    return productDeliveredWithSelect;
  }

  addSelectedField() {
    const pdws = [];
    for (let i = 0; i < this.productDelivereds.length; i++) {
      const selectedObject = { selected: false };
      const productDeliveredWithSelect = Object.assign(this.productDelivereds[i], selectedObject);
      const productDeliveredWithSelectAndTranslatedProductType = this.translateProducttypes(productDeliveredWithSelect);
      pdws.push(productDeliveredWithSelectAndTranslatedProductType);
    }
    this.productsDeliveredWithSelect = pdws;
  }

  authorizeProduct(product) {
    this.isSaving = true;
    if (product.id !== undefined) {
      this.authorizationService.find(product.id).subscribe((productDeliveredResponse: HttpResponse<ProductDelivered>) => {
        const productDelivered: ProductDelivered = productDeliveredResponse.body;
        //          if (productDelivered.deliveryDate) {
        //            productDelivered.deliveryDate = {
        //              year: productDelivered.deliveryDate.getFullYear(),
        //              month: productDelivered.deliveryDate.getMonth() + 1,
        //              day: productDelivered.deliveryDate.getDate()
        //            };
        //          }
        //          console.log("productDelivered"+JSON.stringify(productDelivered))
        this.authorizationService.update(productDelivered).subscribe(response => {
          this.eventManager.broadcast({
            name: 'productDeliveredListModification',
            content: 'Deleted an productDelivered'
          });
        });
      });
    }
  }

  authorizeProductList() {
    this.isSaving = true;
    const productsForAuthorization: ProductsDelivered = { productsDelivered: [] };
    this.authorizationService.query().subscribe(
      (res: HttpResponse<ProductDelivered[]>) => {
        const allProducts = res.body;
        for (let i = 0; i < this.productsDeliveredWithSelect.length; i++) {
          if (this.productsDeliveredWithSelect[i].selected === true) {
            //            if (allProducts[i].deliveryDate) {
            //              allProducts[i].deliveryDate = {
            //                year: allProducts[i].deliveryDate.getFullYear(),
            //                month: allProducts[i].deliveryDate.getMonth() + 1,
            //                day: allProducts[i].deliveryDate.getDate()
            //              };
            //            }
            productsForAuthorization.productsDelivered.push(allProducts[i]);
          }
        }
        this.authorizationService.updateList(productsForAuthorization).subscribe(response => {
          this.eventManager.broadcast({
            name: 'productDeliveredListModification',
            content: 'Deleted an productDelivered'
          });
          this.isSaving = false;
        });
      },
      (res: HttpErrorResponse) => {
        this.onError(res.message);
        this.isSaving = false;
      }
    );

    //    for (let i = 0; i < this.productsDeliveredWithSelect.length; i++) {
    //      console.log('let i = ' + i);
    //      //      console.log(' this.productsDeliveredWithSelect[i] : ' + i + JSON.stringify(this.productsDeliveredWithSelect[i]));
    //      if (this.productsDeliveredWithSelect[i].selected == true) {
    //        console.log("selected == true");
    //        this.authorizationService.find(this.productsDeliveredWithSelect[i].id)
    //          .subscribe((productDeliveredResponse: HttpResponse<ProductDelivered>) => {
    //            const productDelivered: ProductDelivered = productDeliveredResponse.body;
    //            if (productDelivered.deliveryDate) {
    //              productDelivered.deliveryDate = {
    //                year: productDelivered.deliveryDate.getFullYear(),
    //                month: productDelivered.deliveryDate.getMonth() + 1,
    //                day: productDelivered.deliveryDate.getDate()
    //              };
    //            }
    //            console.log("productDelivered push");
    //            productsForAuthorization.productsDelivered.push(productDelivered);
    //            console.log("productsForAuthorization.productsDelivered.length" + productsForAuthorization.productsDelivered.length);
    //          });
    //      }
    //    }
    //    console.log("*** productsForAuthorization.productsDelivered.length" + productsForAuthorization.productsDelivered.length);
  }

  //  authorizeSelectedItems(id) {
  //    console.log('id: ' + id);
  //    if (typeof id === 'undefined') {
  //      //      console.log('undefined');
  //      const authorizeIndex = [];
  //      for (let i = 0; i < this.productsDeliveredWithSelect.length; i++) {
  //
  //        //        console.log('let i = ' + i);
  //        //      console.log('this.productsDeliveredWithSelect[i] : '+ i + JSON.stringify(this.productsDeliveredWithSelect[i]));
  //        if (this.productsDeliveredWithSelect[i].selected) {
  //          //          console.log('this.productsDeliveredWithSelect[i].selected: ' + i +
  //          //            ' ' + this.productsDeliveredWithSelect[i].selected + ' id: '
  //          //            + this.productsDeliveredWithSelect[i].id);
  //          authorizeIndex.push(i);
  //          this.authorizationService.find(this.productsDeliveredWithSelect[i].id).subscribe((productDelivered) => {
  //            this.productsDeliveredWithSelect[i] = productDelivered;
  //            this.eventManager.broadcast({
  //              name: 'productDeliveredListModification',
  //              content: 'Authorized an productDelivered'
  //            });
  //          });
  //        }
  //      }
  //
  //    } else {
  //      for (let i = this.productsDeliveredWithSelect.length; i--;) {
  //        if (this.productsDeliveredWithSelect[i].id === id) {
  //          this.authorizationService.find(id).subscribe((productDelivered) => {
  //            this.productsDeliveredWithSelect[i] = productDelivered;
  //            this.loadAll();
  //          });
  //          break;
  //        }
  //      }
  //    }
  //  }

  allNeedsClicked() {
    const newValue = !this.allNeedsMet();
    this.productsDeliveredWithSelect.forEach(function(productDelivered) {
      productDelivered.selected = newValue;
    });
  }

  // Returns true if and only if all todos are done.
  allNeedsMet() {
    const needsMet = this.productsDeliveredWithSelect.reduce(function(memo, productDelivered) {
      return memo + (productDelivered.selected ? 1 : 0);
    }, 0);
    return needsMet === this.productsDeliveredWithSelect.length;
  }

  deleteSelectedItems() {
    // pressed button in the bottom
    for (let i = this.productsDeliveredWithSelect.length; i--; ) {
      if (this.productsDeliveredWithSelect[i].selected) {
        this.authorizationService.delete(this.productsDeliveredWithSelect[i].id).subscribe(response => {
          this.eventManager.broadcast({
            name: 'productDeliveredListModification',
            content: 'Deleted an productDelivered'
          });
        });
      }
    }
    this.loadAll();
  }

  loadAll() {
    this.authorizationService.query().subscribe(
      (res: HttpResponse<ProductDelivered[]>) => {
        this.onSuccess(res.body, res.headers);
        this.addSelectedField();
        this.isSaving = false;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }
  transition() {
    this.router.navigate(['/authorization'], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        search: this.currentSearch,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
      }
    });
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInProductDelivereds();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ProductDelivered) {
    let itemId;
    if (item != null) {
      itemId = item.id;
    }
    return itemId;
  }
  registerChangeInProductDelivereds() {
    this.eventSubscriber = this.eventManager.subscribe('productDeliveredListModification', response => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  private onSuccess(data, headers) {
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = headers.get('X-Total-Count');
    this.queryCount = this.totalItems;
    // this.page = pagingParams.page;
    this.productDelivereds = data;
  }
  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
