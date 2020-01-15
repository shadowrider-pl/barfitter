import { SERVER_API_URL } from '../../../app.constants';
import { ICashup } from '../../../shared/model/cashup.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<ICashup>;
type EntityArrayResponseType = HttpResponse<ICashup[]>;

@Injectable({ providedIn: 'root' })
export class BarCashupService {
  private resourceUrl = SERVER_API_URL + 'api/bar-cashups';

  constructor(private http: HttpClient) {}

  //    create(cashup: ICashup): Observable<EntityResponseType> {
  //        const copy = this.convertDateFromClient(cashup);
  //        return this.http
  //            .post<ICashup>(this.resourceUrl, copy, { observe: 'response' })
  //            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  //    }

  update(cashup: ICashup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cashup);
    return this.http
      .put<ICashup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICashup>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  //
  //    query(req?: any): Observable<EntityArrayResponseType> {
  //        const options = createRequestOption(req);
  //        return this.http
  //            .get<ICashup[]>(this.resourceUrl, { params: options, observe: 'response' })
  //            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
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

  //    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
  //        res.body.forEach((cashup: ICashup) => {
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
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { BarCashup } from './bar-cashup.model';
// import { createRequestOption } from '../../../shared';
//
// export type EntityResponseType = HttpResponse<BarCashup>;
//
// @Injectable()
// export class BarCashupService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/bar-cashups';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/bar-cashups';
//
//    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    create(cashup: BarCashup): Observable<EntityResponseType> {
//        const copy = this.convert(cashup);
//        return this.http.post<BarCashup>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(cashup: BarCashup): Observable<EntityResponseType> {
//        const copy = this.convert(cashup);
//        return this.http.put<BarCashup>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<BarCashup>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<BarCashup[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<BarCashup[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<BarCashup[]>) => this.convertArrayResponse(res));
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
//
//    search(req?: any): Observable<HttpResponse<BarCashup[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<BarCashup[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<BarCashup[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: BarCashup = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<BarCashup[]>): HttpResponse<BarCashup[]> {
//        const jsonResponse: BarCashup[] = res.body;
//        const body: BarCashup[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to BarCashup.
//     */
//    private convertItemFromServer(cashup: BarCashup): BarCashup {
//        const copy: BarCashup = Object.assign({}, cashup);
//        copy.barmanLoginTime = this.dateUtils
//            .convertDateTimeFromServer(cashup.barmanLoginTime);
//        copy.cashupTime = this.dateUtils
//            .convertDateTimeFromServer(cashup.cashupTime);
//        return copy;
//    }
//
//    /**
//     * Convert a BarCashup to a JSON which can be sent to the server.
//     */
//    private convert(cashup: BarCashup): BarCashup {
//        const copy: BarCashup = Object.assign({}, cashup);
//
//        copy.barmanLoginTime = this.dateUtils.toDate(cashup.barmanLoginTime);
//
//        copy.cashupTime = this.dateUtils.toDate(cashup.cashupTime);
//        return copy;
//    }
////    /**
////     * Convert a returned JSON object to BarCashup.
////     */
////    private convertItemFromServer(json: any): BarCashup {
////        const entity: BarCashup = Object.assign(new BarCashup(), json);
////        return entity;
////    }
////
////    /**
////     * Convert a BarCashup to a JSON which can be sent to the server.
////     */
////    private convert(barCashup: BarCashup): BarCashup {
////        const copy: BarCashup = Object.assign({}, barCashup);
////        return copy;
////    }
// }
