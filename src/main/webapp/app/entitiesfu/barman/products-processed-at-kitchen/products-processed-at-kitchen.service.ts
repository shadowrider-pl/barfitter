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
export class ProductsProcessedAtKitchenService {
  private resourceUrl = SERVER_API_URL + 'api/products-processed-at-kitchen';

  constructor(private http: HttpClient) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrderOpened[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    res.body.forEach((orderOpened: IOrderOpened) => {
      orderOpened.openingTime = orderOpened.openingTime != null ? moment(orderOpened.openingTime) : null;
      orderOpened.closingTime = orderOpened.closingTime != null ? moment(orderOpened.closingTime) : null;
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
// import { OrderOpened } from '../../../entities/order-opened/order-opened.model';
// import { createRequestOption } from '../../../shared';
//
// @Injectable()
// export class ProductsProcessedAtKitchenService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/products-processed-at-kitchen';
////    private resourceSearchUrl = SERVER_API_URL + 'api/_search/order-openeds';
//
//    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    query(req?: any): Observable<HttpResponse<OrderOpened[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<OrderOpened[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<OrderOpened[]>) => this.convertArrayResponse(res));
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
// }
