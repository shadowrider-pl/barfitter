import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDesk } from '../../shared/model/desk.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IDesk>;
type EntityArrayResponseType = HttpResponse<IDesk[]>;

@Injectable({ providedIn: 'root' })
export class ActiveDeskService {
  private resourceUrl = SERVER_API_URL + 'api/active-desks';

  constructor(private http: HttpClient) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDesk[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../app.constants';
//
// import { createRequestOption } from '../../shared';
// import { Desk } from '../../shared/model/desk.model';
//
// @Injectable()
// export class ActiveDeskService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/active-desks';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/active-desks';
//
//    constructor(private http: HttpClient) { }
//
//    query(req?: any): Observable<HttpResponse<Desk[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Desk[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Desk[]>) => this.convertArrayResponse(res));
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
// }
