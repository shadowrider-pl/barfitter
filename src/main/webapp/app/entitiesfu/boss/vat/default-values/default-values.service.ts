import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../../../../app.constants';
import { Defaults } from 'app/entitiesfu/models/defaults';

type EntityResponseType = HttpResponse<Defaults>;

@Injectable({ providedIn: 'root' })
export class DefaultValuesService {
  private resourceUrl = SERVER_API_URL + 'api/load-defaults';

  constructor(private http: HttpClient) {}

  create(defaults: Defaults): Observable<EntityResponseType> {
    return this.http.post<Defaults>(this.resourceUrl, defaults, { observe: 'response' });
  }
}
