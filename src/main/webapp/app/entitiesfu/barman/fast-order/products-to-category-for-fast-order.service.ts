import { SERVER_API_URL } from '../../../app.constants';
import { ProductsOfCategoryWithOrderedQuantity } from '../../models/products-of-category-with-ordered-quantity.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

type EntityResponseType = HttpResponse<ProductsOfCategoryWithOrderedQuantity>;

@Injectable({ providedIn: 'root' })
export class ProductsToCategoryForFastOrderService {
  private resourceUrl = SERVER_API_URL + 'api/products-to-category-for-fast-order';

  constructor(private http: HttpClient) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ProductsOfCategoryWithOrderedQuantity>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  private convertDateFromServer(res: EntityResponseType): EntityResponseType {
    for (let i = 0; i < res.body.productsOfCategory.length; i++) {
      res.body.productsOfCategory[i].deliveryDate =
        res.body.productsOfCategory[i].deliveryDate != null ? moment(res.body.productsOfCategory[i].deliveryDate) : null;
    }
    return res;
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
// import { OrderOpened } from '../new-order/new-order.model';
// import { createRequestOption } from '../../../shared';
// import { ProductsOfCategoryWithOrderedQuantity } from '../../models/products-of-category-with-ordered-quantity.model';
//
// export type EntityProductsOfCategoryResponseType = HttpResponse<ProductsOfCategoryWithOrderedQuantity>;
//
// @Injectable()
// export class ProductsToCategoryForFastOrderService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/products-to-category-for-fast-order';
//
//    constructor(private http: HttpClient) { }
//
//    find(id: number): Observable<EntityProductsOfCategoryResponseType> {
//        return this.http.get<ProductsOfCategoryWithOrderedQuantity>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityProductsOfCategoryResponseType) => this.convertResponse(res));
//    }
//
//    private convertResponse(res: EntityProductsOfCategoryResponseType): EntityProductsOfCategoryResponseType {
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
