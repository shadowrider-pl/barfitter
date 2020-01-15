import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ProductOrderedService } from 'app/entities/product-ordered/product-ordered.service';
import { IProductOrdered, ProductOrdered } from 'app/shared/model/product-ordered.model';

describe('Service Tests', () => {
  describe('ProductOrdered Service', () => {
    let injector: TestBed;
    let service: ProductOrderedService;
    let httpMock: HttpTestingController;
    let elemDefault: IProductOrdered;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(ProductOrderedService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new ProductOrdered(
        0,
        currentDate,
        currentDate,
        currentDate,
        currentDate,
        0,
        'AAAAAAA',
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        currentDate,
        0,
        currentDate
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            orderedTime: currentDate.format(DATE_TIME_FORMAT),
            acceptedTime: currentDate.format(DATE_TIME_FORMAT),
            finishedTime: currentDate.format(DATE_TIME_FORMAT),
            takenTime: currentDate.format(DATE_TIME_FORMAT),
            deliveryDate: currentDate.format(DATE_FORMAT),
            sendTime: currentDate.format(DATE_TIME_FORMAT)
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

      it('should create a ProductOrdered', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            orderedTime: currentDate.format(DATE_TIME_FORMAT),
            acceptedTime: currentDate.format(DATE_TIME_FORMAT),
            finishedTime: currentDate.format(DATE_TIME_FORMAT),
            takenTime: currentDate.format(DATE_TIME_FORMAT),
            deliveryDate: currentDate.format(DATE_FORMAT),
            sendTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            orderedTime: currentDate,
            acceptedTime: currentDate,
            finishedTime: currentDate,
            takenTime: currentDate,
            deliveryDate: currentDate,
            sendTime: currentDate
          },
          returnedFromService
        );
        service
          .create(new ProductOrdered(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a ProductOrdered', () => {
        const returnedFromService = Object.assign(
          {
            orderedTime: currentDate.format(DATE_TIME_FORMAT),
            acceptedTime: currentDate.format(DATE_TIME_FORMAT),
            finishedTime: currentDate.format(DATE_TIME_FORMAT),
            takenTime: currentDate.format(DATE_TIME_FORMAT),
            quantity: 1,
            comment: 'BBBBBB',
            purchPriceNet: 1,
            purchPriceGross: 1,
            purchVatValue: 1,
            sellPriceNet: 1,
            sellPriceGross: 1,
            sellVatValue: 1,
            difference: 1,
            deliveryDate: currentDate.format(DATE_FORMAT),
            orderPosition: 1,
            sendTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            orderedTime: currentDate,
            acceptedTime: currentDate,
            finishedTime: currentDate,
            takenTime: currentDate,
            deliveryDate: currentDate,
            sendTime: currentDate
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

      it('should return a list of ProductOrdered', () => {
        const returnedFromService = Object.assign(
          {
            orderedTime: currentDate.format(DATE_TIME_FORMAT),
            acceptedTime: currentDate.format(DATE_TIME_FORMAT),
            finishedTime: currentDate.format(DATE_TIME_FORMAT),
            takenTime: currentDate.format(DATE_TIME_FORMAT),
            quantity: 1,
            comment: 'BBBBBB',
            purchPriceNet: 1,
            purchPriceGross: 1,
            purchVatValue: 1,
            sellPriceNet: 1,
            sellPriceGross: 1,
            sellVatValue: 1,
            difference: 1,
            deliveryDate: currentDate.format(DATE_FORMAT),
            orderPosition: 1,
            sendTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            orderedTime: currentDate,
            acceptedTime: currentDate,
            finishedTime: currentDate,
            takenTime: currentDate,
            deliveryDate: currentDate,
            sendTime: currentDate
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

      it('should delete a ProductOrdered', () => {
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
