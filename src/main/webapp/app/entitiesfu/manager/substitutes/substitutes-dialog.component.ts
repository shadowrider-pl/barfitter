import { ProductOnStock } from '../../../shared/model/product-on-stock.model';
import { ProductSold } from '../../../shared/model/product-sold.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { SubstitutesPopupService } from './substitutes-popup.service';
import { SubstitutesService } from './substitutes.service';
import { ProductOnStockDistinctService } from '../../active-entities/product-on-stock-distinct.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'jhi-substitutes-dialog',
  templateUrl: './substitutes-dialog.component.html'
})
export class SubstitutesDialogComponent implements OnInit {
  substitutes: ProductSold;
  isSaving: boolean;
  productChoosen = null;
  productAndHisSubstitute = {};

  products: ProductOnStock[];
  deliveryDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private substitutesService: SubstitutesService,
    private productService: ProductOnStockDistinctService,
    private translateService: TranslateService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.productService.query().subscribe(
      (res: HttpResponse<ProductSold[]>) => {
        this.products = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.substitutes.id !== undefined) {
      this.substitutes.orderedTime = moment(); // zerowanie czasów bo nie przechodzą
      this.substitutes.acceptedTime = null;
      this.substitutes.finishedTime = null;
      this.substitutes.takenTime = null;
      const substituteString = this.translateService.instant('global.menu.entities.substitute');
      this.substitutes.comment = substituteString + ': ' + this.substitutes.comment;
      this.productAndHisSubstitute = { substitute: this.substitutes, productOnStock: this.productChoosen };
      this.subscribeToSaveResponse(this.substitutesService.update(this.productAndHisSubstitute));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<ProductSold>>) {
    result.subscribe((res: HttpResponse<ProductSold>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: ProductSold) {
    this.eventManager.broadcast({ name: 'substitutesListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackProductById(index: number, item: ProductOnStock) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-substitutes-popup',
  template: ''
})
export class SubstitutesPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private substitutesPopupService: SubstitutesPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.substitutesPopupService.open(SubstitutesDialogComponent as Component, params['id']);
      } else {
        this.substitutesPopupService.open(SubstitutesDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
