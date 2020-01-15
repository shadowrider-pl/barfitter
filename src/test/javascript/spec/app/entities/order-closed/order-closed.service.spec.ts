import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { OrderClosedService } from 'app/entities/order-closed/order-closed.service';
import { IOrderClosed, OrderClosed } from 'app/shared/model/order-closed.model';

describe('Service Tests', () => {
  describe('OrderClosed Service', () => {
    let injector: TestBed;
    let service: OrderClosedService;
    let httpMock: HttpTestingController;
    let elemDefault: IOrderClosed;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(OrderClosedService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new OrderClosed(0, currentDate, currentDate, 0, 'AAAAAAA', 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            openingTime: currentDate.format(DATE_TIME_FORMAT),
            closingTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a OrderClosed', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            openingTime: currentDate.format(DATE_TIME_FORMAT),
            closingTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            openingTime: currentDate,
            closingTime: currentDate
          },
          returnedFromService
        );
        service
          .create(new OrderClosed(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a OrderClosed', () => {
        const returnedFromService = Object.assign(
          {
            openingTime: currentDate.format(DATE_TIME_FORMAT),
            closingTime: currentDate.format(DATE_TIME_FORMAT),
            total: 1,
            comment: 'BBBBBB',
            orderId: 1
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            openingTime: currentDate,
            closingTime: currentDate
          },
          returnedFromService
        );
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of OrderClosed', () => {
        const returnedFromService = Object.assign(
          {
            openingTime: currentDate.format(DATE_TIME_FORMAT),
            closingTime: currentDate.format(DATE_TIME_FORMAT),
            total: 1,
            comment: 'BBBBBB',
            orderId: 1
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            openingTime: currentDate,
            closingTime: currentDate
          },
          returnedFromService
        );
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a OrderClosed', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
