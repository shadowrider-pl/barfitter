import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IXsell } from 'app/shared/model/xsell.model';
import { XsellService } from './xsell.service';

@Component({
  selector: 'jhi-xsell-delete-dialog',
  templateUrl: './xsell-delete-dialog.component.html'
})
export class XsellDeleteDialogComponent {
  xsell: IXsell;

  constructor(protected xsellService: XsellService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.xsellService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'xsellListModification',
        content: 'Deleted an xsell'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-xsell-delete-popup',
  template: ''
})
export class XsellDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ xsell }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(XsellDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.xsell = xsell;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/xsell', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/xsell', { outlets: { popup: null } }]);
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
