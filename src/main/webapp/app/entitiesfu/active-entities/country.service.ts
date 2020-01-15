import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { Country } from '../models/country.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityArrayResponseType = HttpResponse<Country[]>;

@Injectable({ providedIn: 'root' })
export class CountryService {
  private resourceUrl = SERVER_API_URL + 'api/countries';

  constructor(private http: HttpClient) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Country[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}

// import { Injectable } from '@angular/core';
// import { SERVER_API_URL } from '../../app.constants';
// import { Country } from '../models/country.model';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { createRequestOption } from '../../shared';
//
// @Injectable()
//  export class CountryService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/countries';
//  constructor(private http: HttpClient) { }
//
//    query(req?: any): Observable<HttpResponse<Country[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Country[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Country[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertArrayResponse(res: HttpResponse<Country[]>): HttpResponse<Country[]> {
//        const jsonResponse: Country[] = res.body;
//        const body: Country[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Country.
//     */
//    private convertItemFromServer(country: Country): Country {
//        const copy: Country = Object.assign({}, country);
//        return copy;
//    }
//
// }
