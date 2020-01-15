import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IFavorite } from '../../../shared/model/favorite.model';
import { ProductsOfCategoryWithOrderedQuantity } from '../../models/products-of-category-with-ordered-quantity.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IFavorite>;
type EntityArrayResponseType = HttpResponse<IFavorite[]>;
type EntityForBarmanResponseType = HttpResponse<ProductsOfCategoryWithOrderedQuantity>;

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private resourceUrl = SERVER_API_URL + 'api/m-favorites';
  private resourceUrlForBarman = SERVER_API_URL + 'api/b-favorites';

  constructor(private http: HttpClient) {}

  create(favorite: IFavorite): Observable<EntityResponseType> {
    return this.http.post<IFavorite>(this.resourceUrl, favorite, { observe: 'response' });
  }

  update(favorite: IFavorite): Observable<EntityResponseType> {
    return this.http.put<IFavorite>(this.resourceUrl, favorite, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFavorite>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findForBarman(): Observable<EntityForBarmanResponseType> {
    return this.http.get<ProductsOfCategoryWithOrderedQuantity>(this.resourceUrlForBarman, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFavorite[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
//
// import { Favorite } from '../../../entities/favorite/';
// import { createRequestOption } from '../../../shared';
// import { ProductsOfCategoryWithOrderedQuantity } from '../../models/products-of-category-with-ordered-quantity.model';
//
// export type EntityResponseType = HttpResponse<Favorite>;
// export type EntityForBarmanResponseType = HttpResponse<ProductsOfCategoryWithOrderedQuantity>;
//
// @Injectable()
// export class FavoritesService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/m-favorites';
//    private resourceUrlForBarman =  SERVER_API_URL + 'api/b-favorites';
//
//    constructor(private http: HttpClient) { }
//
//    create(favorite: Favorite): Observable<EntityResponseType> {
//        const copy = this.convert(favorite);
//        return this.http.post<Favorite>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(favorite: Favorite): Observable<EntityResponseType> {
//        const copy = this.convert(favorite);
//        return this.http.put<Favorite>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<Favorite>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<Favorite[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Favorite[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Favorite[]>) => this.convertArrayResponse(res));
//    }
//
//    findForBarman(): Observable<EntityForBarmanResponseType> {
//        return this.http.get<ProductsOfCategoryWithOrderedQuantity>(this.resourceUrlForBarman, { observe: 'response'})
//            .map((res: EntityForBarmanResponseType) => this.convertResponseForBarman(res));
//    }
//
//    private convertResponseForBarman(res: EntityForBarmanResponseType): EntityForBarmanResponseType {
//        const body: ProductsOfCategoryWithOrderedQuantity = this.convertItemFromServerForBarman(res.body);
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Category.
//     */
//    private convertItemFromServerForBarman(category: ProductsOfCategoryWithOrderedQuantity): ProductsOfCategoryWithOrderedQuantity {
//        const copy: ProductsOfCategoryWithOrderedQuantity = Object.assign({}, category);
//        return copy;
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: Favorite = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<Favorite[]>): HttpResponse<Favorite[]> {
//        const jsonResponse: Favorite[] = res.body;
//        const body: Favorite[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Favorite.
//     */
//    private convertItemFromServer(favorite: Favorite): Favorite {
//        const copy: Favorite = Object.assign({}, favorite);
//        return copy;
//    }
//
//    /**
//     * Convert a Favorite to a JSON which can be sent to the server.
//     */
//    private convert(favorite: Favorite): Favorite {
//        const copy: Favorite = Object.assign({}, favorite);
//        return copy;
//    }
// }
