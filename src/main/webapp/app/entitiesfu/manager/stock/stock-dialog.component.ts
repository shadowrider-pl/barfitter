import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { StockPopupService } from './stock-popup.service';
import { StockService } from './stock.service';
import { ProductTypeService } from '../../../entities/product-type/product-type.service';
import { Category } from '../../../shared/model/category.model';
import { ProductOnStock } from '../../../shared/model/product-on-stock.model';
import { ProductType } from '../../../shared/model/product-type.model';
import { Vat } from '../../../shared/model/vat.model';
import { ActiveCategoryService } from '../../active-entities/active-category.service';
import { ActiveVatService } from '../../active-entities/active-vat.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';

@Component({
  selector: 'jhi-stock-dialog',
  templateUrl: './stock-dialog.component.html'
})
export class StockDialogComponent implements OnInit {
  stock: any;
  isSaving: boolean;

  producttypes: ProductType[];

  categories: Category[];

  vats: Vat[];
  typeId = null;
  account: Account;
  role: string;

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private stockService: StockService,
    private productTypeService: ProductTypeService,
    private categoryService: ActiveCategoryService,
    private activeVatService: ActiveVatService,
    private translateService: TranslateService,
    private eventManager: JhiEventManager,
    private accountService: AccountService
  ) {}

  getAccount() {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      for (let index = 0; index < this.account.authorities.length; index++) {
        if (this.account.authorities[index] === 'ROLE_BOSS') {
          this.role = 'boss';
          break;
        } else if (this.account.authorities[index] === 'ROLE_MANAGER') {
          this.role = 'manager';
        }
      }
    });
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

  ngOnInit() {
    this.isSaving = false;
    this.getAccount();
    this.productTypeService.query().subscribe(
      (res: HttpResponse<ProductType[]>) => {
        this.producttypes = res.body;
        this.translateProducttypes();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.categoryService.query().subscribe(
      (res: HttpResponse<Category[]>) => {
        this.categories = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.activeVatService.query().subscribe(
      (res: HttpResponse<Vat[]>) => {
        this.vats = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.typeId = this.stock.product.productType.id;
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.stock.id !== undefined) {
      this.subscribeToSaveResponse(this.stockService.update(this.stock));
    } else {
      this.subscribeToSaveResponse(this.stockService.create(this.stock));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<ProductOnStock>>) {
    result.subscribe((res: HttpResponse<ProductOnStock>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: ProductOnStock) {
    if (this.typeId === 1) {
      //      console.log("stockKitchenListModification");
      this.eventManager.broadcast({ name: 'stockListModification', content: 'OK' });
    } else if (this.typeId === 2) {
      //      console.log("stockKitchenListModification");
      this.eventManager.broadcast({ name: 'stockKitchenListModification', content: 'OK' });
    } else if (this.typeId === 3) {
      //      console.log("stockKitchenListModification");
      this.eventManager.broadcast({ name: 'stockBarListModification', content: 'OK' });
    }
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackProductTypeById(index: number, item: ProductType) {
    return item.id;
  }

  trackCategoryById(index: number, item: Category) {
    return item.id;
  }

  trackVatById(index: number, item: Vat) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-stock-popup',
  template: ''
})
export class StockPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private stockPopupService: StockPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.stockPopupService.open(StockDialogComponent as Component, params['id']);
      } else {
        this.stockPopupService.open(StockDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
