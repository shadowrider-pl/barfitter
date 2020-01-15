import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUserToRestaurant } from 'app/shared/model/user-to-restaurant.model';
import { UserToRestaurantService } from './user-to-restaurant.service';

@Component({
  selector: 'jhi-user-to-restaurant-delete-dialog',
  templateUrl: './user-to-restaurant-delete-dialog.component.html'
})
export class UserToRestaurantDeleteDialogComponent {
  userToRestaurant: IUserToRestaurant;

  constructor(
    protected userToRestaurantService: UserToRestaurantService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.userToRestaurantService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'userToRestaurantListModification',
        content: 'Deleted an userToRestaurant'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-user-to-restaurant-delete-popup',
  template: ''
})
export class UserToRestaurantDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ userToRestaurant }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(UserToRestaurantDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.userToRestaurant = userToRestaurant;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/user-to-restaurant', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/user-to-restaurant', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
