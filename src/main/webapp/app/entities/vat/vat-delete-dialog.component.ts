import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IVat } from 'app/shared/model/vat.model';
import { VatService } from './vat.service';

@Component({
  selector: 'jhi-vat-delete-dialog',
  templateUrl: './vat-delete-dialog.component.html'
})
export class VatDeleteDialogComponent {
  vat: IVat;

  constructor(protected vatService: VatService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.vatService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'vatListModification',
        content: 'Deleted an vat'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-vat-delete-popup',
  template: ''
})
export class VatDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ vat }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(VatDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.vat = vat;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/vat', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/vat', { outlets: { popup: null } }]);
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
