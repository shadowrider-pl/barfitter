import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProductType } from 'app/shared/model/product-type.model';

type EntityResponseType = HttpResponse<IProductType>;
type EntityArrayResponseType = HttpResponse<IProductType[]>;

@Injectable({ providedIn: 'root' })
export class ProductTypeService {
  public resourceUrl = SERVER_API_URL + 'api/product-types';

  constructor(protected http: HttpClient) {}

  create(productType: IProductType): Observable<EntityResponseType> {
    return this.http.post<IProductType>(this.resourceUrl, productType, { observe: 'response' });
  }

  update(productType: IProductType): Observable<EntityResponseType> {
    return this.http.put<IProductType>(this.resourceUrl, productType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
