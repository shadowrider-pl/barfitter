import { ProductSold } from '../../../shared/model/product-sold.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { StockPopupService } from './stock-popup.service';
import { StockService } from './stock.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-stock-delete-dialog',
  templateUrl: './stock-delete-dialog.component.html'
})
export class StockDeleteDialogComponent implements OnInit {
  stock: any;
  productName = null;
  productSold: ProductSold;
  productInHistory = true;
  preventDelete = true;

  constructor(private stockService: StockService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  findProductSold() {
    this.stockService.findProductSold(this.stock.product.id).subscribe((productSoldResponse: HttpResponse<ProductSold>) => {
      this.productSold = productSoldResponse.body;
      if (this.productSold != null) {
        console.error('this.productSold.id=' + this.productSold.id);
        this.productInHistory = true;
        this.preventDelete = true;
        //          console.log("this.productSold != null");
        // if (this.productSold.id === undefined) {
      } else {
        console.error('this.productSold.id === undefined');
        this.preventDelete = false;
        this.productInHistory = false;
      }
    });
  }

  ngOnInit() {
    this.productName = this.stock.product.name;
    this.findProductSold();
  }

  confirmDelete(id: number) {
    this.stockService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'stockListModification',
        content: 'Deleted an stock'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-stock-delete-popup',
  template: ''
})
export class StockDeletePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private stockPopupService: StockPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.stockPopupService.open(StockDeleteDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
