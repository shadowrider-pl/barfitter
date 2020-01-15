import { SERVER_API_URL } from '../../app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPayment } from '../../shared/model/payment.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

type EntityResponseType = HttpResponse<IPayment>;
type EntityArrayResponseType = HttpResponse<IPayment[]>;

@Injectable({ providedIn: 'root' })
export class ActivePaymentService {
  private resourceUrl = SERVER_API_URL + 'api/active-payments';

  constructor(private http: HttpClient) {}

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPayment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
// import { SERVER_API_URL } from '../../app.constants';
//
// import { createRequestOption } from '../../shared';
// import { Payment } from '../../shared/model/payment.model';
//
// export type EntityResponseType = HttpResponse<Payment>;
//
// @Injectable()
// export class ActivePaymentService {
//
//  private resourceUrl = SERVER_API_URL + 'api/active-payments';
//  private resourceSearchUrl = SERVER_API_URL + 'api/_search/active-payments';
//
//  constructor(private http: HttpClient) { }
//
//  query(req?: any): Observable<HttpResponse<Payment[]>> {
//        const options = createRequestOption(req);
//        return this.http.get<Payment[]>(this.resourceUrl, { params: options, observe: 'response' })
//            .map((res: HttpResponse<Payment[]>) => this.convertArrayResponse(res));
//    }
//
// private convertResponse(res: EntityResponseType): EntityResponseType {
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
//  }
