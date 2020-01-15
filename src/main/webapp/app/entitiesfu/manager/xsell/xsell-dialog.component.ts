import { RestaurantService } from '../../../entities/restaurant/restaurant.service';
import { Category } from '../../../shared/model/category.model';
import { Restaurant } from '../../../shared/model/restaurant.model';
import { Xsell } from '../../../shared/model/xsell.model';
import { ActiveCategoryService } from '../../active-entities/active-category.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { XsellPopupService } from './xsell-popup.service';
import { MXsellService } from './xsell.service';

@Component({
  selector: 'jhi-xsell-dialog',
  templateUrl: './xsell-dialog.component.html'
})
export class XsellDialogComponent implements OnInit {
  xsell: Xsell;
  isSaving: boolean;

  categories: Category[];

  restaurants: Restaurant[];

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private xsellService: MXsellService,
    private categoryService: ActiveCategoryService,
    private restaurantService: RestaurantService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.categoryService.query().subscribe(
      (res: HttpResponse<Category[]>) => {
        this.categories = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
    this.restaurantService.query().subscribe(
      (res: HttpResponse<Restaurant[]>) => {
        this.restaurants = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.xsell.id !== undefined) {
      this.subscribeToSaveResponse(this.xsellService.update(this.xsell));
    } else {
      this.subscribeToSaveResponse(this.xsellService.create(this.xsell));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Xsell>>) {
    result.subscribe((res: HttpResponse<Xsell>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: Xsell) {
    this.eventManager.broadcast({ name: 'xsellListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  trackCategoryById(index: number, item: Category) {
    return item.id;
  }

  trackRestaurantById(index: number, item: Restaurant) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-xsell-popup',
  template: ''
})
export class XsellPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private xsellPopupService: XsellPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.xsellPopupService.open(XsellDialogComponent as Component, params['id']);
      } else {
        this.xsellPopupService.open(XsellDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
