import { Xsell } from '../../../shared/model/xsell.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { XsellPopupService } from './xsell-popup.service';
import { MXsellService } from './xsell.service';

@Component({
  selector: 'jhi-xsell-delete-dialog',
  templateUrl: './xsell-delete-dialog.component.html'
})
export class XsellDeleteDialogComponent {
  xsell: Xsell;

  constructor(private mXsellService: MXsellService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.mXsellService.delete(id).subscribe(response => {
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
  routeSub: any;

  constructor(private route: ActivatedRoute, private xsellPopupService: XsellPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.xsellPopupService.open(XsellDeleteDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
