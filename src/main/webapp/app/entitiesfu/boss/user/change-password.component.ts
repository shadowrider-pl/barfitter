import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { UserFUService } from './user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jhi-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  login: string;
  doNotMatch: string;
  error: string;
  success: string;
  account$: Observable<Account>;
  routeSub: any;
  passwordForm = this.fb.group({
    // currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
  });

  constructor(
    private userService: UserFUService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.account$ = this.accountService.identity();
    this.routeSub = this.route.params.subscribe(params => {
      // console.error("params:" + JSON.stringify(params))

      this.userService.find(params.id).subscribe(response => {
        this.login = response.body.login;

        // console.error("params:" + JSON.stringify(response.body))
      });
    });
  }

  changePassword() {
    const newPassword = this.passwordForm.get(['newPassword']).value;
    if (newPassword !== this.passwordForm.get(['confirmPassword']).value) {
      this.error = null;
      this.success = null;
      this.doNotMatch = 'ERROR';
    } else {
      this.doNotMatch = null;
      this.userService.changePassword(newPassword, this.login).subscribe(
        () => {
          this.error = null;
          this.success = 'OK';
        },
        () => {
          this.success = null;
          this.error = 'ERROR';
        }
      );
    }
  }
}
