import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProductOrdered } from '../../../shared/model/product-ordered.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<IProductOrdered>;
type EntityArrayResponseType = HttpResponse<IProductOrdered[]>;

@Injectable({ providedIn: 'root' })
export class ProductsForChefService {
  private resourceUrl = SERVER_API_URL + 'api/products-for-chef';

  constructor(private http: HttpClient) {}
  //
  //    create(productOrdered: IProductOrdered): Observable<EntityResponseType> {
  //        const copy = this.convertDateFromClient(productOrdered);
  //        return this.http
  //            .post<IProductOrdered>(this.resourceUrl, copy, { observe: 'response' })
  //            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  //    }
  //
  //    update(productOrdered: IProductOrdered): Observable<EntityResponseType> {
  //        const copy = this.convertDateFromClient(productOrdered);
  //        return this.http
  //            .put<IProductOrdered>(this.resourceUrl, copy, { observe: 'response' })
  //            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  //    }
  //
  //    find(id: number): Observable<EntityResponseType> {
  //        return this.http
  //            .get<IProductOrdered>(`${this.resourceUrl}/${id}`, { observe: 'response' })
  //            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  //    }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductOrdered[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  //
  //    delete(id: number): Observable<HttpResponse<any>> {
  //        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  //    }

  //    private convertDateFromClient(productOrdered: IProductOrdered): IProductOrdered {
  //        const copy: IProductOrdered = Object.assign({}, productOrdered, {
  //            orderedTime:
  //                productOrdered.orderedTime != null && productOrdered.orderedTime.isValid() ? productOrdered.orderedTime.toJSON() : null,
  //            acceptedTime:
  //                productOrdered.acceptedTime != null && productOrdered.acceptedTime.isValid() ? productOrdered.acceptedTime.toJSON() : null,
  //            finishedTime:
  //                productOrdered.finishedTime != null && productOrdered.finishedTime.isValid() ? productOrdered.finishedTime.toJSON() : null,
  //            takenTime: productOrdered.takenTime != null && productOrdered.takenTime.isValid() ? productOrdered.takenTime.toJSON() : null,
  //            deliveryDate:
  //                productOrdered.deliveryDate != null && productOrdered.deliveryDate.isValid()
  //                    ? productOrdered.deliveryDate.format(DATE_FORMAT)
  //                    : null,
  //            sendTime: productOrdered.sendTime != null && productOrdered.sendTime.isValid() ? productOrdered.sendTime.toJSON() : null
  //        });
  //        return copy;
  //    }
  //
  //    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
  //        res.body.orderedTime = res.body.orderedTime != null ? moment(res.body.orderedTime) : null;
  //        res.body.acceptedTime = res.body.acceptedTime != null ? moment(res.body.acceptedTime) : null;
  //        res.body.finishedTime = res.body.finishedTime != null ? moment(res.body.finishedTime) : null;
  //        res.body.takenTime = res.body.takenTime != null ? moment(res.body.takenTime) : null;
  //        res.body.deliveryDate = res.body.deliveryDate != null ? moment(res.body.deliveryDate) : null;
  //        res.body.sendTime = res.body.sendTime != null ? moment(res.body.sendTime) : null;
  //        return res;
  //    }

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
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { ProductOrdered } from '../../../entities/product-ordered/product-ordered.model';
// import { createRequestOption } from '../../../shared';
//
// export type EntityResponseType = HttpResponse<ProductOrdered>;
//
// @Injectable()
// export class ProductsForChefService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/products-for-chef';
//
//    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
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
//    private convert(productOrdered: ProductOrdered): ProductOrdered {
//        const copy: ProductOrdered = Object.assign({}, productOrdered);
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
// }
