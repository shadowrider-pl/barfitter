import { ProductDelivered } from '../../../shared/model/product-delivered.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { ProductDeliveredService } from './product-delivered.service';

@Component({
  selector: 'jhi-product-delivered-detail',
  templateUrl: './product-delivered-detail.component.html'
})
export class ProductDeliveredDetailComponent implements OnInit, OnDestroy {
  productDelivered: ProductDelivered;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(
    private eventManager: JhiEventManager,
    private productDeliveredService: ProductDeliveredService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInProductDelivereds();
  }

  load(id) {
    this.productDeliveredService.find(id).subscribe((productDeliveredResponse: HttpResponse<ProductDelivered>) => {
      this.productDelivered = productDeliveredResponse.body;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInProductDelivereds() {
    this.eventSubscriber = this.eventManager.subscribe('productDeliveredListModification', response => this.load(this.productDelivered.id));
  }
}
