import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDesk } from '../../../shared/model/desk.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IDesk>;
type EntityArrayResponseType = HttpResponse<IDesk[]>;

@Injectable({ providedIn: 'root' })
export class DeskService {
  private resourceUrl = SERVER_API_URL + 'api/desksfu';

  constructor(private http: HttpClient) {}

  create(desk: IDesk): Observable<EntityResponseType> {
    return this.http.post<IDesk>(this.resourceUrl, desk, { observe: 'response' });
  }

  update(desk: IDesk): Observable<EntityResponseType> {
    return this.http.put<IDesk>(this.resourceUrl, desk, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDesk>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDesk[]>(this.resourceUrl, { params: options, observe: 'response' });
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
// import { createRequestOption } from '../../../shared';
// import { Desk } from '../../../shared/model/desk.model';
//
// export type EntityResponseType = HttpResponse<Desk>;
//
// @Injectable()
// export class DeskService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/desksfu';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/desksfu';
//
//    constructor(private http: HttpClient) { }
//
//    create(desk: Desk): Observable<EntityResponseType> {
//        const copy = this.convert(desk);
//        return this.http.post<Desk>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(desk: Desk): Observable<EntityResponseType> {
//        const copy = this.convert(desk);
//        return this.http.put<Desk>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<Desk>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<Desk[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Desk[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Desk[]>) => this.convertArrayResponse(res));
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
//
//    search(req?: any): Observable<HttpResponse<Desk[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Desk[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Desk[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: Desk = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<Desk[]>): HttpResponse<Desk[]> {
//        const jsonResponse: Desk[] = res.body;
//        const body: Desk[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Desk.
//     */
//    private convertItemFromServer(desk: Desk): Desk {
//        const copy: Desk = Object.assign({}, desk);
//        return copy;
//    }
//
//    /**
//     * Convert a Desk to a JSON which can be sent to the server.
//     */
//    private convert(desk: Desk): Desk {
//        const copy: Desk = Object.assign({}, desk);
//        return copy;
//    }
// }
