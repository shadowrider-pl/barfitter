import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IOrderClosed } from 'app/shared/model/order-closed.model';

type EntityResponseType = HttpResponse<IOrderClosed>;
type EntityArrayResponseType = HttpResponse<IOrderClosed[]>;

@Injectable({ providedIn: 'root' })
export class OrderClosedService {
  public resourceUrl = SERVER_API_URL + 'api/order-closeds';

  constructor(protected http: HttpClient) {}

  create(orderClosed: IOrderClosed): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderClosed);
    return this.http
      .post<IOrderClosed>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

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

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrderClosed[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(orderClosed: IOrderClosed): IOrderClosed {
    const copy: IOrderClosed = Object.assign({}, orderClosed, {
      openingTime: orderClosed.openingTime != null && orderClosed.openingTime.isValid() ? orderClosed.openingTime.toJSON() : null,
      closingTime: orderClosed.closingTime != null && orderClosed.closingTime.isValid() ? orderClosed.closingTime.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.openingTime = res.body.openingTime != null ? moment(res.body.openingTime) : null;
      res.body.closingTime = res.body.closingTime != null ? moment(res.body.closingTime) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((orderClosed: IOrderClosed) => {
        orderClosed.openingTime = orderClosed.openingTime != null ? moment(orderClosed.openingTime) : null;
        orderClosed.closingTime = orderClosed.closingTime != null ? moment(orderClosed.closingTime) : null;
      });
    }
    return res;
  }
}
