import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBestseller } from 'app/shared/model/bestseller.model';
import { BestsellerService } from './bestseller.service';

@Component({
  selector: 'jhi-bestseller-delete-dialog',
  templateUrl: './bestseller-delete-dialog.component.html'
})
export class BestsellerDeleteDialogComponent {
  bestseller: IBestseller;

  constructor(
    protected bestsellerService: BestsellerService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.bestsellerService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'bestsellerListModification',
        content: 'Deleted an bestseller'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-bestseller-delete-popup',
  template: ''
})
export class BestsellerDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ bestseller }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(BestsellerDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.bestseller = bestseller;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/bestseller', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/bestseller', { outlets: { popup: null } }]);
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
