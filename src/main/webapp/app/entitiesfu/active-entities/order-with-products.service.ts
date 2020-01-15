import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { OrderWithProducts } from '../models/order-opened-with-products.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<OrderWithProducts>;
type EntityArrayResponseType = HttpResponse<OrderWithProducts[]>;

@Injectable({ providedIn: 'root' })
export class OrderWithProductsService {
  private resourceUrl = SERVER_API_URL + 'api/order-opened-with-products';

  constructor(private http: HttpClient) {}

  create(orderOpened: OrderWithProducts): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderOpened);
    return this.http
      .post<OrderWithProducts>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(orderOpened: OrderWithProducts): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderOpened);
    return this.http
      .put<OrderWithProducts>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<OrderWithProducts>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<OrderWithProducts[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  private convertDateFromClient(orderOpened: OrderWithProducts): OrderWithProducts {
    const copy: OrderWithProducts = Object.assign({}, orderOpened, {
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
    res.body.forEach((orderOpened: OrderWithProducts) => {
      orderOpened.openingTime = orderOpened.openingTime != null ? moment(orderOpened.openingTime) : null;
      orderOpened.closingTime = orderOpened.closingTime != null ? moment(orderOpened.closingTime) : null;
    });
    return res;
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../app.constants';
//
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { OrderWithProducts } from '../models/order-opened-with-products.model';
// import { createRequestOption } from '../../shared';
//
// export type EntityResponseType = HttpResponse<OrderWithProducts>;
//
// @Injectable()
// export class OrderWithProductsService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/order-opened-with-products';
////    private resourceSearchUrl = SERVER_API_URL + 'api/_search/order-openeds';
//
//    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    create(orderWithProducts: OrderWithProducts): Observable<EntityResponseType> {
//        const copy = this.convert(orderWithProducts);
//        return this.http.post<OrderWithProducts>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(orderWithProducts: OrderWithProducts): Observable<EntityResponseType> {
//        const copy = this.convert(orderWithProducts);
//        return this.http.put<OrderWithProducts>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<OrderWithProducts>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<OrderWithProducts[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<OrderWithProducts[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<OrderWithProducts[]>) => this.convertArrayResponse(res));
//    }
////
////    delete(id: number): Observable<Response> {
////        return this.http.delete(`${this.resourceUrl}/${id}`);
////    }
////
////    search(req?: any): Observable<ResponseWrapper> {
////        const options = createRequestOption(req);
////        return this.http.get(this.resourceSearchUrl, options)
////            .map((res: any) => this.convertResponse(res));
////    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: OrderWithProducts = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//   private convertArrayResponse(res: HttpResponse<OrderWithProducts[]>): HttpResponse<OrderWithProducts[]> {
//        const jsonResponse: OrderWithProducts[] = res.body;
//        const body: OrderWithProducts[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to OrderWithProducts.
//     */
//    private convertItemFromServer(orderWithProducts: OrderWithProducts): OrderWithProducts {
//        const copy: OrderWithProducts = Object.assign({}, orderWithProducts);
//        copy.openingTime = this.dateUtils
//            .convertDateTimeFromServer(orderWithProducts.openingTime);
//        copy.closingTime = this.dateUtils
//            .convertDateTimeFromServer(orderWithProducts.closingTime);
//        return copy;
//    }
//
//    /**
//     * Convert a OrderWithProducts to a JSON which can be sent to the server.
//     */
//    private convert(orderWithProducts: OrderWithProducts): OrderWithProducts {
//        const copy: OrderWithProducts = Object.assign({}, orderWithProducts);
//
//        copy.openingTime = this.dateUtils.toDate(orderWithProducts.openingTime);
//
//        copy.closingTime = this.dateUtils.toDate(orderWithProducts.closingTime);
//        return copy;
//    }
// }
