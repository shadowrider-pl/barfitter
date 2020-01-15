import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPaymentToCashup } from 'app/shared/model/payment-to-cashup.model';

type EntityResponseType = HttpResponse<IPaymentToCashup>;
type EntityArrayResponseType = HttpResponse<IPaymentToCashup[]>;

@Injectable({ providedIn: 'root' })
export class PaymentToCashupService {
  public resourceUrl = SERVER_API_URL + 'api/payment-to-cashups';

  constructor(protected http: HttpClient) {}

  create(paymentToCashup: IPaymentToCashup): Observable<EntityResponseType> {
    return this.http.post<IPaymentToCashup>(this.resourceUrl, paymentToCashup, { observe: 'response' });
  }

  update(paymentToCashup: IPaymentToCashup): Observable<EntityResponseType> {
    return this.http.put<IPaymentToCashup>(this.resourceUrl, paymentToCashup, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPaymentToCashup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPaymentToCashup[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
