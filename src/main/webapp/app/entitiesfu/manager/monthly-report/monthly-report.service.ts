import { CashupWithPayments } from './';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICashup } from 'app/shared/model/cashup.model';

type EntityResponseType = HttpResponse<CashupWithPayments>;
type EntityArrayResponseType = HttpResponse<CashupWithPayments[]>;

@Injectable({ providedIn: 'root' })
export class MonthlyReportService {
  private resourceUrl = SERVER_API_URL + 'api/monthly-report';
  private resourceCashupUrl = SERVER_API_URL + 'api/monthly-report/cashup';

  constructor(private http: HttpClient) {}

  //    find(id: number): Observable<EntityArrayResponseType> {
  //        return this.http
  //            .get<CashupWithPayments>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  //    }

  find(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<CashupWithPayments[]>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<CashupWithPayments[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findCashup(id: number): Observable<EntityResponseType> {
    return this.http.get<CashupWithPayments>(`${this.resourceCashupUrl}/${id}`, { observe: 'response' });
  }

  //    private convertDateFromClient(cashup: ICashup): ICashup {
  //        const copy: ICashup = Object.assign({}, cashup, {
  //            barmanLoginTime: cashup.barmanLoginTime != null && cashup.barmanLoginTime.isValid() ? cashup.barmanLoginTime.toJSON() : null,
  //            cashupTime: cashup.cashupTime != null && cashup.cashupTime.isValid() ? cashup.cashupTime.toJSON() : null
  //        });
  //        return copy;
  //    }
  //
  //    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
  //        res.body.barmanLoginTime = res.body.barmanLoginTime != null ? moment(res.body.barmanLoginTime) : null;
  //        res.body.cashupTime = res.body.cashupTime != null ? moment(res.body.cashupTime) : null;
  //        return res;
  //    }

  //    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
  //        res.body.forEach((cashup: CashupWithPayments) => {
  //            cashup.barmanLoginTime = cashup.barmanLoginTime != null ? moment(cashup.barmanLoginTime) : null;
  //            cashup.cashupTime = cashup.cashupTime != null ? moment(cashup.cashupTime) : null;
  //        });
  //        return res;
  //    }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
//
// import { CashupWithPayments } from './cashup-with-payments.model';
// import { createRequestOption } from '../../../shared';
//
// export type EntityResponseType = HttpResponse<CashupWithPayments>;
//
// @Injectable()
// export class MonthlyReportService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/monthly-report';
//    private resourceCashupUrl =  SERVER_API_URL + 'api/monthly-report/cashup';
////    private resourceSearchUrl = SERVER_API_URL + 'api/_search/ProductAnalyzed';
//
//    constructor(private http: HttpClient) { }
//
//    find(id: number, req?: any): Observable<HttpResponse<CashupWithPayments[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<CashupWithPayments[]>(`${this.resourceUrl}/${id}`, { params: options, observe: 'response' })
//            .map((res: HttpResponse<CashupWithPayments[]>) => this.convertArrayResponse(res));
//    }
//
//    findCashup(id: number): Observable<EntityResponseType> {
//        return this.http.get<CashupWithPayments>(`${this.resourceCashupUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<CashupWithPayments[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<CashupWithPayments[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<CashupWithPayments[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: CashupWithPayments = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<CashupWithPayments[]>): HttpResponse<CashupWithPayments[]> {
//        const jsonResponse: CashupWithPayments[] = res.body;
//        const body: CashupWithPayments[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to ProductAnalyzed.
//     */
//    private convertItemFromServer(productAnalyzed: CashupWithPayments): CashupWithPayments {
//        const copy: CashupWithPayments = Object.assign({}, productAnalyzed);
//        return copy;
//    }
//
//    /**
//     * Convert a ProductAnalyzed to a JSON which can be sent to the server.
//     */
//    private convert(productAnalyzed: CashupWithPayments): CashupWithPayments {
//        const copy: CashupWithPayments = Object.assign({}, productAnalyzed);
//        return copy;
//    }
// }
