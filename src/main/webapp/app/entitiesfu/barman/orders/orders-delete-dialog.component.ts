import { OrderOpened } from '../../../shared/model/order-opened.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { OrdersPopupService } from './orders-popup.service';
import { ActiveOrdersOpenedService } from '../../active-entities/active-orders-opened.service';

@Component({
  selector: 'jhi-order-opened-delete-dialog',
  templateUrl: './orders-delete-dialog.component.html'
})
export class OrdersDeleteDialogComponent {
  orderOpened: OrderOpened;

  constructor(
    private orderOpenedService: ActiveOrdersOpenedService,
    public activeModal: NgbActiveModal,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.orderOpenedService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'orderOpenedListModification',
        content: 'Deleted an orderOpened'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-order-opened-delete-popup',
  template: ''
})
export class OrdersDeletePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private orderOpenedPopupService: OrdersPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.orderOpenedPopupService.open(OrdersDeleteDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
