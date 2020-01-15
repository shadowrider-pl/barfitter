import { SERVER_API_URL } from '../../app.constants';
import { ProductsOfCategoryWithOrderedQuantity } from '../models/products-of-category-with-ordered-quantity.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<ProductsOfCategoryWithOrderedQuantity>;

@Injectable({ providedIn: 'root' })
export class ProductsOfCategoryService {
  private resourceUrl = SERVER_API_URL + 'api/products-of-category';

  constructor(private http: HttpClient) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ProductsOfCategoryWithOrderedQuantity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../app.constants';
//
// import { createRequestOption } from '../../shared';
// import { ProductsOfCategoryWithOrderedQuantity } from '../models/products-of-category-with-ordered-quantity.model';
//
// export type EntityResponseType = HttpResponse<ProductsOfCategoryWithOrderedQuantity>;
//
// @Injectable()
// export class ProductsOfCategoryService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/products-of-category';
//    //    private resourceSearchUrl = SERVER_API_URL + 'api/_search/active-categories';
//
//    constructor(private http: HttpClient) {}
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<ProductsOfCategoryWithOrderedQuantity>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
////    query(req?: any): Observable<HttpResponse<Category[]>> {
////        const options = createRequestOption(req);
////        return this.http.get<Category[]>(this.resourceUrl, { params: options, observe: 'response' })
////            .map((res: HttpResponse<Category[]>) => this.convertArrayResponse(res));
////    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: ProductsOfCategoryWithOrderedQuantity = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Category.
//     */
//    private convertItemFromServer(category: ProductsOfCategoryWithOrderedQuantity): ProductsOfCategoryWithOrderedQuantity {
//        const copy: ProductsOfCategoryWithOrderedQuantity = Object.assign({}, category);
//        return copy;
//    }
// }
