import { AccountService } from 'app/core/auth/account.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.model';
import { JhiLanguageHelper } from 'app/core/language/language.helper';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { UserPopupService } from './user-popup.service';
import { UserFUService } from './user.service';
import { Account } from 'app/core/user/account.model';

@Component({
  selector: 'jhi-user-dialog',
  templateUrl: './user-dialog.component.html'
})
export class UserDialogComponent implements OnInit {
  user: User;
  isSaving: boolean;
  languages: any[];
  authorities: any[];
  account: Account;
  newUser = false;
  confirmPassword: string = null;

  constructor(
    public activeModal: NgbActiveModal,
    private accountService: AccountService,
    private languageHelper: JhiLanguageHelper,
    private userService: UserService,
    private userFUService: UserFUService,
    private eventManager: JhiEventManager
  ) {}

  preventBossRemove() {
    let isBoss = false;
    this.accountService.identity().subscribe(account => {
      this.account = account;

      for (let i = this.account.authorities.length; i >= 0; --i) {
        if (this.account.authorities[i] === 'ROLE_BOSS') {
          isBoss = true;
          break;
        }
      }

      for (let i = this.authorities.length; i >= 0; --i) {
        if (
          this.authorities[i] === 'ROLE_USER' ||
          this.authorities[i] === 'ROLE_ADMIN' ||
          (this.authorities[i] === 'ROLE_BOSS' && isBoss === true)
        ) {
          this.authorities.splice(i, 1);
        }
      }
    });
  }

  ngOnInit() {
    this.isSaving = false;
    this.userService.authorities().subscribe(authorities => {
      this.authorities = authorities;
      this.preventBossRemove();
    });
    // this.languages = this.languageHelper.getAll();
    this.languages = ["pl", "en"];
    if (!this.user.login) {
      this.newUser = true;
    }
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.user.id !== null) {
      this.userFUService.update(this.user).subscribe(response => this.onSaveSuccess(response), () => this.onSaveError());
    } else {
      if (this.user.langKey == null) {
        this.user.langKey = 'en';
      }
      this.userFUService.create(this.user).subscribe(response => this.onSaveSuccess(response), () => this.onSaveError());
    }
  }

  //  private subscribeToSaveResponse(result: Observable<User>) {
  //    result.subscribe((res: User) =>
  //      this.onSaveSuccess(res), (res: Response) => this.onSaveError());
  //  }

  private onSaveSuccess(result) {
    this.eventManager.broadcast({ name: 'userListModification', content: 'OK' });
    this.isSaving = false;
    this.activeModal.dismiss(result.body);
  }

  private onSaveError() {
    this.isSaving = false;
  }
}

@Component({
  selector: 'jhi-user-popup',
  template: ''
})
export class UserPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private userPopupService: UserPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.userPopupService.open(UserDialogComponent as Component, params['id']);
      } else {
        this.userPopupService.open(UserDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
