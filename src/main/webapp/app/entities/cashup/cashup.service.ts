import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICashup } from 'app/shared/model/cashup.model';

type EntityResponseType = HttpResponse<ICashup>;
type EntityArrayResponseType = HttpResponse<ICashup[]>;

@Injectable({ providedIn: 'root' })
export class CashupService {
  public resourceUrl = SERVER_API_URL + 'api/cashups';

  constructor(protected http: HttpClient) {}

  create(cashup: ICashup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cashup);
    return this.http
      .post<ICashup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

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

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICashup[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(cashup: ICashup): ICashup {
    const copy: ICashup = Object.assign({}, cashup, {
      barmanLoginTime: cashup.barmanLoginTime != null && cashup.barmanLoginTime.isValid() ? cashup.barmanLoginTime.toJSON() : null,
      cashupTime: cashup.cashupTime != null && cashup.cashupTime.isValid() ? cashup.cashupTime.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.barmanLoginTime = res.body.barmanLoginTime != null ? moment(res.body.barmanLoginTime) : null;
      res.body.cashupTime = res.body.cashupTime != null ? moment(res.body.cashupTime) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((cashup: ICashup) => {
        cashup.barmanLoginTime = cashup.barmanLoginTime != null ? moment(cashup.barmanLoginTime) : null;
        cashup.cashupTime = cashup.cashupTime != null ? moment(cashup.cashupTime) : null;
      });
    }
    return res;
  }
}
