import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICategory } from '../../../shared/model/category.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<ICategory>;
type EntityArrayResponseType = HttpResponse<ICategory[]>;

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private resourceUrl = SERVER_API_URL + 'api/categoriesfu';

  constructor(private http: HttpClient) {}

  create(category: ICategory): Observable<EntityResponseType> {
    return this.http.post<ICategory>(this.resourceUrl, category, { observe: 'response' });
  }

  update(category: ICategory): Observable<EntityResponseType> {
    return this.http.put<ICategory>(this.resourceUrl, category, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategory[]>(this.resourceUrl, { params: options, observe: 'response' });
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
// import { Category } from './category.model';
// import { createRequestOption } from '../../../shared';
//
// export type EntityResponseType = HttpResponse<Category>;
//
// @Injectable()
// export class CategoryService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/categoriesfu';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/categoriesfu';
//
//    constructor(private http: HttpClient) { }
//
//    create(category: Category): Observable<EntityResponseType> {
//        const copy = this.convert(category);
//        return this.http.post<Category>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(category: Category): Observable<EntityResponseType> {
//        const copy = this.convert(category);
//        return this.http.put<Category>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<Category>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<Category[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Category[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Category[]>) => this.convertArrayResponse(res));
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
//
//    search(req?: any): Observable<HttpResponse<Category[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Category[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Category[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: Category = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<Category[]>): HttpResponse<Category[]> {
//        const jsonResponse: Category[] = res.body;
//        const body: Category[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Category.
//     */
//    private convertItemFromServer(category: Category): Category {
//        const copy: Category = Object.assign({}, category);
//        return copy;
//    }
//
//    /**
//     * Convert a Category to a JSON which can be sent to the server.
//     */
//    private convert(category: Category): Category {
//        const copy: Category = Object.assign({}, category);
//        return copy;
//    }
// }
