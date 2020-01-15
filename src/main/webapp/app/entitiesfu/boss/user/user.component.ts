import { AccountService } from 'app/core/auth/account.service';
import { User } from 'app/core/user/user.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { UserFUService } from './user.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit, OnDestroy {
  users: User[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  error: any;
  success: any;

  constructor(
    private userService: UserFUService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  setActive(user, isActivated) {
    user.activated = isActivated;

    this.userService.updateActivated(user).subscribe(response => {
      if (response.status === 200) {
        this.error = null;
        this.success = 'OK';
        this.loadAll();
      } else {
        this.success = null;
        this.error = 'ERROR';
      }
    });
  }

  loadAll() {
    this.userService.query().subscribe(
      (res: HttpResponse<User[]>) => {
        this.users = res.body;
        this.currentSearch = '';
      },
      (res: HttpResponse<any>) => this.onError(res.body)
    );
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }
  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInUsers();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: User) {
    return item.id;
  }
  registerChangeInUsers() {
    this.eventSubscriber = this.eventManager.subscribe('userListModification', response => this.loadAll());
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }
}
