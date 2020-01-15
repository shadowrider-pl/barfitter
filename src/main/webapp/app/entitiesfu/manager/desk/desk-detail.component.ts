import { Desk } from '../../../shared/model/desk.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { DeskService } from './desk.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-desk-detail',
  templateUrl: './desk-detail.component.html'
})
export class DeskDetailComponent implements OnInit, OnDestroy {
  desk: Desk;
  private subscription: Subscription;
  private eventSubscriber: Subscription;

  constructor(private eventManager: JhiEventManager, private deskService: DeskService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      this.load(params['id']);
    });
    this.registerChangeInDesks();
  }

  load(id) {
    this.deskService.find(id).subscribe((deskResponse: HttpResponse<Desk>) => {
      this.desk = deskResponse.body;
    });
  }
  previousState() {
    window.history.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInDesks() {
    this.eventSubscriber = this.eventManager.subscribe('deskListModification', response => this.load(this.desk.id));
  }
}
