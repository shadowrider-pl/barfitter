import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProductDelivered } from 'app/shared/model/product-delivered.model';

type EntityResponseType = HttpResponse<IProductDelivered>;
type EntityArrayResponseType = HttpResponse<IProductDelivered[]>;

@Injectable({ providedIn: 'root' })
export class ProductDeliveredService {
  public resourceUrl = SERVER_API_URL + 'api/product-delivereds';

  constructor(protected http: HttpClient) {}

  create(productDelivered: IProductDelivered): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productDelivered);
    return this.http
      .post<IProductDelivered>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productDelivered: IProductDelivered): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productDelivered);
    return this.http
      .put<IProductDelivered>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductDelivered>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductDelivered[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(productDelivered: IProductDelivered): IProductDelivered {
    const copy: IProductDelivered = Object.assign({}, productDelivered, {
      deliveryDate:
        productDelivered.deliveryDate != null && productDelivered.deliveryDate.isValid()
          ? productDelivered.deliveryDate.format(DATE_FORMAT)
          : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.deliveryDate = res.body.deliveryDate != null ? moment(res.body.deliveryDate) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productDelivered: IProductDelivered) => {
        productDelivered.deliveryDate = productDelivered.deliveryDate != null ? moment(productDelivered.deliveryDate) : null;
      });
    }
    return res;
  }
}
