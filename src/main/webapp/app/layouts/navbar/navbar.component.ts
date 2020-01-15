import { UserToRestaurantFUService } from '../../entitiesfu/active-entities/user-to-restaurant-fu.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService, JhiEventManager } from 'ng-jhipster';

import { VERSION } from 'app/app.constants';
import { LoginModalService } from 'app/core/login/login-modal.service';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { ProfileService } from '../profiles/profile.service';
import { Subscription } from 'rxjs';
import { JhiTrackerService } from 'app/core/tracker/tracker.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'app/core/login/login.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.scss']
  // styleUrls: ['navbar.css']
})
export class NavbarComponent implements OnInit {
  inProduction: boolean;
  isNavbarCollapsed: boolean;
  languages: any[];
  swaggerEnabled: boolean;
  modalRef: NgbModalRef;
  version: string;
  role = null;
  showKitchenBell = false;
  bellBadge = null;
  audioNotification = new Audio('https://ladysplace.pl/Ding-dong.ogg');
  audioError = new Audio('https://ladysplace.pl/dzingiel.ogg');
  myImage = new Image(100, 200);
  account: Account;
  audioSession = null;
  isAudio = null;
  restaurantId = null;
  connectionLost = false;
  private connectSubscriber: Subscription;
  private disConnectSubscriber: Subscription;
  private authenticationSubscriber: Subscription = null;

  constructor(
    private loginService: LoginService,
    private trackerService: JhiTrackerService,
    private translateService: TranslateService,
    private languageService: JhiLanguageService,
    private loginModalService: LoginModalService,
    private profileService: ProfileService,
    private accountService: AccountService,
    private router: Router,
    private userToRestaurantFUService: UserToRestaurantFUService,
    private sessionStorage: SessionStorageService,
    private eventManager: JhiEventManager
  ) {
    this.version = VERSION ? (VERSION.toLowerCase().startsWith('v') ? VERSION : 'v' + VERSION) : '';
    this.isNavbarCollapsed = true;
  }

  checkNotifications() {
    this.isAudio = true;
    this.trackerService.connect();
    this.getAccount();
    this.hideNoAudioBell();
    let checkNotificationsString = null;
    if (this.account) {
      this.playAudioNotification();
      setTimeout(() => {
        checkNotificationsString =
          this.translateService.instant('global.menu.notificationsOK1') +
          this.account.login +
          this.translateService.instant('global.menu.notificationsOK2');
        this.connectionLost = false;
        alert(checkNotificationsString);
      }, 1500); // wait for sound
    } else {
      checkNotificationsString = this.translateService.instant('global.menu.notificationsFailed');
      this.connectionLost = true;
      alert(checkNotificationsString);
    }
  }

  hideKitchenBell() {
    this.showKitchenBell = false;
    this.eventManager.broadcast({
      name: 'reloadKitchen',
      content: this.bellBadge
    });
    //    console.log("reloadKitchen ")
  }

  hideNoAudioBell() {
    this.isAudio = true;
    this.audioNotification.play();
    this.audioNotification.pause();
    let audioNumber = '0';
    if (this.isAudio) {
      audioNumber = '1';
    }
    sessionStorage.setItem('audio', audioNumber);
  }

  checkSound() {
    this.audioSession = sessionStorage.getItem('audio');
    if (sessionStorage.getItem('audio') === '1') {
      this.isAudio = true;
    } else {
      this.isAudio = false;
    }
  }

  registerWSDisConnect() {
    this.disConnectSubscriber = this.eventManager.subscribe('wsDisconnected', message => {
      this.eventManager.destroy(this.disConnectSubscriber);
      this.playAudioError();
      this.connectionLost = true;
      this.account = null;
      const connectionLostString = this.translateService.instant('global.menu.connectionLost');
      this.trackerService.barSubscriber = null;
      this.trackerService.kitchenSubscriber = null;
      this.trackerService.unsubscribeInKitchen();
      this.trackerService.unsubscribeAtBar();
      setTimeout(() => {
        alert(connectionLostString);
      }, 3000); // wait for sound
      this.registerWSConnect();
    });
  }

  registerWSConnect() {
    this.connectSubscriber = this.eventManager.subscribe('wsConnected', message => {
      this.getAccount();
    });
  }

  registerAuthenticationSuccess() {
    this.authenticationSubscriber = this.eventManager.subscribe('authenticationSuccess', message => {
      this.getAccount();
    });
  }

  startWebSocket() {
    for (let index = 0; index < this.account.authorities.length; index++) {
      if (this.account.authorities[index] === 'ROLE_BARMAN') {
        this.role = 'barman';
        this.trackerService.subscribeAtBar(this.restaurantId);
        this.trackerService.receiveForBar().subscribe(activity => {
          this.showKitchenBell = true;
          this.bellBadge = activity.content;
          //  console.error("receiveForBar()=" + activity.content);
          //  console.error("this.showKitchenBell=" + this.showKitchenBell);
          this.playAudioNotification();
        });
        break;
      } else if (this.account.authorities[index] === 'ROLE_CHEF') {
        this.role = 'chef';
        this.trackerService.subscribeInKitchen(this.restaurantId);
        this.trackerService.receiveForKitchen().subscribe(activity => {
          this.showKitchenBell = true;
          this.bellBadge = activity.content;
          //          console.log("receiveForKitchen()=" + activity.content);
          //          console.log("this.showKitchenBell=" + this.showKitchenBell);
          this.playAudioNotification();
        });
        break;
      } else if (this.account.authorities[index] === 'ROLE_MANAGER' || this.account.authorities[index] === 'ROLE_BOSS') {
        this.eventManager.destroy(this.connectSubscriber);
      }
    }
  }

  getAccount() {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      this.userToRestaurantFUService.find(this.account.login).subscribe(userToRestaurant => {
        this.restaurantId = userToRestaurant.body.restaurant.id;
        this.startWebSocket();
      });
    });
  }

  playAudioNotification() {
    this.audioNotification.play();
  }

  playAudioError() {
    this.audioError.play();
  }

  findBrowserLanguage() {
    let browserLang = navigator.language;
    switch (browserLang) {
      case 'pl-PL':
      case 'pl': {
        browserLang = 'pl';
        this.changeLanguage(browserLang);
        break;
      }
    }
  }

  ngOnInit() {
    this.registerWSConnect();
    this.findBrowserLanguage();
    this.registerAuthenticationSuccess();
    this.registerWSDisConnect();
    this.checkSound();
    // this.languageHelper.getAll().subscribe(languages => {
    //     this.languages = languages;
    this.languages = ['en', 'pl']; // overwrite
    // });

    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.swaggerEnabled = profileInfo.swaggerEnabled;
    });
  }

  changeLanguage(languageKey: string) {
    this.sessionStorage.store('locale', languageKey);
    this.languageService.changeLanguage(languageKey);
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.modalRef = this.loginModalService.open();
  }

  logout() {
    this.trackerService.barSubscriber = null;
    this.trackerService.kitchenSubscriber = null;
    this.trackerService.unsubscribeInKitchen();
    this.trackerService.unsubscribeAtBar();
    this.eventManager.destroy(this.disConnectSubscriber);
    if (this.connectSubscriber) {
      this.eventManager.destroy(this.connectSubscriber);
    }
    sessionStorage.setItem('audio', '0');
    this.isAudio = false;
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  getImageUrl() {
    return this.isAuthenticated() ? this.accountService.getImageUrl() : null;
  }
}
