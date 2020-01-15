import { ProductOrdered } from '../../../../shared/model/product-ordered.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ProductOrderedPopupService } from './product-ordered-fu-popup.service';
import { ProductOrderedFUService } from '../../../active-entities/product-ordered-fu.service';

@Component({
  selector: 'jhi-product-ordered-delete-dialog',
  templateUrl: './product-ordered-fu-delete-dialog.component.html'
})
export class ProductOrderedFUDeleteDialogComponent {
  productOrdered: ProductOrdered;

  constructor(
    private productOrderedService: ProductOrderedFUService,
    public activeModal: NgbActiveModal,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.productOrderedService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'productOrderedListModification',
        content: 'Deleted an productOrdered'
      });
      this.eventManager.broadcast({
        name: 'orderOpenedListModification',
        content: 'Deleted an productOrdered'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-product-ordered-delete-popup',
  template: ''
})
export class ProductOrderedFUDeletePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private productOrderedPopupService: ProductOrderedPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.productOrderedPopupService.open(ProductOrderedFUDeleteDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
