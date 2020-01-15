import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProductOnStock } from 'app/shared/model/product-on-stock.model';

type EntityResponseType = HttpResponse<IProductOnStock>;
type EntityArrayResponseType = HttpResponse<IProductOnStock[]>;

@Injectable({ providedIn: 'root' })
export class ProductOnStockService {
  public resourceUrl = SERVER_API_URL + 'api/product-on-stocks';

  constructor(protected http: HttpClient) {}

  create(productOnStock: IProductOnStock): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productOnStock);
    return this.http
      .post<IProductOnStock>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productOnStock: IProductOnStock): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productOnStock);
    return this.http
      .put<IProductOnStock>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductOnStock>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductOnStock[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(productOnStock: IProductOnStock): IProductOnStock {
    const copy: IProductOnStock = Object.assign({}, productOnStock, {
      deliveryDate:
        productOnStock.deliveryDate != null && productOnStock.deliveryDate.isValid()
          ? productOnStock.deliveryDate.format(DATE_FORMAT)
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
      res.body.forEach((productOnStock: IProductOnStock) => {
        productOnStock.deliveryDate = productOnStock.deliveryDate != null ? moment(productOnStock.deliveryDate) : null;
      });
    }
    return res;
  }
}
