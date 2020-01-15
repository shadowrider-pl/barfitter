import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { VatPopupService } from './vat-popup.service';
import { BossVatService } from './vat.service';
import { RestaurantService } from '../../../entities/restaurant/restaurant.service';
import { Restaurant } from '../../../shared/model/restaurant.model';
import { Vat } from '../../../shared/model/vat.model';

@Component({
  selector: 'jhi-vat-dialog',
  templateUrl: './vat-dialog.component.html'
})
export class VatDialogComponent implements OnInit {
  vat: Vat;
  isSaving: boolean;

  restaurants: Restaurant[];

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private vatService: BossVatService,
    private restaurantService: RestaurantService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.restaurantService.query().subscribe(
      (res: HttpResponse<Restaurant[]>) => {
        this.restaurants = res.body;
        this.setActiveOnNew();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.vat.id !== undefined) {
      this.subscribeToSaveResponse(this.vatService.update(this.vat));
    } else {
      this.subscribeToSaveResponse(this.vatService.create(this.vat));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Vat>>) {
    result.subscribe((res: HttpResponse<Vat>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: Vat) {
    this.eventManager.broadcast({ name: 'vatListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackRestaurantById(index: number, item: Restaurant) {
    return item.id;
  }

  setActiveOnNew() {
    if (this.vat.id === undefined) {
      this.vat.active = true;
    }
  }
}

@Component({
  selector: 'jhi-vat-popup',
  template: ''
})
export class VatPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private vatPopupService: VatPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.vatPopupService.open(VatDialogComponent as Component, params['id']);
      } else {
        this.vatPopupService.open(VatDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
