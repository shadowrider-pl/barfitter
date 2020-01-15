import { ProductOrdered } from '../../../../shared/model/product-ordered.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

import { ProductOrderedFUService } from '../../../active-entities/product-ordered-fu.service';

@Component({
  selector: 'jhi-product-ordered-detail',
  templateUrl: './product-ordered-fu-detail.component.html',
  styleUrls: ['../../../../../app/../content/css/scroll-buttons.scss']
})
export class ProductOrderedFUDetailComponent implements OnInit, OnDestroy {
  productOrdered: ProductOrdered;
  private subscription: Subscription;
  private eventSubscriber: Subscription;
  sendingTime = null;
  acceptingTime = null;
  finishingTime = null;
  takingTime = null;
  scrollInPixels = 200;

  constructor(
    private eventManager: JhiEventManager,
    private productOrderedService: ProductOrderedFUService,
    private route: ActivatedRoute
  ) {}

  showScrollButtons() {
    if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && document.getElementById('upButton') !== null) {
      document.getElementById('upButton').style.display = 'block';
    } else {
      document.getElementById('upButton').style.display = 'none';
    }

    if (
      (document.body.scrollTop > document.body.scrollHeight - window.innerHeight * 1.05 ||
        document.documentElement.scrollTop > document.documentElement.scrollHeight - window.innerHeight * 1.05) &&
      document.getElementById('downButton') !== null
    ) {
      document.getElementById('downButton').style.display = 'none';
    } else {
      document.getElementById('downButton').style.display = 'block';
    }
    return null;
  }

  scrollDown() {
    window.scrollBy({
      top: this.scrollInPixels,
      left: 0,
      behavior: 'smooth'
    });
  }

  scrollUp() {
    window.scrollBy({
      top: -1 * this.scrollInPixels,
      left: 0,
      behavior: 'smooth'
    });
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInProductOrdereds();
    window.addEventListener('scroll', this.showScrollButtons, true);
  }

  load(id) {
    this.productOrderedService.find(id).subscribe((productOrderedResponse: HttpResponse<ProductOrdered>) => {
      this.productOrdered = productOrderedResponse.body;
      if (this.productOrdered.sendTime != null) {
        const startDate = moment(this.productOrdered.orderedTime);
        const endDate = moment(this.productOrdered.sendTime);
        this.sendingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
      }
      if (this.productOrdered.acceptedTime != null) {
        const startDate = this.productOrdered.sendTime;
        const endDate = this.productOrdered.acceptedTime;
        this.acceptingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
      }
      if (this.productOrdered.finishedTime != null) {
        const startDate = this.productOrdered.acceptedTime;
        const endDate = this.productOrdered.finishedTime;
        this.finishingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
      }
      if (this.productOrdered.takenTime != null) {
        const startDate = this.productOrdered.finishedTime;
        const endDate = this.productOrdered.takenTime;
        this.takingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
      }
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
    window.removeEventListener('scroll', this.showScrollButtons, true);
  }

  registerChangeInProductOrdereds() {
    this.eventSubscriber = this.eventManager.subscribe('productOrderedListModification', response => this.load(this.productOrdered.id));
  }
}
