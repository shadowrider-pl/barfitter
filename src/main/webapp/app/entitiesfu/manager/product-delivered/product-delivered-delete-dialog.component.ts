import { ProductDelivered } from '../../../shared/model/product-delivered.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { ProductDeliveredPopupService } from './product-delivered-popup.service';
import { ProductDeliveredService } from './product-delivered.service';

@Component({
  selector: 'jhi-product-delivered-delete-dialog',
  templateUrl: './product-delivered-delete-dialog.component.html'
})
export class ProductDeliveredDeleteDialogComponent {
  productDelivered: ProductDelivered;

  constructor(
    private productDeliveredService: ProductDeliveredService,
    public activeModal: NgbActiveModal,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.productDeliveredService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'productDeliveredListModification',
        content: 'Deleted an productDelivered'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-product-delivered-delete-popup',
  template: ''
})
export class ProductDeliveredDeletePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private productDeliveredPopupService: ProductDeliveredPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.productDeliveredPopupService.open(ProductDeliveredDeleteDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
