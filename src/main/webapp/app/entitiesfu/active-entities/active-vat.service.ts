import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IVat } from '../../shared/model/vat.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IVat>;
type EntityArrayResponseType = HttpResponse<IVat[]>;

@Injectable({ providedIn: 'root' })
export class ActiveVatService {
  private resourceUrl = SERVER_API_URL + 'api/active-vats';

  constructor(private http: HttpClient) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVat[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../app.constants';
//
// import { createRequestOption } from '../../shared';
// import { Vat } from '../../shared/model/vat.model';
//
// export type EntityResponseType = HttpResponse<Vat>;
//
// @Injectable()
// export class ActiveVatService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/active-vats';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/active-vats';
//
//    constructor(private http: HttpClient) { }
//
//    query(req?: any): Observable<HttpResponse<Vat[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Vat[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Vat[]>) => this.convertArrayResponse(res));
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
//
//    private convertArrayResponse(res: HttpResponse<Vat[]>): HttpResponse<Vat[]> {
//        const jsonResponse: Vat[] = res.body;
//        const body: Vat[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Vat.
//     */
//    private convertItemFromServer(vat: Vat): Vat {
//        const copy: Vat = Object.assign({}, vat);
//        return copy;
//    }
// }
