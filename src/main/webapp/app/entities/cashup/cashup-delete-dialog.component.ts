import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICashup } from 'app/shared/model/cashup.model';
import { CashupService } from './cashup.service';

@Component({
  selector: 'jhi-cashup-delete-dialog',
  templateUrl: './cashup-delete-dialog.component.html'
})
export class CashupDeleteDialogComponent {
  cashup: ICashup;

  constructor(protected cashupService: CashupService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.cashupService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'cashupListModification',
        content: 'Deleted an cashup'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-cashup-delete-popup',
  template: ''
})
export class CashupDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ cashup }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CashupDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.cashup = cashup;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/cashup', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/cashup', { outlets: { popup: null } }]);
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
