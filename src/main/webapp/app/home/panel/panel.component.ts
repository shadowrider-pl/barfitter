import { Component, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Router } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';

import { Account } from 'app/core/user/account.model';
@Component({
  selector: 'jhi-panel',
  templateUrl: './panel.component.html'
})
export class PanelComponent implements OnInit {
  // account: Account;
  // role: string;

  // constructor(
  //     private accountService: AccountService,
  //     private router: Router,
  //     private eventManager: JhiEventManager) {}

  // ngOnInit() {
  //     this.accountService.identity().subscribe(account => {
  //         this.account = account;
  //     });
  //     this.registerAuthenticationSuccess();
  // }

  // registerAuthenticationSuccess() {
  //     this.eventManager.subscribe('authenticationSuccess', message => {
  //         this.accountService.identity().subscribe(account => {
  //             this.account = account;
  //                     for (let index = 0; index < this.account.authorities.length; index++) {
  //                         if (this.account.authorities[index] === 'ROLE_BARMAN') {
  //                             this.router.navigate(['../barman-panel']);
  //                             break;
  //                         } else if (this.account.authorities[index] === 'ROLE_CHEF') {
  //                             this.router.navigate(['../chef-panel']);
  //                             break;
  //                         } else if (this.account.authorities[index] === 'ROLE_BOSS') {
  //                             this.role = 'boss';
  //                         } else if (this.account.authorities[index] === 'ROLE_MANAGER') {
  //                             this.role = 'manager';
  //                         }
  //                     }
  //         });
  //     });
  // }

  // isAuthenticated() {
  //     return this.accountService.isAuthenticated();
  // }

  account: Account;
  role: string;

  constructor(private accountService: AccountService, private router: Router, private eventManager: JhiEventManager) {}

  ngOnInit() {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      for (let index = 0; index < this.account.authorities.length; index++) {
        if (this.account.authorities[index] === 'ROLE_BARMAN') {
          this.router.navigate(['../barman-panel']);
          break;
        } else if (this.account.authorities[index] === 'ROLE_CHEF') {
          this.router.navigate(['../chef-panel']);
          break;
        } else if (this.account.authorities[index] === 'ROLE_BOSS') {
          this.role = 'boss';
        } else if (this.account.authorities[index] === 'ROLE_MANAGER') {
          this.role = 'manager';
        }
      }
      this.registerAuthenticationSuccess();
    });
  }

  registerAuthenticationSuccess() {
    this.eventManager.subscribe('authenticationSuccess', message => {
      this.accountService.identity().subscribe(account => {
        this.account = account;
      });
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }
}
