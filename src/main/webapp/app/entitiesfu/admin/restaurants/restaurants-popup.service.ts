import { Category } from '../../../shared/model/category.model';
import { RestaurantSummary } from '../../models/restaurant-summary.model';
import { AdminRestaurantsService } from './restaurants.service';
import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class RestaurantsPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(private modalService: NgbModal, private router: Router, private restaurantsService: AdminRestaurantsService) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      if (id) {
        this.restaurantsService.find(id).subscribe((restaurantResponse: HttpResponse<RestaurantSummary>) => {
          const restaurant: RestaurantSummary = restaurantResponse.body;
          this.ngbModalRef = this.restaurantModalRef(component, restaurant);
          resolve(this.ngbModalRef);
        });
      } else {
        // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.ngbModalRef = this.restaurantModalRef(component, new RestaurantSummary(null, null, null));
          resolve(this.ngbModalRef);
        }, 0);
      }
    });
  }

  restaurantModalRef(component: Component, restaurant: RestaurantSummary): NgbModalRef {
    const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.restaurant = restaurant;
    modalRef.result.then(
      result => {
        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
        this.ngbModalRef = null;
      },
      reason => {
        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
        this.ngbModalRef = null;
      }
    );
    return modalRef;
  }
}
