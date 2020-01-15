import { SERVER_API_URL } from '../../app.constants';
import { IProductOnStock } from '../../shared/model/product-on-stock.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { createRequestOption } from 'app/shared/util/request-util';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';

type EntityResponseType = HttpResponse<IProductOnStock>;
type EntityArrayResponseType = HttpResponse<IProductOnStock[]>;

@Injectable({ providedIn: 'root' })
export class ProductOnStockDistinctService {
  private resourceUrl = SERVER_API_URL + 'api/product-on-stocks-distinct';

  constructor(private http: HttpClient) {}
  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductOnStock[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
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
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../app.constants';
// import { JhiDateUtils } from 'ng-jhipster';
//
// import { createRequestOption } from '../../shared';
// import { ProductOnStock } from '../../shared/model/product-on-stock.model';
//
// export type EntityResponseType = HttpResponse<ProductOnStock>;
//
// @Injectable()
// export class ProductOnStockDistinctService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/product-on-stocks-distinct';
//
//    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }
//
//    query(req?: any): Observable<HttpResponse<ProductOnStock[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<ProductOnStock[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<ProductOnStock[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertArrayResponse(res: HttpResponse<ProductOnStock[]>): HttpResponse<ProductOnStock[]> {
//        const jsonResponse: ProductOnStock[] = res.body;
//        const body: ProductOnStock[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to ProductOnStock.
//     */
//    private convertItemFromServer(productOnStock: ProductOnStock): ProductOnStock {
//        const copy: ProductOnStock = Object.assign({}, productOnStock);
//        copy.deliveryDate = this.dateUtils
//            .convertLocalDateFromServer(productOnStock.deliveryDate);
//        return copy;
//    }
// }
