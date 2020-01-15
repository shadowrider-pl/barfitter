import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IBestseller } from 'app/shared/model/bestseller.model';

type EntityResponseType = HttpResponse<IBestseller>;
type EntityArrayResponseType = HttpResponse<IBestseller[]>;

@Injectable({ providedIn: 'root' })
export class BestsellerService {
  public resourceUrl = SERVER_API_URL + 'api/bestsellers';

  constructor(protected http: HttpClient) {}

  create(bestseller: IBestseller): Observable<EntityResponseType> {
    return this.http.post<IBestseller>(this.resourceUrl, bestseller, { observe: 'response' });
  }

  update(bestseller: IBestseller): Observable<EntityResponseType> {
    return this.http.put<IBestseller>(this.resourceUrl, bestseller, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBestseller>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBestseller[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
