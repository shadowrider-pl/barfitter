import { SERVER_API_URL } from '../../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPayment } from '../../../shared/model/payment.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IPayment>;
type EntityArrayResponseType = HttpResponse<IPayment[]>;

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private resourceUrl = SERVER_API_URL + 'api/paymentsfu';

  constructor(private http: HttpClient) {}

  create(payment: IPayment): Observable<EntityResponseType> {
    return this.http.post<IPayment>(this.resourceUrl, payment, { observe: 'response' });
  }

  update(payment: IPayment): Observable<EntityResponseType> {
    return this.http.put<IPayment>(this.resourceUrl, payment, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPayment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPayment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../../app.constants';
//
// import { Payment } from './payment.model';
// import { createRequestOption } from '../../../shared';
//
// export type EntityResponseType = HttpResponse<Payment>;
//
// @Injectable()
// export class PaymentService {
//
//    private resourceUrl =  SERVER_API_URL + 'api/paymentsfu';
//    private resourceSearchUrl = SERVER_API_URL + 'api/_search/paymentsfu';
//
//    constructor(private http: HttpClient) { }
//
//    create(payment: Payment): Observable<EntityResponseType> {
//        const copy = this.convert(payment);
//        return this.http.post<Payment>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    update(payment: Payment): Observable<EntityResponseType> {
//        const copy = this.convert(payment);
//        return this.http.put<Payment>(this.resourceUrl, copy, { observe: 'response' })
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    find(id: number): Observable<EntityResponseType> {
//        return this.http.get<Payment>(`${this.resourceUrl}/${id}`, { observe: 'response'})
//            .map((res: EntityResponseType) => this.convertResponse(res));
//    }
//
//    query(req?: any): Observable<HttpResponse<Payment[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Payment[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Payment[]>) => this.convertArrayResponse(res));
//    }
//
//    delete(id: number): Observable<HttpResponse<any>> {
//        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
//    }
//
//    search(req?: any): Observable<HttpResponse<Payment[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Payment[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Payment[]>) => this.convertArrayResponse(res));
//    }
//
//    private convertResponse(res: EntityResponseType): EntityResponseType {
//        const body: Payment = this.convertItemFromServer(res.body);
//        return res.clone({body});
//    }
//
//    private convertArrayResponse(res: HttpResponse<Payment[]>): HttpResponse<Payment[]> {
//        const jsonResponse: Payment[] = res.body;
//        const body: Payment[] = [];
//        for (let i = 0; i < jsonResponse.length; i++) {
//            body.push(this.convertItemFromServer(jsonResponse[i]));
//        }
//        return res.clone({body});
//    }
//
//    /**
//     * Convert a returned JSON object to Payment.
//     */
//    private convertItemFromServer(payment: Payment): Payment {
//        const copy: Payment = Object.assign({}, payment);
//        return copy;
//    }
//
//    /**
//     * Convert a Payment to a JSON which can be sent to the server.
//     */
//    private convert(payment: Payment): Payment {
//        const copy: Payment = Object.assign({}, payment);
//        return copy;
//    }
// }
