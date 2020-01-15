import { Category } from '../../../shared/model/category.model';
import { RestaurantSummary } from '../../models/restaurant-summary.model';
import { RestaurantsPopupService } from './restaurants-popup.service';
import { AdminRestaurantsService } from './restaurants.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

@Component({
  selector: 'jhi-restaurants-delete-dialog',
  templateUrl: './restaurants-delete-dialog.component.html'
})
export class RestaurantsDeleteDialogComponent {
  restaurant: RestaurantSummary;

  constructor(
    private restaurantsService: AdminRestaurantsService,
    public activeModal: NgbActiveModal,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.restaurantsService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'restaurantsListModification',
        content: 'Deleted an restaurant'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-category-delete-popup',
  template: ''
})
export class RestaurantsDeletePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private restaurantsPopupService: RestaurantsPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.restaurantsPopupService.open(RestaurantsDeleteDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
