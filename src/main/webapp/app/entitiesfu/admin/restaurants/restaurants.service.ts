import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { RestaurantSummary } from '../../models/restaurant-summary.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<RestaurantSummary>;
type EntityArrayResponseType = HttpResponse<RestaurantSummary[]>;

@Injectable({ providedIn: 'root' })
export class AdminRestaurantsService {
  private resourceUrl = SERVER_API_URL + 'api/admin-restaurants';

  constructor(private http: HttpClient) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<RestaurantSummary>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestaurantSummary[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
