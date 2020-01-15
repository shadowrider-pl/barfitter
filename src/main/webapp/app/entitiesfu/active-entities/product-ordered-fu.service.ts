import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { IProductOrdered, ProductOrdered } from '../../shared/model/product-ordered.model';
import { ProductsOrdered } from '../models/products-ordered.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IProductOrdered>;
type EntityProductsResponseType = HttpResponse<ProductsOrdered>;
type EntityArrayResponseType = HttpResponse<IProductOrdered[]>;

@Injectable({ providedIn: 'root' })
export class ProductOrderedFUService {
  private resourceUrl = SERVER_API_URL + 'api/product-orderedfu';
  private resourceProductsUrl = SERVER_API_URL + 'api/products-orderedfu';

  constructor(private http: HttpClient) {}

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

  updateProductsList(productsOrdered: ProductsOrdered): Observable<EntityProductsResponseType> {
    return this.http.put<ProductsOrdered>(this.resourceProductsUrl, productsOrdered, { observe: 'response' });
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

  private convertDateFromClient(productOrdered: IProductOrdered): IProductOrdered {
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

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
    res.body.orderedTime = res.body.orderedTime != null ? moment(res.body.orderedTime) : null;
    res.body.acceptedTime = res.body.acceptedTime != null ? moment(res.body.acceptedTime) : null;
    res.body.finishedTime = res.body.finishedTime != null ? moment(res.body.finishedTime) : null;
    res.body.takenTime = res.body.takenTime != null ? moment(res.body.takenTime) : null;
    res.body.deliveryDate = res.body.deliveryDate != null ? moment(res.body.deliveryDate) : null;
    res.body.sendTime = res.body.sendTime != null ? moment(res.body.sendTime) : null;
    return res;
  }

  //  private convertProductsDateFromServer(res: EntityProductsResponseType): EntityProductsResponseType {
  //    for (let i = 0; i < res.body.productsOrdered.length; i++) {
  //      res.body.productsOrdered[i].orderedTime = res.body.productsOrdered[i].orderedTime != null ? moment(res.body.productsOrdered[i].orderedTime) : null;
  //      res.body.productsOrdered[i].acceptedTime = res.body.productsOrdered[i].acceptedTime != null ? moment(res.body.productsOrdered[i].acceptedTime) : null;
  //      res.body.productsOrdered[i].finishedTime = res.body.productsOrdered[i].finishedTime != null ? moment(res.body.productsOrdered[i].finishedTime) : null;
  //      res.body.productsOrdered[i].takenTime = res.body.productsOrdered[i].takenTime != null ? moment(res.body.productsOrdered[i].takenTime) : null;
  //      res.body.productsOrdered[i].deliveryDate = res.body.productsOrdered[i].deliveryDate != null ? moment(res.body.productsOrdered[i].deliveryDate) : null;
  //      res.body.productsOrdered[i].sendTime = res.body.productsOrdered[i].sendTime != null ? moment(res.body.productsOrdered[i].sendTime) : null;
  //    }
  //    return res;
  //  }
  //
  //  private convertProductsDateFromClient(productsOrdered: ProductsOrdered): ProductsOrdered {
  //    for (let i = 0; i < productsOrdered.productsOrdered.length; i++) {
  //      this.convertDateFromClient(productsOrdered.productsOrdered[i]);
  //    }
  //    return productsOrdered;
  //  }

  private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    res.body.forEach((productOrdered: IProductOrdered) => {
      productOrdered.orderedTime = productOrdered.orderedTime != null ? moment(productOrdered.orderedTime) : null;
      productOrdered.acceptedTime = productOrdered.acceptedTime != null ? moment(productOrdered.acceptedTime) : null;
      productOrdered.finishedTime = productOrdered.finishedTime != null ? moment(productOrdered.finishedTime) : null;
      productOrdered.takenTime = productOrdered.takenTime != null ? moment(productOrdered.takenTime) : null;
      productOrdered.deliveryDate = productOrdered.deliveryDate != null ? moment(productOrdered.deliveryDate) : null;
      productOrdered.sendTime = productOrdered.sendTime != null ? moment(productOrdered.sendTime) : null;
    });
    return res;
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { DatePipe } from '@angular/common';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../app.constants';
//
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { createRequestOption } from '../../shared';
// import { ProductOrdered } from '../../shared/model/product-ordered.model';
// import { ProductsOrdered } from '../models/products-ordered.model';
//
// export type EntityResponseType = HttpResponse<ProductOrdered>;
// export type EntityProductsListResponseType = HttpResponse<ProductsOrdered>;
//
// @Injectable()
// export class ProductOrderedFUService {
//
//  private resourceUrl = SERVER_API_URL + 'api/product-orderedfu';
//  private resourceProductsUrl = SERVER_API_URL + 'api/products-orderedfu';
//
//  constructor(
//        private datePipe: DatePipe,
//        private http: HttpClient,
//        private dateUtils: JhiDateUtils) { }
//
//    create(productOrdered: ProductOrdered): Observable<EntityResponseType> {
//        const copy = this.convert(productOrdered);
//        return this.http.post<ProductOrdered>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(productOrdered: ProductOrdered): Observable<EntityResponseType> {
//        const copy = this.convert(productOrdered);
//        return this.http.put<ProductOrdered>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    updateProductsList(productsOrdered: ProductsOrdered): Observable<EntityProductsListResponseType> {
//        const copy = this.convertProductsList(productsOrdered);
//        return this.http.put<ProductsOrdered>(this.resourceProductsUrl, copy, { observe: 'response' })
//            .map((res: EntityProductsListResponseType) => this.convertProductsListResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<ProductOrdered>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<ProductOrdered[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<ProductOrdered[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<ProductOrdered[]>) => this.convertArrayResponse(res));
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: ProductOrdered = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertProductsListResponse(res: EntityProductsListResponseType): EntityProductsListResponseType {
//        const body: ProductsOrdered = this.convertProductsListFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<ProductOrdered[]>): HttpResponse<ProductOrdered[]> {
//        const jsonResponse: ProductOrdered[] = res.body;
//        const body: ProductOrdered[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to ProductsOrdered.
//     */
//    private convertProductsListFromServer(products: ProductsOrdered): ProductsOrdered {
//      for (let i = 0; i < products.productsOrdered.length; i++) {
//        products.productsOrdered[i] = this.convertItemFromServer(products.productsOrdered[i]);
//      }
//      return products;
//    }
//
//    /**
//     * Convert a returned JSON object to ProductOrdered.
//     */
//    private convertItemFromServer(productOrdered: ProductOrdered): ProductOrdered {
//        const copy: ProductOrdered = Object.assign({}, productOrdered);
//        copy.orderedTime = this.dateUtils
//            .convertDateTimeFromServer(productOrdered.orderedTime);
//        copy.acceptedTime = this.dateUtils
//            .convertDateTimeFromServer(productOrdered.acceptedTime);
//        copy.finishedTime = this.dateUtils
//            .convertDateTimeFromServer(productOrdered.finishedTime);
//        copy.takenTime = this.dateUtils
//            .convertDateTimeFromServer(productOrdered.takenTime);
//        copy.deliveryDate = this.dateUtils
//            .convertLocalDateFromServer(productOrdered.deliveryDate);
//        copy.sendTime = this.dateUtils
//            .convertDateTimeFromServer(productOrdered.sendTime);
//        return copy;
//    }
//
//    /**
//     * Convert a ProductOrdered to a JSON which can be sent to the server.
//     */
//    private convertProductsList(productsList: ProductsOrdered): ProductsOrdered {
//      for (let i = 0; i < productsList.productsOrdered.length; i++) {
//        productsList.productsOrdered[i] = this.convert(productsList.productsOrdered[i]);
//      }
//      return productsList;
//    }
//
//    /**
//     * Convert a ProductOrdered to a JSON which can be sent to the server.
//     */
//    private convert(productOrdered: ProductOrdered): ProductOrdered {
//        const copy: ProductOrdered = Object.assign({}, productOrdered);
//
//        productOrdered.orderedTime = this.datePipe
//                            .transform(productOrdered.orderedTime, 'yyyy-MM-ddTHH:mm:ss');
//        productOrdered.acceptedTime = this.datePipe
//                            .transform(productOrdered.acceptedTime, 'yyyy-MM-ddTHH:mm:ss');
//        productOrdered.finishedTime = this.datePipe
//                            .transform(productOrdered.finishedTime, 'yyyy-MM-ddTHH:mm:ss');
//        productOrdered.takenTime = this.datePipe
//                            .transform(productOrdered.takenTime, 'yyyy-MM-ddTHH:mm:ss');
//        productOrdered.sendTime = this.datePipe
//                            .transform(productOrdered.sendTime, 'yyyy-MM-ddTHH:mm:ss');
//
//        copy.orderedTime = this.dateUtils.toDate(productOrdered.orderedTime);
//
//        copy.acceptedTime = this.dateUtils.toDate(productOrdered.acceptedTime);
//
//        copy.finishedTime = this.dateUtils.toDate(productOrdered.finishedTime);
//
//        copy.takenTime = this.dateUtils.toDate(productOrdered.takenTime);
//        copy.deliveryDate = this.dateUtils
//            .convertLocalDateToServer(productOrdered.deliveryDate);
//
//        copy.sendTime = this.dateUtils.toDate(productOrdered.sendTime);
//        return copy;
//    }
////  create(productOrdered: ProductOrdered): Observable<ProductOrdered> {
////    const copy = this.convert(productOrdered);
////    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
////      const jsonResponse = res.json();
////      return this.convertItemFromServer(jsonResponse);
////    });
////  }
//
////  update(productOrdered: ProductOrdered): Observable<ProductOrdered> {
////    const copy = this.convert(productOrdered);
////    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
////      const jsonResponse = res.json();
////      return this.convertItemFromServer(jsonResponse);
////    });
////  }
////
////  find(id: number): Observable<ProductOrdered> {
////    return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
////      const jsonResponse = res.json();
////      return this.convertItemFromServer(jsonResponse);
////    });
////  }
////
////  query(req?: any): Observable<ResponseWrapper> {
////    const options = createRequestOption(req);
////    return this.http.get(this.resourceUrl, options)
////      .map((res: Response) => this.convertResponse(res));
////  }
////
////  delete(id: number): Observable<Response> {
////    return this.http.delete(`${this.resourceUrl}/${id}`);
////  }
//
//  //    search(req?: any): Observable<ResponseWrapper> {
//  //        const options = createRequestOption(req);
//  //        return this.http.get(this.resourceSearchUrl, options)
//  //            .map((res: any) => this.convertResponse(res));
//  //    }
////
////  private convertResponse(res: Response): ResponseWrapper {
////    const jsonResponse = res.json();
////    const result = [];
////    for (let i = 0; i < jsonResponse.length; i++) {
////      result.push(this.convertItemFromServer(jsonResponse[i]));
////    }
////    return new ResponseWrapper(res.headers, result, res.status);
////  }
////
////  /**
////   * Convert a returned JSON object to ProductOrdered.
////   */
////  private convertItemFromServer(json: any): ProductOrdered {
////    const entity: ProductOrdered = Object.assign(new ProductOrdered(), json);
////    entity.orderedTime = this.dateUtils
////      .convertDateTimeFromServer(json.orderedTime);
////    entity.acceptedTime = this.dateUtils
////      .convertDateTimeFromServer(json.acceptedTime);
////    entity.finishedTime = this.dateUtils
////      .convertDateTimeFromServer(json.finishedTime);
////    entity.takenTime = this.dateUtils
////      .convertDateTimeFromServer(json.takenTime);
////    entity.deliveryDate = this.dateUtils
////      .convertLocalDateFromServer(json.deliveryDate);
////    entity.sendTime = this.dateUtils
////      .convertDateTimeFromServer(json.sendTime);
////    return entity;
////  }
////
////  /**
////   * Convert a ProductOrdered to a JSON which can be sent to the server.
////   */
////  private convert(productOrdered: ProductOrdered): ProductOrdered {
////    const copy: ProductOrdered = Object.assign({}, productOrdered);
////
////    copy.orderedTime = this.dateUtils.toDate(productOrdered.orderedTime);
////
////    copy.acceptedTime = this.dateUtils.toDate(productOrdered.acceptedTime);
////
////    copy.finishedTime = this.dateUtils.toDate(productOrdered.finishedTime);
////
////    copy.takenTime = this.dateUtils.toDate(productOrdered.takenTime);
////    copy.deliveryDate = this.dateUtils
////      .convertLocalDateToServer(productOrdered.deliveryDate);
////
////    copy.sendTime = this.dateUtils.toDate(productOrdered.sendTime);
////
////    return copy;
////  }
// }
