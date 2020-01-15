import { SERVER_API_URL } from '../../../app.constants';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProductOnStock } from '../../../shared/model/product-on-stock.model';
import { IProductSold } from '../../../shared/model/product-sold.model';
import { IProduct, Product } from '../../../shared/model/product.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IProductOnStock>;
type EntityArrayResponseType = HttpResponse<IProductOnStock[]>;
type EntityProductResponseType = HttpResponse<IProduct>;
type EntityProductArrayResponseType = HttpResponse<IProduct[]>;
type EntityProductSoldResponseType = HttpResponse<IProductSold>;

@Injectable({ providedIn: 'root' })
export class StockService {
  private resourceUrl = SERVER_API_URL + 'api/stock';
  private resourceOutOfStockUrl = SERVER_API_URL + 'api/stock/out-of-stock';
  private resourceProductSoldUrl = SERVER_API_URL + 'api/stock/product-sold';

  constructor(private http: HttpClient) {}

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

  findProductSold(id: number): Observable<EntityProductSoldResponseType> {
    return this.http
      .get<IProductSold>(`${this.resourceProductSoldUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityProductSoldResponseType) => this.convertProductSoldDateFromServer(res)));
  }

  findOutOfStock(id: number): Observable<EntityProductResponseType> {
    return this.http.get<IProduct>(`${this.resourceOutOfStockUrl}/${id}`, { observe: 'response' });
  }

  queryForKitchenProducts(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    const kUrl = this.resourceUrl + '/kitchen';
    return this.http
      .get<IProductOnStock[]>(kUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryForBarProducts(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    const bUrl = this.resourceUrl + '/bar';
    return this.http
      .get<IProductOnStock[]>(bUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryForOutOfStock(req?: any): Observable<EntityProductArrayResponseType> {
    const options = createRequestOption(req);
    const oosUrl = this.resourceUrl + '/out-of-stock';
    return this.http.get<IProduct[]>(oosUrl, { params: options, observe: 'response' });
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

  deleteOutOfStock(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceOutOfStockUrl}/${id}`, { observe: 'response' });
  }

  private convertDateFromClient(productOnStock: IProductOnStock): IProductOnStock {
    const copy: IProductOnStock = Object.assign({}, productOnStock, {
      deliveryDate:
        productOnStock.deliveryDate != null && productOnStock.deliveryDate.isValid()
          ? productOnStock.deliveryDate.format(DATE_FORMAT)
          : null
    });
    return copy;
  }

  private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    res.body.forEach((productOnStock: IProductOnStock) => {
      productOnStock.deliveryDate = productOnStock.deliveryDate != null ? moment(productOnStock.deliveryDate) : null;
    });
    return res;
  }
  protected convertProductSoldDateFromServer(res: EntityProductSoldResponseType): EntityProductSoldResponseType {
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
  // private convertProductSoldDateFromServer(res: EntityProductSoldResponseType): EntityProductSoldResponseType {
  //   res.body.orderedTime = res.body.orderedTime != null ? moment(res.body.orderedTime) : null;
  //   res.body.acceptedTime = res.body.acceptedTime != null ? moment(res.body.acceptedTime) : null;
  //   res.body.finishedTime = res.body.finishedTime != null ? moment(res.body.finishedTime) : null;
  //   res.body.takenTime = res.body.takenTime != null ? moment(res.body.takenTime) : null;
  //   res.body.deliveryDate = res.body.deliveryDate != null ? moment(res.body.deliveryDate) : null;
  //   res.body.sendTime = res.body.sendTime != null ? moment(res.body.sendTime) : null;
  //   return res;
  // }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.deliveryDate = res.body.deliveryDate != null ? moment(res.body.deliveryDate) : null;
    }
    return res;
  }
}
