import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICashup } from '../../../shared/model/cashup.model';
import { OrderClosedWithProducts } from '../../models/order-closed-with-products.model';
import { DailyOrdersReport } from './daily-orders-report.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<ICashup>;
type EntityOrderClosedWithProductsResponseType = HttpResponse<OrderClosedWithProducts>;
type EntityArrayResponseType = HttpResponse<ICashup[]>;
type EntityDailyOrdersReportArrayResponseType = HttpResponse<DailyOrdersReport[]>;
type EntityOrderClosedWithProductsArrayResponseType = HttpResponse<OrderClosedWithProducts[]>;

@Injectable({ providedIn: 'root' })
export class DailyOrdersReportService {
  private resourceUrl = SERVER_API_URL + 'api/daily-orders-report';
  private resourceCashupUrl = SERVER_API_URL + 'api/daily-orders-report/cashups';
  private resourceOrderUrl = SERVER_API_URL + 'api/daily-orders-report/order';

  constructor(private http: HttpClient) {}

  findCashup(id: number): Observable<EntityOrderClosedWithProductsArrayResponseType> {
    return this.http.get<OrderClosedWithProducts[]>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findOrder(id: number): Observable<EntityOrderClosedWithProductsResponseType> {
    return this.http.get<DailyOrdersReport>(`${this.resourceOrderUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityDailyOrdersReportArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<DailyOrdersReport[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
  queryCashups(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICashup[]>(this.resourceCashupUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  //    findProduct(id: number): Observable<EntityProductSoldResponseType> {
  //        return this.http.get(`${this.resourceUrl}/product/${id}`, { observe: 'response'})
  //          .map((res: EntityProductSoldResponseType) => this.convertProductSoldResponse(res));
  //    }

  //    findCashup(id: number): Observable<HttpResponse<OrderClosedWithProducts[]>> {
  //        return this.http.get<OrderClosedWithProducts[]>(`${this.resourceUrl}/${id}`, { observe: 'response' })
  //            .map((res: HttpResponse<OrderClosedWithProducts[]>) => this.convertArrayResponse(res));
  //    }
  //
  //    delete(id: number): Observable<HttpResponse<any>> {
  //        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  //    }

  private convertDateFromClient(cashup: ICashup): ICashup {
    const copy: ICashup = Object.assign({}, cashup, {
      barmanLoginTime: cashup.barmanLoginTime != null && cashup.barmanLoginTime.isValid() ? cashup.barmanLoginTime.toJSON() : null,
      cashupTime: cashup.cashupTime != null && cashup.cashupTime.isValid() ? cashup.cashupTime.toJSON() : null
    });
    return copy;
  }

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
    res.body.barmanLoginTime = res.body.barmanLoginTime != null ? moment(res.body.barmanLoginTime) : null;
    res.body.cashupTime = res.body.cashupTime != null ? moment(res.body.cashupTime) : null;
    return res;
  }

  private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    res.body.forEach((cashup: ICashup) => {
      cashup.barmanLoginTime = cashup.barmanLoginTime != null ? moment(cashup.barmanLoginTime) : null;
      cashup.cashupTime = cashup.cashupTime != null ? moment(cashup.cashupTime) : null;
    });
    return res;
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
// import { Cashup } from '../../../entities/cashup/cashup.model';
// import { ProductSold } from '../../../entities/product-sold';
//
// import { DailyOrdersReport } from './daily-orders-report.model';
// import { createRequestOption } from '../../../shared';
// import { OrderClosedWithProducts } from '../../models/order-closed-with-products.model';
// import { JhiDateUtils } from 'ng-jhipster';
// import { DatePipe } from '@angular/common';
//
// export type EntityResponseType = HttpResponse<OrderClosedWithProducts>;
// export type EntityProductSoldResponseType = HttpResponse<ProductSold>;
// export type EntityCashupResponseType = HttpResponse<Cashup>;
//
// @Injectable()
// export class DailyOrdersReportService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/daily-orders-report';
//    private resourceCashupUrl =  SERVER_API_URL + 'api/daily-orders-report/cashups';
//    private resourceOrderUrl =  SERVER_API_URL + 'api/daily-orders-report/order';
//
//        constructor(private datePipe: DatePipe, private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    queryCashups(req?: any): Observable<HttpResponse<Cashup[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Cashup[]>(this.resourceCashupUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Cashup[]>) => this.convertCashupArrayResponse(res));
//    }
//
//    findProduct(id: number): Observable<EntityProductSoldResponseType> {
//        return this.http.get(`${this.resourceUrl}/product/${id}`, { observe: 'response'})
//          .map((res: EntityProductSoldResponseType) => this.convertProductSoldResponse(res));
//    }
//
//    findCashup(id: number): Observable<HttpResponse<OrderClosedWithProducts[]>> {
//        return this.http.get<OrderClosedWithProducts[]>(`${this.resourceUrl}/${id}`, { observe: 'response' })
//            .map((res: HttpResponse<OrderClosedWithProducts[]>) => this.convertArrayResponse(res));
//    }
//
//    create(dailyOrdersReport: DailyOrdersReport): Observable<EntityResponseType> {
//        const copy = this.convert(dailyOrdersReport);
//        return this.http.post<DailyOrdersReport>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(dailyOrdersReport: DailyOrdersReport): Observable<EntityResponseType> {
//        const copy = this.convert(dailyOrdersReport);
//        return this.http.put<DailyOrdersReport>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    findOrder(id: number): Observable<EntityResponseType> {
//        return this.http.get<DailyOrdersReport>(`${this.resourceOrderUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<DailyOrdersReport>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<DailyOrdersReport[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<DailyOrdersReport[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<DailyOrdersReport[]>) => this.convertArrayResponse(res));
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: DailyOrdersReport = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<DailyOrdersReport[]>): HttpResponse<DailyOrdersReport[]> {
//        const jsonResponse: DailyOrdersReport[] = res.body;
//        const body: DailyOrdersReport[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to DailyOrdersReport.
//     */
//    private convertItemFromServer(dailyOrdersReport: DailyOrdersReport): DailyOrdersReport {
//        const copy: DailyOrdersReport = Object.assign({}, dailyOrdersReport);
//        return copy;
//    }
//
//    /**
//     * Convert a DailyOrdersReport to a JSON which can be sent to the server.
//     */
//    private convert(dailyOrdersReport: DailyOrdersReport): DailyOrdersReport {
//        const copy: DailyOrdersReport = Object.assign({}, dailyOrdersReport);
//        return copy;
//    }
//    private convertCashupArrayResponse(res: HttpResponse<Cashup[]>): HttpResponse<Cashup[]> {
//        const jsonResponse: Cashup[] = res.body;
//        const body: Cashup[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertCashupFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Cashup.
//     */
//    private convertCashupFromServer(cashup: Cashup): Cashup {
//        const copy: Cashup = Object.assign({}, cashup);
//        copy.barmanLoginTime = this.dateUtils
//            .convertDateTimeFromServer(cashup.barmanLoginTime);
//        copy.cashupTime = this.dateUtils
//            .convertDateTimeFromServer(cashup.cashupTime);
//        return copy;
//    }
//
//     private convertProductSoldResponse(res: EntityResponseType): EntityResponseType {
//        const body: ProductSold = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
// }
