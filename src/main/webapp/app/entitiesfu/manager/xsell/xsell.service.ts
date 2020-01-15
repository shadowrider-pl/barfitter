import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IXsell } from '../../../shared/model/xsell.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IXsell>;
type EntityArrayResponseType = HttpResponse<IXsell[]>;

@Injectable({ providedIn: 'root' })
export class MXsellService {
  private resourceUrl = SERVER_API_URL + 'api/m-xsells';

  constructor(private http: HttpClient) {}

  create(xsell: IXsell): Observable<EntityResponseType> {
    return this.http.post<IXsell>(this.resourceUrl, xsell, { observe: 'response' });
  }

  update(xsell: IXsell): Observable<EntityResponseType> {
    return this.http.put<IXsell>(this.resourceUrl, xsell, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IXsell>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IXsell[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
