import { ProductSold } from '../../../shared/model/product-sold.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { StockPopupService } from './stock-popup.service';
import { StockService } from './stock.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-stock-delete-out-of-stock-dialog',
  templateUrl: './stock-delete-out-of-stock-dialog.component.html'
})
export class StockDeleteOutOfStockDialogComponent implements OnInit {
  stock: any;
  productName = null;
  productInHistory = true;
  preventDelete = true;
  productSold: ProductSold;

  constructor(private stockService: StockService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

  findProductSold() {
    this.stockService.findProductSold(this.stock.id).subscribe((productSoldResponse: HttpResponse<ProductSold>) => {
      this.productSold = productSoldResponse.body;
      if (this.productSold != null) {
        if (this.productSold.id === undefined) {
          this.preventDelete = false;
          this.productInHistory = false;
        }
      }
    });
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  ngOnInit() {
    this.productName = this.stock.name;
    this.findProductSold();
  }

  confirmDelete(id: number) {
    this.stockService.deleteOutOfStock(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'stockListModification',
        content: 'Deleted an stock'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-stock-delete-out-of-stock-popup',
  template: ''
})
export class StockDeleteOutOfStockPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private stockPopupService: StockPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.stockPopupService.openOutOfStock(StockDeleteOutOfStockDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
