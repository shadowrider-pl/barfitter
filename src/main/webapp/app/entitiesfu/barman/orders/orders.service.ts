import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IOrderOpened } from '../../../shared/model/order-opened.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IOrderOpened>;
type EntityArrayResponseType = HttpResponse<IOrderOpened[]>;

@Injectable({ providedIn: 'root' })
export class OrderOpenedService {
  private resourceUrl = SERVER_API_URL + 'api/active-orders-opened';

  constructor(private http: HttpClient) {}

  create(orderOpened: IOrderOpened): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderOpened);
    return this.http
      .post<IOrderOpened>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(orderOpened: IOrderOpened): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderOpened);
    return this.http
      .put<IOrderOpened>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrderOpened>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrderOpened[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  private convertDateFromClient(orderOpened: IOrderOpened): IOrderOpened {
    const copy: IOrderOpened = Object.assign({}, orderOpened, {
      openingTime: orderOpened.openingTime != null && orderOpened.openingTime.isValid() ? orderOpened.openingTime.toJSON() : null,
      closingTime: orderOpened.closingTime != null && orderOpened.closingTime.isValid() ? orderOpened.closingTime.toJSON() : null
    });
    return copy;
  }

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
    res.body.openingTime = res.body.openingTime != null ? moment(res.body.openingTime) : null;
    res.body.closingTime = res.body.closingTime != null ? moment(res.body.closingTime) : null;
    return res;
  }

  private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    res.body.forEach((orderOpened: IOrderOpened) => {
      orderOpened.openingTime = orderOpened.openingTime != null ? moment(orderOpened.openingTime) : null;
      orderOpened.closingTime = orderOpened.closingTime != null ? moment(orderOpened.closingTime) : null;
    });
    return res;
  }
}
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
//
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { OrderOpened } from '../../../entities/order-opened/order-opened.model';
// import { createRequestOption } from '../../../shared';
//
// export type EntityResponseType = HttpResponse<OrderOpened>;
//
// @Injectable()
// export class OrderOpenedService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/active-orders-opened';
////    private resourceSearchUrl = SERVER_API_URL + 'api/_search/order-openeds';
//
//    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    create(orderOpened: OrderOpened): Observable<EntityResponseType> {
//        const copy = this.convert(orderOpened);
//        return this.http.post<OrderOpened>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(orderOpened: OrderOpened): Observable<EntityResponseType> {
//        const copy = this.convert(orderOpened);
//        return this.http.put<OrderOpened>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<OrderOpened>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<OrderOpened[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<OrderOpened[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<OrderOpened[]>) => this.convertArrayResponse(res));
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: OrderOpened = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<OrderOpened[]>): HttpResponse<OrderOpened[]> {
//        const jsonResponse: OrderOpened[] = res.body;
//        const body: OrderOpened[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to OrderOpened.
//     */
//    private convertItemFromServer(orderOpened: OrderOpened): OrderOpened {
//        const copy: OrderOpened = Object.assign({}, orderOpened);
//        copy.openingTime = this.dateUtils
//            .convertDateTimeFromServer(orderOpened.openingTime);
//        copy.closingTime = this.dateUtils
//            .convertDateTimeFromServer(orderOpened.closingTime);
//        return copy;
//    }
//
//    /**
//     * Convert a OrderOpened to a JSON which can be sent to the server.
//     */
//    private convert(orderOpened: OrderOpened): OrderOpened {
//        const copy: OrderOpened = Object.assign({}, orderOpened);
//
//        copy.openingTime = this.dateUtils.toDate(orderOpened.openingTime);
//
//        copy.closingTime = this.dateUtils.toDate(orderOpened.closingTime);
//        return copy;
//    }
// }
