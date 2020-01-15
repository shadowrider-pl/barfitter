import { SERVER_API_URL } from '../../../app.constants';
// import { createRequestOption } from '../../../shared';
import { ICashup } from '../../../shared/model/cashup.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<ICashup>;
type EntityArrayResponseType = HttpResponse<ICashup[]>;

@Injectable({ providedIn: 'root' })
export class TakeCashService {
  private resourceUrl = SERVER_API_URL + 'api/take-cash';

  constructor(private http: HttpClient) {}

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

  query(req?: any): Observable<EntityResponseType> {
    return this.http
      .get<ICashup>(this.resourceUrl, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

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
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { Cashup } from '../../../entities/cashup/cashup.model';
// import { createRequestOption } from '../../../shared';
//
// export type EntityResponseType = HttpResponse<Cashup>;
//
// @Injectable()
// export class TakeCashService {
//
//  private resourceUrl = SERVER_API_URL + 'api/take-cash';
//
//  constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//  update(cashup: Cashup): Observable<EntityResponseType> {
//    const copy = this.convert(cashup);
//    return this.http.put<Cashup>(this.resourceUrl, copy, { observe: 'response' })
//      .map((res: EntityResponseType) => this.convertResponse(res));
//  }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<Cashup>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//  //    query(req?: any): Observable<ResponseWrapper> {
//  //        const options = createRequestOption(req);
//  //        return this.http.get(this.resourceUrl, options)
//  //            .map((res: Response) => this.convertResponse(res));
//  //    }
//
//  query(req?: any): Observable<EntityResponseType> {
//    const options = createRequestOption(req);
//    return this.http.get<Cashup>(this.resourceUrl, { params: options, observe: 'response' })
//      .map((res: HttpResponse<Cashup>) => this.convertResponse(res));
//  }
//
//  private convertResponse(res: EntityResponseType): EntityResponseType {
//    const body: Cashup = this.convertItemFromServer(res.body);
//    return res.clone({ body });
//  }
//
//  private convertArrayResponse(res: HttpResponse<Cashup[]>): HttpResponse<Cashup[]> {
//    const jsonResponse: Cashup[] = res.body;
//    const body: Cashup[] = [];
//    for (let i = 0; i < jsonResponse.length; i++) {
//      body.push(this.convertItemFromServer(jsonResponse[i]));
//    }
//    return res.clone({ body });
//  }
//
//  /**
//   * Convert a returned JSON object to Cashup.
//   */
//  private convertItemFromServer(cashup: Cashup): Cashup {
//    const copy: Cashup = Object.assign({}, cashup);
//    copy.barmanLoginTime = this.dateUtils
//      .convertDateTimeFromServer(cashup.barmanLoginTime);
//    copy.cashupTime = this.dateUtils
//      .convertDateTimeFromServer(cashup.cashupTime);
//    return copy;
//  }
//
//  /**
//   * Convert a Cashup to a JSON which can be sent to the server.
//   */
//  private convert(cashup: Cashup): Cashup {
//    const copy: Cashup = Object.assign({}, cashup);
//
//    copy.barmanLoginTime = this.dateUtils.toDate(cashup.barmanLoginTime);
//
//    copy.cashupTime = this.dateUtils.toDate(cashup.cashupTime);
//    return copy;
//  }
// }
