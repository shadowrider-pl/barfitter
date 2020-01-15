import { SERVER_API_URL } from '../../../app.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegisterRestaurantService {
  constructor(private http: HttpClient) {}

  save(account: any): Observable<any> {
    return this.http.post(SERVER_API_URL + 'api/register-restaurant', account);
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
//
// @Injectable()
// export class RegisterRestaurantService {
//
//    constructor(private http: HttpClient) {}
//
//    save(account: any): Observable<any> {
//        return this.http.post(SERVER_API_URL + 'api/register-restaurant', account);
//    }
// }
