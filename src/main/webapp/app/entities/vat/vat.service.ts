import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IVat } from 'app/shared/model/vat.model';

type EntityResponseType = HttpResponse<IVat>;
type EntityArrayResponseType = HttpResponse<IVat[]>;

@Injectable({ providedIn: 'root' })
export class VatService {
  public resourceUrl = SERVER_API_URL + 'api/vats';

  constructor(protected http: HttpClient) {}

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
