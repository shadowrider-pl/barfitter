import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProductSold } from 'app/shared/model/product-sold.model';

type EntityResponseType = HttpResponse<IProductSold>;
type EntityArrayResponseType = HttpResponse<IProductSold[]>;

@Injectable({ providedIn: 'root' })
export class ProductSoldService {
  public resourceUrl = SERVER_API_URL + 'api/product-solds';

  constructor(protected http: HttpClient) {}

  create(productSold: IProductSold): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productSold);
    return this.http
      .post<IProductSold>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productSold: IProductSold): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productSold);
    return this.http
      .put<IProductSold>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductSold>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductSold[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(productSold: IProductSold): IProductSold {
    const copy: IProductSold = Object.assign({}, productSold, {
      orderedTime: productSold.orderedTime != null && productSold.orderedTime.isValid() ? productSold.orderedTime.toJSON() : null,
      acceptedTime: productSold.acceptedTime != null && productSold.acceptedTime.isValid() ? productSold.acceptedTime.toJSON() : null,
      finishedTime: productSold.finishedTime != null && productSold.finishedTime.isValid() ? productSold.finishedTime.toJSON() : null,
      takenTime: productSold.takenTime != null && productSold.takenTime.isValid() ? productSold.takenTime.toJSON() : null,
      deliveryDate:
        productSold.deliveryDate != null && productSold.deliveryDate.isValid() ? productSold.deliveryDate.format(DATE_FORMAT) : null,
      sendTime: productSold.sendTime != null && productSold.sendTime.isValid() ? productSold.sendTime.toJSON() : null
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
      res.body.forEach((productSold: IProductSold) => {
        productSold.orderedTime = productSold.orderedTime != null ? moment(productSold.orderedTime) : null;
        productSold.acceptedTime = productSold.acceptedTime != null ? moment(productSold.acceptedTime) : null;
        productSold.finishedTime = productSold.finishedTime != null ? moment(productSold.finishedTime) : null;
        productSold.takenTime = productSold.takenTime != null ? moment(productSold.takenTime) : null;
        productSold.deliveryDate = productSold.deliveryDate != null ? moment(productSold.deliveryDate) : null;
        productSold.sendTime = productSold.sendTime != null ? moment(productSold.sendTime) : null;
      });
    }
    return res;
  }
}
