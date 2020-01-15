import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { Location } from '@angular/common';

import { AuthServerProvider } from '../auth/auth-jwt.service';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';

@Injectable({ providedIn: 'root' })
export class JhiTrackerService {
  stompClient = null;
  subscriber = null;
  connection: Promise<any>;
  connectedPromise: any;
  listener: Observable<any>;
  listenerObserver: Observer<any>;
  alreadyConnectedOnce = false;
  private subscription: Subscription;
  kitchenSubscriber = null;
  barSubscriber = null;
  kitchenListener: Observable<any>;
  barListener: Observable<any>;
  listenerObserverForKitchen: Observer<any>;
  listenerObserverForBar: Observer<any>;

  constructor(private router: Router, private authServerProvider: AuthServerProvider, private location: Location) {
    this.connection = this.createConnection();
    this.listener = this.createListener();
    this.kitchenListener = this.createKitchenListener();
    this.barListener = this.createBarListener();
  }

  connect() {
    if (this.connectedPromise === null) {
      this.connection = this.createConnection();
    }
    // building absolute path so that websocket doesn't fail when deploying with a context path
    let url = '/websocket/tracker';
    url = this.location.prepareExternalUrl(url);
    const authToken = this.authServerProvider.getToken();
    if (authToken) {
      url += '?access_token=' + authToken;
    }
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
    const headers = {};
    this.stompClient.connect(headers, () => {
      this.connectedPromise('success');
      this.connectedPromise = null;
      this.sendActivity();
      if (!this.alreadyConnectedOnce) {
        this.subscription = this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            this.sendActivity();
          }
        });
        this.alreadyConnectedOnce = true;
        // this.eventManager.broadcast({ name: 'wsConnected', content: 'OK' });
      }
    });
    this.stompClient.ws.onclose = () => {
      this.stompClient.connected = false;
      this.alreadyConnectedOnce = false;
      // this.eventManager.broadcast({ name: 'wsDisconnected', content: 'OK' });
    };
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
      this.stompClient = null;
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.alreadyConnectedOnce = false;
  }

  receive() {
    return this.listener;
  }

  receiveForKitchen() {
    return this.kitchenListener;
  }

  receiveForBar() {
    return this.barListener;
  }

  sendActivity() {
    if (this.stompClient !== null && this.stompClient.connected) {
      this.stompClient.send(
        '/topic/activity', // destination
        JSON.stringify({ page: this.router.routerState.snapshot.url }), // body
        {} // header
      );
    }
  }

  subscribe() {
    this.connection.then(() => {
      this.subscriber = this.stompClient.subscribe('/topic/tracker', data => {
        this.listenerObserver.next(JSON.parse(data.body));
      });
    });
  }

  subscribeInKitchen(restaurantId) {
    if (this.kitchenSubscriber == null) {
      this.connection.then(() => {
        this.kitchenSubscriber = this.stompClient.subscribe('/topic/kitchenactivity/' + restaurantId, data => {
          this.listenerObserverForKitchen.next(JSON.parse(data.body));
        });
      });
    } else {
      //      console.log('this.kitchenSubscriber != null');
    }
  }

  subscribeAtBar(restaurantId) {
    if (this.barSubscriber == null) {
      this.connection.then(() => {
        this.barSubscriber = this.stompClient.subscribe('/topic/baractivity/' + restaurantId, data => {
          this.listenerObserverForBar.next(JSON.parse(data.body));
        });
      });
    } else {
      //      console.log('this.barSubscriber != null');
    }
  }

  unsubscribe() {
    if (this.subscriber !== null) {
      this.subscriber.unsubscribe();
    }
    this.listener = this.createListener();
  }

  unsubscribeInKitchen() {
    if (this.kitchenSubscriber !== null) {
      this.kitchenSubscriber.unsubscribe();
      this.kitchenSubscriber = null;
    }
    this.kitchenListener = this.createKitchenListener();
  }

  unsubscribeAtBar() {
    if (this.barSubscriber !== null) {
      this.barSubscriber.unsubscribe();
      this.barSubscriber = null;
    }
    this.barListener = this.createBarListener();
  }

  private createListener(): Observable<any> {
    return new Observable(observer => {
      this.listenerObserver = observer;
    });
  }

  private createKitchenListener(): Observable<any> {
    return new Observable(observer => {
      this.listenerObserverForKitchen = observer;
    });
  }

  private createBarListener(): Observable<any> {
    return new Observable(observer => {
      this.listenerObserverForBar = observer;
    });
  }

  private createConnection(): Promise<any> {
    return new Promise((resolve, reject) => (this.connectedPromise = resolve));
  }
}
