import { AccountService } from 'app/core/auth/account.service';
import { Cashup } from '../../../shared/model/cashup.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { TakeCashPopupService } from './take-cash-popup.service';
import { TakeCashService } from './take-cash.service';
import { Account } from 'app/core/user/account.model';

@Component({
  selector: 'jhi-take-cash-dialog',
  templateUrl: './take-cash-dialog.component.html'
})
export class TakeCashDialogComponent implements OnInit {
  role: string;

  cashup: Cashup;
  isSaving: boolean;
  account: Account;

  constructor(
    public activeModal: NgbActiveModal,
    private takeCashService: TakeCashService,
    private eventManager: JhiEventManager,
    private accountService: AccountService
  ) {}

  getAccount() {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      for (let index = 0; index < this.account.authorities.length; index++) {
        if (this.account.authorities[index] === 'ROLE_BOSS') {
          this.role = 'boss';
          break;
        } else if (this.account.authorities[index] === 'ROLE_MANAGER') {
          this.role = 'manager';
        }
      }
    });
  }

  ngOnInit() {
    this.isSaving = false;
    this.getAccount();
    //      console.log("this.cashup.barmanLoginTime: "+this.cashup.barmanLoginTime);
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.cashup.id !== undefined) {
      this.subscribeToSaveResponse(this.takeCashService.update(this.cashup));
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Cashup>>) {
    result.subscribe((res: HttpResponse<Cashup>) => this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess(result: Cashup) {
    this.eventManager.broadcast({ name: 'takeCashListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }
}

@Component({
  selector: 'jhi-take-cash-popup',
  template: ''
})
export class TakeCashPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private takeCashPopupService: TakeCashPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.takeCashPopupService.open(TakeCashDialogComponent as Component, params['id']);
      } else {
        this.takeCashPopupService.open(TakeCashDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
