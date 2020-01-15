import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { HttpResponse } from '@angular/common/http';
import { OrderWithProductsService } from '../../active-entities/order-with-products.service';
import { OrderWithProducts } from '../../models/order-opened-with-products.model';
import * as moment from 'moment';

@Component({
  selector: 'jhi-order-opened-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['../../../../app/../content/css/scroll-buttons.scss']
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  orderOpened: OrderWithProducts;
  private subscription: Subscription;
  private eventSubscriber: Subscription;
  sendingTime = null;
  acceptingTime = null;
  finishingTime = null;
  takingTime = null;
  scrollInPixels = 200;

  constructor(
    private eventManager: JhiEventManager,
    private orderWithProductsService: OrderWithProductsService,
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
    this.registerChangeInOrderOpeneds();
    window.addEventListener('scroll', this.showScrollButtons, true);
  }

  load(id) {
    this.orderWithProductsService.find(id).subscribe((orderOpenedResponse: HttpResponse<OrderWithProducts>) => {
      this.orderOpened = orderOpenedResponse.body;
      for (let i = 0; i < this.orderOpened.productsToOrder.length; i++) {
        if (this.orderOpened.productsToOrder[i].sendTime != null) {
          const startDate = moment(this.orderOpened.productsToOrder[i].orderedTime);
          const endDate = moment(this.orderOpened.productsToOrder[i].sendTime);
          this.sendingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
          //                    this.sendingTime = moment.duration(diff).humanize();
          //                      const startDate = new Date(this.orderOpened.productsToOrder[i].orderedTime).getTime();
          //                      const endDate = new Date(this.orderOpened.productsToOrder[i].sendTime).getTime();
          //                      const milisecondsDiff: number = (endDate - startDate) > 0 ? (endDate - startDate) : 0 ;
          // przy wciśnięciu zapisz i wyślij na kuchnię, czasy są robione asynchronicznie i różnica może być <0
          //                    this.sendingTime = Math.floor(milisecondsDiff / (1000 * 60));
        }
        if (this.orderOpened.productsToOrder[i].acceptedTime != null) {
          const startDate = this.orderOpened.productsToOrder[i].sendTime;
          const endDate = this.orderOpened.productsToOrder[i].acceptedTime;
          this.acceptingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
          //                      const startDate = new Date(this.orderOpened.productsToOrder[i].sendTime).getTime();
          //                      const endDate = new Date(this.orderOpened.productsToOrder[i].acceptedTime).getTime();
          //                      const milisecondsDiff = endDate - startDate;
          //                    this.acceptingTime = Math.floor(milisecondsDiff / (1000 * 60));
        }
        if (this.orderOpened.productsToOrder[i].finishedTime != null) {
          const startDate = this.orderOpened.productsToOrder[i].acceptedTime;
          const endDate = this.orderOpened.productsToOrder[i].finishedTime;
          this.finishingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
          //                      const startDate = new Date(this.orderOpened.productsToOrder[i].acceptedTime).getTime();
          //                      const endDate = new Date(this.orderOpened.productsToOrder[i].finishedTime).getTime();
          //                      const milisecondsDiff = endDate - startDate;
          //                    this.finishingTime = Math.floor(milisecondsDiff / (1000 * 60));
        }
        if (this.orderOpened.productsToOrder[i].takenTime != null) {
          const startDate = this.orderOpened.productsToOrder[i].finishedTime;
          const endDate = this.orderOpened.productsToOrder[i].takenTime;
          this.takingTime = moment.utc(moment(endDate, 'HH:mm:ss').diff(moment(startDate, 'HH:mm:ss'))).format('mm');
          //                      const startDate = new Date(this.orderOpened.productsToOrder[i].finishedTime).getTime();
          //                      const endDate = new Date(this.orderOpened.productsToOrder[i].takenTime).getTime();
          //                      const milisecondsDiff = endDate - startDate;
          //                    this.takingTime = Math.floor(milisecondsDiff / (1000 * 60));
        }
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

  registerChangeInOrderOpeneds() {
    this.eventSubscriber = this.eventManager.subscribe('orderOpenedListModification', response => this.load(this.orderOpened.id));
  }
}
