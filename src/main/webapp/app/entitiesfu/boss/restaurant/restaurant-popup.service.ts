import { Restaurant } from '../../../shared/model/restaurant.model';
import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { BossRestaurantService } from './restaurant.service';

@Injectable()
export class RestaurantPopupService {
  private ngbModalRef: NgbModalRef;

  constructor(private modalService: NgbModal, private router: Router, private restaurantService: BossRestaurantService) {
    this.ngbModalRef = null;
  }

  open(component: Component, id?: number | any): Promise<NgbModalRef> {
    return new Promise<NgbModalRef>((resolve, reject) => {
      const isOpen = this.ngbModalRef !== null;
      if (isOpen) {
        resolve(this.ngbModalRef);
      }

      //            if (id) {
      this.restaurantService.find().subscribe((restaurantResponse: HttpResponse<Restaurant>) => {
        const restaurant: Restaurant = restaurantResponse.body;
        //                        if (restaurant.licenceDate) {
        //                            restaurant.licenceDate = {
        //                                year: restaurant.licenceDate.getFullYear(),
        //                                month: restaurant.licenceDate.getMonth() + 1,
        //                                day: restaurant.licenceDate.getDate()
        //                            };
        //                        }
        //                        if (restaurant.createdDate) {
        //                            restaurant.createdDate = {
        //                                year: restaurant.createdDate.getFullYear(),
        //                                month: restaurant.createdDate.getMonth() + 1,
        //                                day: restaurant.createdDate.getDate()
        //                            };
        //                        }
        this.ngbModalRef = this.restaurantModalRef(component, restaurant);
        resolve(this.ngbModalRef);
      });
      //            } else {
      //                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
      //                setTimeout(() => {
      //                    this.ngbModalRef = this.restaurantModalRef(component, new Restaurant());
      //                    resolve(this.ngbModalRef);
      //                }, 0);
      //            }
    });
  }

  restaurantModalRef(component: Component, restaurant: Restaurant): NgbModalRef {
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
