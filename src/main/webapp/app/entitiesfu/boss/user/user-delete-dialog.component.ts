import { User } from 'app/core/user/user.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { UserPopupService } from './user-popup.service';
import { UserFUService } from './user.service';

@Component({
  selector: 'jhi-user-delete-dialog',
  templateUrl: './user-delete-dialog.component.html'
})
export class UserDeleteDialogComponent {
  user: User;

  constructor(private userService: UserFUService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(login) {
    this.userService.delete(login).subscribe(response => {
      this.eventManager.broadcast({ name: 'userListModification', content: 'Deleted a user' });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-user-delete-popup',
  template: ''
})
export class UserDeletePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(private route: ActivatedRoute, private userPopupService: UserPopupService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.userPopupService.open(UserDeleteDialogComponent as Component, params['id']);
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
