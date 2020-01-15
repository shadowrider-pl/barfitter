import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProduct } from '../../shared/model/product.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IProduct>;
type EntityArrayResponseType = HttpResponse<IProduct[]>;

@Injectable({ providedIn: 'root' })
export class ActiveProductService {
  private resourceUrl = SERVER_API_URL + 'api/active-products';

  constructor(private http: HttpClient) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProduct[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../app.constants';
//
// import { createRequestOption } from '../../shared';
// import { Product } from '../../shared/model/product.model';
//
// export type EntityResponseType = HttpResponse<Product>;
//
// @Injectable()
// export class ActiveProductService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/active-products';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/active-products';
//
//    constructor(private http: HttpClient) { }
//
//    query(req?: any): Observable<HttpResponse<Product[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Product[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Product[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertArrayResponse(res: HttpResponse<Product[]>): HttpResponse<Product[]> {
//        const jsonResponse: Product[] = res.body;
//        const body: Product[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Product.
//     */
//    private convertItemFromServer(product: Product): Product {
//        const copy: Product = Object.assign({}, product);
//        return copy;
//    }
// }
