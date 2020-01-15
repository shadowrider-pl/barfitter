import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IOrderClosed } from '../../../shared/model/order-closed.model';
import { ProductSold } from '../../../shared/model/product-sold.model';
import { TodaysOrders } from './';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<TodaysOrders>;
type EntityProductSoldResponseType = HttpResponse<ProductSold>;
type EntityArrayResponseType = HttpResponse<TodaysOrders[]>;

@Injectable({ providedIn: 'root' })
export class TodaysOrdersService {
  private resourceUrl = SERVER_API_URL + 'api/todays-orders';

  constructor(private http: HttpClient) {}

  //    create(orderClosed: IOrderClosed): Observable<EntityResponseType> {
  //        const copy = this.convertDateFromClient(orderClosed);
  //        return this.http
  //            .post<IOrderClosed>(this.resourceUrl, copy, { observe: 'response' })
  //            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  //    }
  //
  update(orderClosed: IOrderClosed): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderClosed);
    return this.http
      .put<IOrderClosed>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrderClosed>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findProduct(id: number): Observable<EntityProductSoldResponseType> {
    return this.http
      .get<IOrderClosed>(`${this.resourceUrl}/product/${id}`, { observe: 'response' })
      .pipe(map((res: EntityProductSoldResponseType) => this.convertProductSoldDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrderClosed[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  private convertDateFromClient(orderClosed: IOrderClosed): IOrderClosed {
    const copy: IOrderClosed = Object.assign({}, orderClosed, {
      openingTime: orderClosed.openingTime != null && orderClosed.openingTime.isValid() ? orderClosed.openingTime.toJSON() : null,
      closingTime: orderClosed.closingTime != null && orderClosed.closingTime.isValid() ? orderClosed.closingTime.toJSON() : null
    });
    return copy;
  }

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
    res.body.openingTime = res.body.openingTime != null ? moment(res.body.openingTime) : null;
    res.body.closingTime = res.body.closingTime != null ? moment(res.body.closingTime) : null;
    return res;
  }

  private convertProductSoldDateFromServer(res: EntityProductSoldResponseType): EntityProductSoldResponseType {
    res.body.orderedTime = res.body.orderedTime != null ? moment(res.body.orderedTime) : null;
    res.body.acceptedTime = res.body.acceptedTime != null ? moment(res.body.acceptedTime) : null;
    res.body.finishedTime = res.body.finishedTime != null ? moment(res.body.finishedTime) : null;
    res.body.takenTime = res.body.takenTime != null ? moment(res.body.takenTime) : null;
    res.body.deliveryDate = res.body.deliveryDate != null ? moment(res.body.deliveryDate) : null;
    res.body.sendTime = res.body.sendTime != null ? moment(res.body.sendTime) : null;
    return res;
  }

  private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    res.body.forEach((orderClosed: IOrderClosed) => {
      orderClosed.openingTime = orderClosed.openingTime != null ? moment(orderClosed.openingTime) : null;
      orderClosed.closingTime = orderClosed.closingTime != null ? moment(orderClosed.closingTime) : null;
    });
    return res;
  }
}
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
// import { JhiDateUtils } from 'ng-jhipster';
// import { DatePipe } from '@angular/common';
//
// import { TodaysOrders } from './todays-orders.model';
//// import { OrderClosed } from '../../../entities/order-closed/order-closed.model';
// import { createRequestOption } from '../../../shared';
// import { ProductSold } from '../../../entities/product-sold';
//
// export type EntityResponseType = HttpResponse<TodaysOrders>;
// export type EntityProductSoldResponseType = HttpResponse<ProductSold>;
//
// @Injectable()
// export class TodaysOrdersService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/todays-orders';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/todays-orders';
//
//    constructor(private datePipe: DatePipe, private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    create(todaysOrders: TodaysOrders): Observable<EntityResponseType> {
//        const copy = this.convert(todaysOrders);
//        return this.http.post<TodaysOrders>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(todaysOrders: TodaysOrders): Observable<EntityResponseType> {
//        const copy = this.convert(todaysOrders);
//        return this.http.put<TodaysOrders>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<TodaysOrders>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    findProduct(id: number): Observable<EntityProductSoldResponseType> {
//        return this.http.get(`${this.resourceUrl}/product/${id}`, { observe: 'response'})
//          .map((res: EntityProductSoldResponseType) => this.convertProductSoldResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<TodaysOrders[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<TodaysOrders[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<TodaysOrders[]>) => this.convertArrayResponse(res));
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
////
////    search(req?: any): Observable<ResponseWrapper> {
////        const options = createRequestOption(req);
////        return this.http.get(this.resourceSearchUrl, options)
////            .map((res: any) => this.convertResponse(res));
////    }
//
//     private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: TodaysOrders = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//     private convertProductSoldResponse(res: EntityResponseType): EntityResponseType {
//        const body: ProductSold = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<TodaysOrders[]>): HttpResponse<TodaysOrders[]> {
//        const jsonResponse: TodaysOrders[] = res.body;
//        const body: TodaysOrders[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to TodaysOrders.
//     */
//    private convertProductSoldFromServer(productSold: ProductSold): ProductSold {
//        const copy: ProductSold = Object.assign({}, productSold);
//
//        copy.orderedTime = this.dateUtils.toDate(productSold.orderedTime);
//
//        copy.acceptedTime = this.dateUtils.toDate(productSold.acceptedTime);
//
//        copy.finishedTime = this.dateUtils.toDate(productSold.finishedTime);
//
//        copy.takenTime = this.dateUtils.toDate(productSold.takenTime);
//        copy.deliveryDate = this.dateUtils
//            .convertLocalDateToServer(productSold.deliveryDate);
//
//        copy.sendTime = this.dateUtils.toDate(productSold.sendTime);
//        return copy;
//    }
//
//    /**
//     * Convert a returned JSON object to TodaysOrders.
//     */
//    private convertItemFromServer(todaysOrders: TodaysOrders): TodaysOrders {
//        const copy: TodaysOrders = Object.assign({}, todaysOrders);
//        copy.openingTime = this.dateUtils
//            .convertDateTimeFromServer(todaysOrders.openingTime);
//        copy.closingTime = this.dateUtils
//            .convertDateTimeFromServer(todaysOrders.closingTime);
//        return copy;
//    }
//
//    /**
//     * Convert a TodaysOrders to a JSON which can be sent to the server.
//     */
//    private convert(todaysOrders: TodaysOrders): TodaysOrders {
//        const copy: TodaysOrders = Object.assign({}, todaysOrders);
//        todaysOrders.openingTime = this.datePipe
//                            .transform(todaysOrders.openingTime, 'yyyy-MM-ddTHH:mm:ss');
//        todaysOrders.closingTime = this.datePipe
//                            .transform(todaysOrders.closingTime, 'yyyy-MM-ddTHH:mm:ss');
//
//        copy.openingTime = this.dateUtils.toDate(todaysOrders.openingTime);
//
//        copy.closingTime = this.dateUtils.toDate(todaysOrders.closingTime);
//        return copy;
//    }
// }
