import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICashup } from 'app/shared/model/cashup.model';

type EntityResponseType = HttpResponse<ICashup>;
type EntityArrayResponseType = HttpResponse<ICashup[]>;

@Injectable({ providedIn: 'root' })
export class MonthlyReportToDropdownService {
  private resourceUrl = SERVER_API_URL + 'api/monthly-report-to-dropdown';

  constructor(private http: HttpClient) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICashup[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
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
// import { Cashup } from '../../../entities/cashup/cashup.model';
//
// import { createRequestOption } from '../../../shared';
//
// export type EntityResponseToDropdownType = HttpResponse<Cashup>;
//
// @Injectable()
// export class MonthlyReportToDropdownService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/monthly-report-to-dropdown';
////    private resourceSearchUrl = SERVER_API_URL + 'api/_search/ProductAnalyzed';
//
//    constructor(private http: HttpClient) { }
//
////    find(id: number): Observable<EntityResponseType> {
////        return this.http.get<Cashup>(`${this.resourceUrl}/${id}`, { observe: 'response'})
////            .map((res: EntityResponseType) => this.convertResponse(res));
////    }
//
//    query(req?: any): Observable<HttpResponse<Cashup[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Cashup[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Cashup[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertArrayResponse(res: HttpResponse<Cashup[]>): HttpResponse<Cashup[]> {
//        const jsonResponse: Cashup[] = res.body;
//        const body: Cashup[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to ProductAnalyzed.
//     */
//    private convertItemFromServer(productAnalyzed: Cashup): Cashup {
//        const copy: Cashup = Object.assign({}, productAnalyzed);
//        return copy;
//    }
//
// }
