import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProductSold } from '../../../shared/model/product-sold.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';

type EntityResponseType = HttpResponse<IProductSold>;
type EntityArrayResponseType = HttpResponse<IProductSold[]>;

@Injectable({ providedIn: 'root' })
export class SubstitutesService {
  private resourceUrl = SERVER_API_URL + 'api/substitutes';

  constructor(private http: HttpClient) {}

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

  private convertDateFromClient(productSold: IProductSold): IProductSold {
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

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
    res.body.orderedTime = res.body.orderedTime != null ? moment(res.body.orderedTime) : null;
    res.body.acceptedTime = res.body.acceptedTime != null ? moment(res.body.acceptedTime) : null;
    res.body.finishedTime = res.body.finishedTime != null ? moment(res.body.finishedTime) : null;
    res.body.takenTime = res.body.takenTime != null ? moment(res.body.takenTime) : null;
    res.body.deliveryDate = res.body.deliveryDate != null ? moment(res.body.deliveryDate) : null;
    res.body.sendTime = res.body.sendTime != null ? moment(res.body.sendTime) : null;
    return res;
  }

  private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    res.body.forEach((productSold: IProductSold) => {
      productSold.orderedTime = productSold.orderedTime != null ? moment(productSold.orderedTime) : null;
      productSold.acceptedTime = productSold.acceptedTime != null ? moment(productSold.acceptedTime) : null;
      productSold.finishedTime = productSold.finishedTime != null ? moment(productSold.finishedTime) : null;
      productSold.takenTime = productSold.takenTime != null ? moment(productSold.takenTime) : null;
      productSold.deliveryDate = productSold.deliveryDate != null ? moment(productSold.deliveryDate) : null;
      productSold.sendTime = productSold.sendTime != null ? moment(productSold.sendTime) : null;
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
// import { Substitutes } from './substitutes.model';
// import { createRequestOption } from '../../../shared';
//
// export type EntityResponseType = HttpResponse<Substitutes>;
//
// @Injectable()
// export class SubstitutesService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/substitutes';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/substitutes';
//
//    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    create(substitutes: Substitutes): Observable<EntityResponseType> {
//        const copy = this.convert(substitutes);
//        return this.http.post<Substitutes>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(substitutes: Substitutes): Observable<EntityResponseType> {
//        const copy = this.convert(substitutes);
//        return this.http.put<Substitutes>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<Substitutes>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<Substitutes[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Substitutes[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Substitutes[]>) => this.convertArrayResponse(res));
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
//
//    search(req?: any): Observable<HttpResponse<Substitutes[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Substitutes[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Substitutes[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: Substitutes = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<Substitutes[]>): HttpResponse<Substitutes[]> {
//        const jsonResponse: Substitutes[] = res.body;
//        const body: Substitutes[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Substitutes.
//     */
//    private convertItemFromServer(substitutes: Substitutes): Substitutes {
//        const copy: Substitutes = Object.assign({}, substitutes);
//        copy.orderedTime = this.dateUtils
//            .convertDateTimeFromServer(substitutes.orderedTime);
//        copy.acceptedTime = this.dateUtils
//            .convertDateTimeFromServer(substitutes.acceptedTime);
//        copy.finishedTime = this.dateUtils
//            .convertDateTimeFromServer(substitutes.finishedTime);
//        copy.takenTime = this.dateUtils
//            .convertDateTimeFromServer(substitutes.takenTime);
//        copy.deliveryDate = this.dateUtils
//            .convertLocalDateFromServer(substitutes.deliveryDate);
//        copy.sendTime = this.dateUtils
//            .convertDateTimeFromServer(substitutes.sendTime);
//        return copy;
//    }
//
//    /**
//     * Convert a Substitutes to a JSON which can be sent to the server.
//     */
//    private convert(substitutes: Substitutes): Substitutes {
//        const copy: Substitutes = Object.assign({}, substitutes);
//
//        copy.orderedTime = this.dateUtils.toDate(substitutes.orderedTime);
//
//        copy.acceptedTime = this.dateUtils.toDate(substitutes.acceptedTime);
//
//        copy.finishedTime = this.dateUtils.toDate(substitutes.finishedTime);
//
//        copy.takenTime = this.dateUtils.toDate(substitutes.takenTime);
//        copy.deliveryDate = this.dateUtils
//            .convertLocalDateToServer(substitutes.deliveryDate);
//
//        copy.sendTime = this.dateUtils.toDate(substitutes.sendTime);
//        return copy;
//    }
// }
