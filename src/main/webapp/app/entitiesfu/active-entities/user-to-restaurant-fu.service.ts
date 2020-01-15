import { SERVER_API_URL } from '../../app.constants';
import { IUserToRestaurant } from '../../shared/model/user-to-restaurant.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IUserToRestaurant>;

@Injectable({ providedIn: 'root' })
export class UserToRestaurantFUService {
  private resourceUrl = SERVER_API_URL + 'api/user-to-restaurant-fu';

  constructor(private http: HttpClient) {}

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IUserToRestaurant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../app.constants';
//
// import { createRequestOption } from '../../shared';
// import { UserToRestaurant } from '../../shared/model/user-to-restaurant.model';
// export type EntityResponseType = HttpResponse<UserToRestaurant>;
//
// @Injectable()
// export class UserToRestaurantFUService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/user-to-restaurant-fu';
//
//    constructor(private http: HttpClient) { }
//
//    find(id: string): Observable<EntityResponseType> {
//        return this.http.get<UserToRestaurant>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: UserToRestaurant = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to UserToRestaurant.
//     */
//    private convertItemFromServer(userToRestaurant: UserToRestaurant): UserToRestaurant {
//        const copy: UserToRestaurant = Object.assign({}, userToRestaurant);
//        return copy;
//    }
//
//    /**
//     * Convert a UserToRestaurant to a JSON which can be sent to the server.
//     */
////    private convert(userToRestaurant: UserToRestaurant): UserToRestaurant {
////        const copy: UserToRestaurant = Object.assign({}, userToRestaurant);
////        return copy;
////    }
// }
