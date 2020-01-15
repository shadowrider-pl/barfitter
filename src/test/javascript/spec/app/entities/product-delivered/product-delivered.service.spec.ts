import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { ProductDeliveredService } from 'app/entities/product-delivered/product-delivered.service';
import { IProductDelivered, ProductDelivered } from 'app/shared/model/product-delivered.model';

describe('Service Tests', () => {
  describe('ProductDelivered Service', () => {
    let injector: TestBed;
    let service: ProductDeliveredService;
    let httpMock: HttpTestingController;
    let elemDefault: IProductDelivered;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(ProductDeliveredService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new ProductDelivered(0, 'AAAAAAA', currentDate, 0, 0, 0, 0, 0, 0, 0);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            deliveryDate: currentDate.format(DATE_FORMAT)
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

      it('should create a ProductDelivered', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            deliveryDate: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            deliveryDate: currentDate
          },
          returnedFromService
        );
        service
          .create(new ProductDelivered(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a ProductDelivered', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            deliveryDate: currentDate.format(DATE_FORMAT),
            quantity: 1,
            purchPriceGross: 1,
            sellPriceGross: 1,
            purchPriceNet: 1,
            purchVatValue: 1,
            sellPriceNet: 1,
            sellVatValue: 1
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            deliveryDate: currentDate
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

      it('should return a list of ProductDelivered', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            deliveryDate: currentDate.format(DATE_FORMAT),
            quantity: 1,
            purchPriceGross: 1,
            sellPriceGross: 1,
            purchPriceNet: 1,
            purchVatValue: 1,
            sellPriceNet: 1,
            sellVatValue: 1
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            deliveryDate: currentDate
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

      it('should delete a ProductDelivered', () => {
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
