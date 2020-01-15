import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFavorite } from 'app/shared/model/favorite.model';
import { FavoriteService } from './favorite.service';

@Component({
  selector: 'jhi-favorite-delete-dialog',
  templateUrl: './favorite-delete-dialog.component.html'
})
export class FavoriteDeleteDialogComponent {
  favorite: IFavorite;

  constructor(protected favoriteService: FavoriteService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.favoriteService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'favoriteListModification',
        content: 'Deleted an favorite'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-favorite-delete-popup',
  template: ''
})
export class FavoriteDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ favorite }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(FavoriteDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.favorite = favorite;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/favorite', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/favorite', { outlets: { popup: null } }]);
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
