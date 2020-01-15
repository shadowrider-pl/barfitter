import { Vat } from '../../../shared/model/vat.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { VatPopupService } from './vat-popup.service';
import { BossVatService } from './vat.service';

@Component({
  selector: 'jhi-vat-delete-dialog',
  templateUrl: './vat-delete-dialog.component.html'
})
export class VatDeleteDialogComponent {
  vat: Vat;

  constructor(private vatService: BossVatService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

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
  routeSub: any;

  constructor(private route: ActivatedRoute, private vatPopupService: VatPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.vatPopupService.open(VatDeleteDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
