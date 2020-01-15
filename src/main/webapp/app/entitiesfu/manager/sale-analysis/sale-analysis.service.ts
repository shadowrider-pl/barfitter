import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { Cashup, ICashup } from '../../../shared/model/cashup.model';
import { ProductAnalyzed } from './product-analyzed.model';
import { ProductsAnalyzed } from './products-analyzed.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<ProductAnalyzed>;
type EntityArrayResponseType = HttpResponse<ProductAnalyzed[]>;
type EntityCashupArrayResponseType = HttpResponse<Cashup[]>;
type EntityProductsAnalyzedResponseType = HttpResponse<ProductsAnalyzed>;

@Injectable({ providedIn: 'root' })
export class SaleAnalysisService {
  private resourceUrl = SERVER_API_URL + 'api/sale-analysis';
  private resourceCashupsUrl = SERVER_API_URL + 'api/sale-analysis/cashups';

  constructor(private http: HttpClient) {}

  find(id: number): Observable<EntityProductsAnalyzedResponseType> {
    return this.http.get<ProductsAnalyzed>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findCashup(id: number): Observable<EntityProductsAnalyzedResponseType> {
    return this.http.get<ProductsAnalyzed>(`${this.resourceCashupsUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ProductAnalyzed[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryForCashups(req?: any): Observable<EntityCashupArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Cashup[]>(this.resourceCashupsUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityCashupArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  //    private convertDateFromClient(cashup: ICashup): ICashup {
  //        const copy: ICashup = Object.assign({}, cashup, {
  //            barmanLoginTime: cashup.barmanLoginTime != null && cashup.barmanLoginTime.isValid() ? cashup.barmanLoginTime.toJSON() : null,
  //            cashupTime: cashup.cashupTime != null && cashup.cashupTime.isValid() ? cashup.cashupTime.toJSON() : null
  //        });
  //        return copy;
  //    }
  //
  //    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
  //        res.body.barmanLoginTime = res.body.barmanLoginTime != null ? moment(res.body.barmanLoginTime) : null;
  //        res.body.cashupTime = res.body.cashupTime != null ? moment(res.body.cashupTime) : null;
  //        return res;
  //    }
  //
  private convertDateArrayFromServer(res: EntityCashupArrayResponseType): EntityCashupArrayResponseType {
    res.body.forEach((cashup: ICashup) => {
      cashup.barmanLoginTime = cashup.barmanLoginTime != null ? moment(cashup.barmanLoginTime) : null;
      cashup.cashupTime = cashup.cashupTime != null ? moment(cashup.cashupTime) : null;
    });
    return res;
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
// import { Cashup } from '../../../entities/cashup/cashup.model';
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { ProductAnalyzed } from './product-analyzed.model';
// import { createRequestOption } from '../../../shared';
// import { ProductsAnalyzed } from './products-analyzed.model';
//
// export type EntityResponseType = HttpResponse<ProductAnalyzed>;
// export type EntityProductsAnalyzedResponseType = HttpResponse<ProductsAnalyzed>;
//
// @Injectable()
// export class SaleAnalysisService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/sale-analysis';
//    private resourceCashupsUrl =  SERVER_API_URL + 'api/sale-analysis/cashups';
////    private resourceSearchUrl = SERVER_API_URL + 'api/_search/ProductAnalyzed';
//
//    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    find(id: number): Observable<EntityProductsAnalyzedResponseType> {
//        return this.http.get<ProductsAnalyzed>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityProductsAnalyzedResponseType) => this.convertResponse(res));
//    }
//
//    findCashup(id: number): Observable<EntityProductsAnalyzedResponseType> {
//        return this.http.get<ProductsAnalyzed>(`${this.resourceCashupsUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityProductsAnalyzedResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<ProductAnalyzed[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<ProductAnalyzed[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<ProductAnalyzed[]>) => this.convertArrayResponse(res));
//    }
//
//    queryForCashups(req?: any): Observable<HttpResponse<Cashup[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Cashup[]>(this.resourceCashupsUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Cashup[]>) => this.convertCashupArrayResponse(res));
//    }
//
//    private convertCashupArrayResponse(res: HttpResponse<Cashup[]>): HttpResponse<Cashup[]> {
//        const jsonResponse: Cashup[] = res.body;
//        const body: Cashup[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertCashupItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Cashup.
//     */
//    private convertCashupItemFromServer(cashup: Cashup): Cashup {
//        const copy: Cashup = Object.assign({}, cashup);
//        copy.barmanLoginTime = this.dateUtils
//            .convertDateTimeFromServer(cashup.barmanLoginTime);
//        copy.cashupTime = this.dateUtils
//            .convertDateTimeFromServer(cashup.cashupTime);
//        return copy;
//    }
//
//    private convertResponse(res: EntityProductsAnalyzedResponseType): EntityProductsAnalyzedResponseType {
//        const body: ProductsAnalyzed = this.convertProductsAnalyzedFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<ProductAnalyzed[]>): HttpResponse<ProductAnalyzed[]> {
//        const jsonResponse: ProductAnalyzed[] = res.body;
//        const body: ProductAnalyzed[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to ProductAnalyzed.
//     */
//    private convertItemFromServer(productAnalyzed: ProductAnalyzed): ProductAnalyzed {
//        const copy: ProductAnalyzed = Object.assign({}, productAnalyzed);
//        return copy;
//    }
//
//    /**
//     * Convert a returned JSON object to ProductAnalyzed.
//     */
//    private convertProductsAnalyzedFromServer(productsAnalyzed: ProductsAnalyzed): ProductsAnalyzed {
//        const copy: ProductsAnalyzed = Object.assign({}, productsAnalyzed);
//        return copy;
//    }
//
//    /**
//     * Convert a ProductAnalyzed to a JSON which can be sent to the server.
//     */
//    private convert(productAnalyzed: ProductAnalyzed): ProductAnalyzed {
//        const copy: ProductAnalyzed = Object.assign({}, productAnalyzed);
//        return copy;
//    }
// }
