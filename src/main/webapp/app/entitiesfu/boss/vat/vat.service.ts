import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../../../app.constants';

import { createRequestOption } from 'app/shared/util/request-util';
import { Vat, IVat } from '../../../shared/model/vat.model';

type EntityResponseType = HttpResponse<IVat>;
type EntityArrayResponseType = HttpResponse<IVat[]>;

@Injectable({ providedIn: 'root' })
export class BossVatService {
  private resourceUrl = SERVER_API_URL + 'api/vatsfu';

  constructor(private http: HttpClient) {}

  create(vat: IVat): Observable<EntityResponseType> {
    return this.http.post<IVat>(this.resourceUrl, vat, { observe: 'response' });
  }

  update(vat: IVat): Observable<EntityResponseType> {
    return this.http.put<IVat>(this.resourceUrl, vat, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVat>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVat[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

// export type EntityResponseType = HttpResponse<Vat>;
//
// @Injectable()
// export class VatService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/vatsfu';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/vatsfu';
//
//    constructor(private http: HttpClient) { }

//    create(vat: Vat): Observable<EntityResponseType> {
//        const copy = this.convert(vat);
//        return this.http.post<Vat>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(vat: Vat): Observable<EntityResponseType> {
//        const copy = this.convert(vat);
//        return this.http.put<Vat>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<Vat>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
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
//    search(req?: any): Observable<HttpResponse<Vat[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Vat[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Vat[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: Vat = this.convertItemFromServer(res.body);
//        return res.clone({body});
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
//
//    /**
//     * Convert a Vat to a JSON which can be sent to the server.
//     */
//    private convert(vat: Vat): Vat {
//        const copy: Vat = Object.assign({}, vat);
//        return copy;
//    }
