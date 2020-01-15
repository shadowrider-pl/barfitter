import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICategory } from '../../shared/model/category.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<ICategory>;
type EntityArrayResponseType = HttpResponse<ICategory[]>;

@Injectable({ providedIn: 'root' })
export class ActiveCategoryService {
  private resourceUrl = SERVER_API_URL + 'api/active-categories';

  constructor(private http: HttpClient) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../app.constants';
//
// import { createRequestOption } from '../../shared';
// import { Category } from '../../shared/model/category.model';
//
// @Injectable()
// export class ActiveCategoryService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/active-categories';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/active-categories';
//
//    constructor(private http: HttpClient) { }
//
//    query(req?: any): Observable<HttpResponse<Category[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Category[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Category[]>) => this.convertArrayResponse(res));
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
// }
