import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProductOrdered } from 'app/shared/model/product-ordered.model';

type EntityResponseType = HttpResponse<IProductOrdered>;
type EntityArrayResponseType = HttpResponse<IProductOrdered[]>;

@Injectable({ providedIn: 'root' })
export class ProductOrderedService {
  public resourceUrl = SERVER_API_URL + 'api/product-ordereds';

  constructor(protected http: HttpClient) {}

  create(productOrdered: IProductOrdered): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productOrdered);
    return this.http
      .post<IProductOrdered>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productOrdered: IProductOrdered): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productOrdered);
    return this.http
      .put<IProductOrdered>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductOrdered>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductOrdered[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(productOrdered: IProductOrdered): IProductOrdered {
    const copy: IProductOrdered = Object.assign({}, productOrdered, {
      orderedTime: productOrdered.orderedTime != null && productOrdered.orderedTime.isValid() ? productOrdered.orderedTime.toJSON() : null,
      acceptedTime:
        productOrdered.acceptedTime != null && productOrdered.acceptedTime.isValid() ? productOrdered.acceptedTime.toJSON() : null,
      finishedTime:
        productOrdered.finishedTime != null && productOrdered.finishedTime.isValid() ? productOrdered.finishedTime.toJSON() : null,
      takenTime: productOrdered.takenTime != null && productOrdered.takenTime.isValid() ? productOrdered.takenTime.toJSON() : null,
      deliveryDate:
        productOrdered.deliveryDate != null && productOrdered.deliveryDate.isValid()
          ? productOrdered.deliveryDate.format(DATE_FORMAT)
          : null,
      sendTime: productOrdered.sendTime != null && productOrdered.sendTime.isValid() ? productOrdered.sendTime.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.orderedTime = res.body.orderedTime != null ? moment(res.body.orderedTime) : null;
      res.body.acceptedTime = res.body.acceptedTime != null ? moment(res.body.acceptedTime) : null;
      res.body.finishedTime = res.body.finishedTime != null ? moment(res.body.finishedTime) : null;
      res.body.takenTime = res.body.takenTime != null ? moment(res.body.takenTime) : null;
      res.body.deliveryDate = res.body.deliveryDate != null ? moment(res.body.deliveryDate) : null;
      res.body.sendTime = res.body.sendTime != null ? moment(res.body.sendTime) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productOrdered: IProductOrdered) => {
        productOrdered.orderedTime = productOrdered.orderedTime != null ? moment(productOrdered.orderedTime) : null;
        productOrdered.acceptedTime = productOrdered.acceptedTime != null ? moment(productOrdered.acceptedTime) : null;
        productOrdered.finishedTime = productOrdered.finishedTime != null ? moment(productOrdered.finishedTime) : null;
        productOrdered.takenTime = productOrdered.takenTime != null ? moment(productOrdered.takenTime) : null;
        productOrdered.deliveryDate = productOrdered.deliveryDate != null ? moment(productOrdered.deliveryDate) : null;
        productOrdered.sendTime = productOrdered.sendTime != null ? moment(productOrdered.sendTime) : null;
      });
    }
    return res;
  }
}
