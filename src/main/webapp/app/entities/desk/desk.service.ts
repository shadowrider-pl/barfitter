import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDesk } from 'app/shared/model/desk.model';

type EntityResponseType = HttpResponse<IDesk>;
type EntityArrayResponseType = HttpResponse<IDesk[]>;

@Injectable({ providedIn: 'root' })
export class DeskService {
  public resourceUrl = SERVER_API_URL + 'api/desks';

  constructor(protected http: HttpClient) {}

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
