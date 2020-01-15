import { SERVER_API_URL } from '../../../app.constants';
// import { createRequestOption, DATE_FORMAT } from '../../../shared';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProductDelivered } from '../../../shared/model/product-delivered.model';
import { ProductsDelivered } from '../../models/products-delivered.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';

type EntityResponseType = HttpResponse<IProductDelivered>;
type EntityArrayResponseType = HttpResponse<IProductDelivered[]>;
type EntityListResponseType = HttpResponse<ProductsDelivered>;

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private resourceUrl = SERVER_API_URL + 'api/authorization';
  private resourceListUrl = SERVER_API_URL + 'api/authorization-list';

  constructor(private http: HttpClient) {}

  create(productDelivered: IProductDelivered): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productDelivered);
    return this.http
      .post<IProductDelivered>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productDelivered: IProductDelivered): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productDelivered);
    return this.http.put<IProductDelivered>(this.resourceUrl, copy, { observe: 'response' });
  }

  updateList(productsDelivered: ProductsDelivered): Observable<EntityListResponseType> {
    const copy = this.convertList(productsDelivered);
    return this.http.put<ProductsDelivered>(this.resourceListUrl, copy, { observe: 'response' });
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

  private convertDateFromClient(productDelivered: IProductDelivered): IProductDelivered {
    const copy: IProductDelivered = Object.assign({}, productDelivered, {
      deliveryDate:
        productDelivered.deliveryDate != null && productDelivered.deliveryDate.isValid()
          ? productDelivered.deliveryDate.format(DATE_FORMAT)
          : null
    });
    return copy;
  }

  private convertList(productsList: ProductsDelivered): ProductsDelivered {
    for (let i = 0; i < productsList.productsDelivered.length; i++) {
      productsList.productsDelivered[i] = this.convertDateFromClient(productsList.productsDelivered[i]);
    }
    return productsList;
  }

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
    res.body.deliveryDate = res.body.deliveryDate != null ? moment(res.body.deliveryDate) : null;
    return res;
  }

  private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    res.body.forEach((productDelivered: IProductDelivered) => {
      productDelivered.deliveryDate = productDelivered.deliveryDate != null ? moment(productDelivered.deliveryDate) : null;
    });
    return res;
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
//
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { ProductDelivered } from './authorization.model';
// import { createRequestOption } from '../../../shared';
// import { ProductsDelivered } from '../../models/products-delivered.model';
//
// export type EntityResponseType = HttpResponse<ProductDelivered>;
// export type EntityListResponseType = HttpResponse<ProductsDelivered>;
//
// @Injectable()
// export class AuthorizationService {
//
//  private resourceUrl = SERVER_API_URL + 'api/authorization';
//  private resourceListUrl = SERVER_API_URL + 'api/authorization-list';
////  private resourceSearchUrl = SERVER_API_URL + 'api/_search/authorization';
//
//  constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//  create(productDelivered: ProductDelivered): Observable<EntityResponseType> {
//    const copy = this.convert(productDelivered);
//    return this.http.post<ProductDelivered>(this.resourceUrl, copy, { observe: 'response' })
//      .map((res: EntityResponseType) => this.convertResponse(res));
//  }
//
//    update(productDelivered: ProductDelivered): Observable<EntityResponseType> {
//        const copy = this.convert(productDelivered);
//        return this.http.put<ProductDelivered>(this.resourceUrl, copy, { observe: 'response' });
//    }
//
//    updateList(productsDelivered: ProductsDelivered): Observable<EntityListResponseType> {
//        const copy = this.convertList(productsDelivered);
//        return this.http.put<ProductsDelivered>(this.resourceListUrl, copy, { observe: 'response' });
//    }
//
//  find(id: number): Observable<EntityResponseType> {
//    return this.http.get<ProductDelivered>(`${this.resourceUrl}/${id}`, { observe: 'response' })
//      .map((res: EntityResponseType) => this.convertResponse(res));
//  }
//
//    query(req?: any): Observable<HttpResponse<ProductDelivered[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<ProductDelivered[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<ProductDelivered[]>) => this.convertArrayResponse(res));
//    }
//
//  delete(id: number): Observable<HttpResponse<any>> {
//    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
//  }
//
////  search(req?: any): Observable<HttpResponse<ProductDelivered[]>> {
////    const options = createRequestOption(req);
////    return this.http.get<ProductDelivered[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
////      .map((res: HttpResponse<ProductDelivered[]>) => this.convertArrayResponse(res));
////  }
//
//  private convertResponse(res: EntityResponseType): EntityResponseType {
//    const body: ProductDelivered = this.convertItemFromServer(res.body);
//    return res.clone({ body });
//  }
//
//    private convertArrayResponse(res: HttpResponse<ProductDelivered[]>): HttpResponse<ProductDelivered[]> {
//        const jsonResponse: ProductDelivered[] = res.body;
//        const body: ProductDelivered[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to ProductDelivered.
//     */
//    private convertItemFromServer(productDelivered: ProductDelivered): ProductDelivered {
//        const copy: ProductDelivered = Object.assign({}, productDelivered);
//        copy.deliveryDate = this.dateUtils
//            .convertLocalDateFromServer(productDelivered.deliveryDate);
//        return copy;
//    }
//
//    /**
//     * Convert a ProductDelivered to a JSON which can be sent to the server.
//     */
//    private convert(productDelivered: ProductDelivered): ProductDelivered {
//        const copy: ProductDelivered = Object.assign({}, productDelivered);
//        copy.deliveryDate = this.dateUtils
//            .convertLocalDateToServer(productDelivered.deliveryDate);
//        return copy;
//    }
//
//    /**
//     * Convert a ProductDelivered to a JSON which can be sent to the server.
//     */
//    private convertList(productsList: ProductsDelivered): ProductsDelivered {
//      for (let i = 0; i < productsList.productsDelivered.length; i++) {
//        productsList.productsDelivered[i] = this.convert(productsList.productsDelivered[i]);
//      }
//      return productsList;
//    }
// }
