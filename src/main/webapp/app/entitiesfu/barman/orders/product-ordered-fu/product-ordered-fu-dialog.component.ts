import { ProductOrdered } from '../../../../shared/model/product-ordered.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { ProductOrderedFUService } from '../../../active-entities/product-ordered-fu.service';
import { ProductOrderedPopupService } from './product-ordered-fu-popup.service';

@Component({
  selector: 'jhi-product-ordered-dialog',
  templateUrl: './product-ordered-fu-dialog.component.html'
})
export class ProductOrderedFUDialogComponent implements OnInit {
  productOrdered: any;
  isSaving: boolean;
  deliveryDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private productOrderedService: ProductOrderedFUService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
  }

  clear() {
    this.activeModal.dismiss('cancel');
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
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }
}

@Component({
  selector: 'jhi-product-ordered-popup',
  template: ''
})
export class ProductOrderedFUPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private productOrderedPopupService: ProductOrderedPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.productOrderedPopupService.open(ProductOrderedFUDialogComponent as Component, params['id']);
      } else {
        this.productOrderedPopupService.open(ProductOrderedFUDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
