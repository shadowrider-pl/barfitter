import { Xsell } from '../../../shared/model/xsell.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { MXsellService } from './xsell.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-xsell-detail',
  templateUrl: './xsell-detail.component.html'
})
export class XsellDetailComponent implements OnInit, OnDestroy {
  xsell: Xsell;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(private eventManager: JhiEventManager, private mXsellService: MXsellService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInXsells();
  }

  load(id) {
    this.mXsellService.find(id).subscribe((xsellResponse: HttpResponse<Xsell>) => {
      this.xsell = xsellResponse.body;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInXsells() {
    this.eventSubscriber = this.eventManager.subscribe('xsellListModification', response => this.load(this.xsell.id));
  }
}
