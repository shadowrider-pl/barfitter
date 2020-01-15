import { Desk } from '../../../shared/model/desk.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DeskPopupService } from './desk-popup.service';
import { DeskService } from './desk.service';

@Component({
  selector: 'jhi-desk-dialog',
  templateUrl: './desk-dialog.component.html'
})
export class DeskDialogComponent implements OnInit {
  desk: Desk;
  simpleDesks: Desk[];
  desks: Desk[];
  parentId = null;
  parent = null;
  isSaving: boolean;
  foundExistingDesk = false;

  constructor(
    public activeModal: NgbActiveModal,
    private jhiAlertService: JhiAlertService,
    private deskService: DeskService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.loadDesks();
  }

  loadDesks() {
    this.deskService.query().subscribe(
      (res: HttpResponse<Desk[]>) => {
        this.simpleDesks = res.body;
        this.simpleDesks.sort(this.compare);
        this.loadParent(this.simpleDesks);
        this.setActiveOnNew();
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadParent(desks) {
    for (let i = desks.length - 1; i >= 0; i--) {
      // żeby nie pozwolił wybrac siebie
      if (desks[i].id === this.desk.parentId) {
        this.parentId = this.desk.id;
      }
      if (desks[i].id === this.desk.id || desks[i].parentId > 0) {
        desks.splice(i, 1);
      }
    }
    this.desks = desks;
  }

  changeParentDesk(desk) {
    this.desk.parentId = desk.id;
  }

  compare(a, b) {
    if (a.description < b.description) {
      return -1;
    }
    if (a.description > b.description) {
      return 1;
    }
    return 0;
  }

  checkDescription() {
    this.foundExistingDesk = false;
    for (let i = 0; i < this.desks.length; i++) {
      if (this.desk.description === this.desks[i].description) {
        this.foundExistingDesk = true;
        break;
      }
    }
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.parent) {
      this.desk.parentId = this.parent.id;
    } else if (!this.desk.parentId) {
      this.desk.parentId = 0;
    }

    if (this.desk.id !== undefined) {
      this.subscribeToSaveResponse(this.deskService.update(this.desk));
    } else {
      this.subscribeToSaveResponse(this.deskService.create(this.desk));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Desk>>) {
    result.subscribe((res: HttpResponse<Desk>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: Desk) {
    this.eventManager.broadcast({ name: 'deskListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.jhiAlertService.error(error.message, null, null);
  }

  setActiveOnNew() {
    if (this.desk.id === undefined) {
      this.desk.active = true;
    }
  }
}

@Component({
  selector: 'jhi-desk-popup',
  template: ''
})
export class DeskPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private deskPopupService: DeskPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.deskPopupService.open(DeskDialogComponent as Component, params['id']);
      } else {
        this.deskPopupService.open(DeskDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
