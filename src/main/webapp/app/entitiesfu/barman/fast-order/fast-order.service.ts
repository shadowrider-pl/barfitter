import { SERVER_API_URL } from '../../../app.constants';
import { IOrderOpened } from '../../../shared/model/order-opened.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IOrderOpened>;
type EntityArrayResponseType = HttpResponse<IOrderOpened[]>;

@Injectable({ providedIn: 'root' })
export class FastOrderService {
  private resourceUrl = SERVER_API_URL + 'api/fast-order';

  constructor(private http: HttpClient) {}

  create(orderOpened: IOrderOpened): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderOpened);
    return this.http
      .post<IOrderOpened>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
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
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
//
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { OrderOpened } from '../new-order/new-order.model';
//
// export type EntityResponseType = HttpResponse<OrderOpened>;
//
// @Injectable()
// export class FastOrderService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/fast-order';
////    private resourceSearchUrl = SERVER_API_URL + 'api/_search/order-whith-products';
//
//    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    create(orderOpened: OrderOpened): Observable<EntityResponseType> {
//        const copy = this.convert(orderOpened);
//        return this.http.post<OrderOpened>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
////    update(orderOpened: OrderOpened): Observable<OrderOpened> {
////        const copy = this.convert(orderOpened);
////        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
////            const jsonResponse = res.json();
////            return this.convertItemFromServer(jsonResponse);
////        });
////    }
////
////    find(id: number): Observable<OrderOpened> {
////        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
////            const jsonResponse = res.json();
////            return this.convertItemFromServer(jsonResponse);
////        });
////    }
////
////    query(req?: any): Observable<ResponseWrapper> {
////        const options = createRequestOption(req);
////        return this.http.get(this.resourceUrl, options)
////            .map((res: Response) => this.convertResponse(res));
////    }
////
////    delete(id: number): Observable<Response> {
////        return this.http.delete(`${this.resourceUrl}/${id}`);
////    }
//
////    search(req?: any): Observable<ResponseWrapper> {
////        const options = createRequestOption(req);
////        return this.http.get(this.resourceSearchUrl, options)
////            .map((res: any) => this.convertResponse(res));
////    }
//
////    private convertResponse(res: Response): ResponseWrapper {
////        const jsonResponse = res.json();
////        const result = [];
////        for (let i = 0; i < jsonResponse.length; i++) {
////            result.push(this.convertItemFromServer(jsonResponse[i]));
////        }
////        return new ResponseWrapper(res.headers, result, res.status);
////    }
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
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: OrderOpened = this.convertItemFromServer(res.body);
//        return res.clone({body});
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
