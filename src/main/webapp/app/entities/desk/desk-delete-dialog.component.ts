import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDesk } from 'app/shared/model/desk.model';
import { DeskService } from './desk.service';

@Component({
  selector: 'jhi-desk-delete-dialog',
  templateUrl: './desk-delete-dialog.component.html'
})
export class DeskDeleteDialogComponent {
  desk: IDesk;

  constructor(protected deskService: DeskService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.deskService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'deskListModification',
        content: 'Deleted an desk'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-desk-delete-popup',
  template: ''
})
export class DeskDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ desk }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(DeskDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.desk = desk;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/desk', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/desk', { outlets: { popup: null } }]);
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
