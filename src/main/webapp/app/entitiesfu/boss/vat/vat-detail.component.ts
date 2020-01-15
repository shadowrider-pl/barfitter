import { Vat } from '../../../shared/model/vat.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { HttpResponse } from '@angular/common/http';

import { BossVatService } from './vat.service';

@Component({
  selector: 'jhi-vat-detail',
  templateUrl: './vat-detail.component.html'
})
export class VatDetailComponent implements OnInit, OnDestroy {
  vat: Vat;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(private eventManager: JhiEventManager, private vatService: BossVatService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInVats();
  }

  load(id) {
    this.vatService.find(id).subscribe((vatResponse: HttpResponse<Vat>) => {
      this.vat = vatResponse.body;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInVats() {
    this.eventSubscriber = this.eventManager.subscribe('vatListModification', response => this.load(this.vat.id));
  }
}
