import { SERVER_API_URL } from '../../../app.constants';
// import { createRequestOption, DATE_FORMAT } from '../../../shared';

import { createRequestOption } from 'app/shared/util/request-util';
import { CurrencyForLocalizedCurrencyPipe } from '../../../shared/language/localizedCurrency.pipe';
import { IRestaurant } from '../../../shared/model/restaurant.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';

type EntityResponseType = HttpResponse<IRestaurant>;
type EntityArrayResponseType = HttpResponse<IRestaurant[]>;
type EntityResponseCurrencyType = HttpResponse<CurrencyForLocalizedCurrencyPipe>;

@Injectable({ providedIn: 'root' })
export class BossRestaurantService {
  private resourceUrl = SERVER_API_URL + 'api/boss-restaurant';
  private resourceUrlForCurrency = SERVER_API_URL + 'api/restaurant-currency';

  constructor(private http: HttpClient) {}

  create(restaurant: IRestaurant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(restaurant);
    return this.http
      .post<IRestaurant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(restaurant: IRestaurant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(restaurant);
    return this.http
      .put<IRestaurant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(): Observable<EntityResponseType> {
    return this.http
      .get<IRestaurant>(`${this.resourceUrl}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findCurrency(): Observable<EntityResponseCurrencyType> {
    return this.http.get<CurrencyForLocalizedCurrencyPipe>(`${this.resourceUrlForCurrency}`, { observe: 'response' });
  }
  //    find(): Observable<EntityResponseType> {
  //        return this.http.get<Restaurant>(this.resourceUrl, { observe: 'response'})
  //            .map((res: EntityResponseType) => this.convertResponse(res));
  //    }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRestaurant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  private convertDateFromClient(restaurant: IRestaurant): IRestaurant {
    const copy: IRestaurant = Object.assign({}, restaurant, {
      licenceDate: restaurant.licenceDate != null && restaurant.licenceDate.isValid() ? restaurant.licenceDate.format(DATE_FORMAT) : null,
      createdDate: restaurant.createdDate != null && restaurant.createdDate.isValid() ? restaurant.createdDate.format(DATE_FORMAT) : null
    });
    return copy;
  }

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
    res.body.licenceDate = res.body.licenceDate != null ? moment(res.body.licenceDate) : null;
    res.body.createdDate = res.body.createdDate != null ? moment(res.body.createdDate) : null;
    return res;
  }

  private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    res.body.forEach((restaurant: IRestaurant) => {
      restaurant.licenceDate = restaurant.licenceDate != null ? moment(restaurant.licenceDate) : null;
      restaurant.createdDate = restaurant.createdDate != null ? moment(restaurant.createdDate) : null;
    });
    return res;
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
//
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { createRequestOption } from '../../../shared';
// import { Restaurant } from '../../../shared/model/restaurant.model';
//
// export type EntityResponseType = HttpResponse<Restaurant>;
//
// @Injectable()
// export class BossRestaurantService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/boss-restaurant';
//
//    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    update(restaurant: Restaurant): Observable<EntityResponseType> {
//        const copy = this.convert(restaurant);
//        return this.http.put<Restaurant>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(): Observable<EntityResponseType> {
//        return this.http.get<Restaurant>(this.resourceUrl, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
////    delete(id: number): Observable<HttpResponse<any>> {
////        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
////    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: Restaurant = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<Restaurant[]>): HttpResponse<Restaurant[]> {
//        const jsonResponse: Restaurant[] = res.body;
//        const body: Restaurant[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Restaurant.
//     */
//    private convertItemFromServer(restaurant: Restaurant): Restaurant {
//        const copy: Restaurant = Object.assign({}, restaurant);
//        copy.licenceDate = this.dateUtils
//            .convertLocalDateFromServer(restaurant.licenceDate);
//        copy.createdDate = this.dateUtils
//            .convertLocalDateFromServer(restaurant.createdDate);
//        return copy;
//    }
//
//    /**
//     * Convert a Restaurant to a JSON which can be sent to the server.
//     */
//    private convert(restaurant: Restaurant): Restaurant {
//        const copy: Restaurant = Object.assign({}, restaurant);
//        copy.licenceDate = this.dateUtils
//            .convertLocalDateToServer(restaurant.licenceDate);
//        copy.createdDate = this.dateUtils
//            .convertLocalDateToServer(restaurant.createdDate);
//        return copy;
//    }
// }
