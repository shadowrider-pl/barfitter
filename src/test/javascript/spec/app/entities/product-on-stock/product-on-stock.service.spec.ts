import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { ProductOnStockService } from 'app/entities/product-on-stock/product-on-stock.service';
import { IProductOnStock, ProductOnStock } from 'app/shared/model/product-on-stock.model';

describe('Service Tests', () => {
  describe('ProductOnStock Service', () => {
    let injector: TestBed;
    let service: ProductOnStockService;
    let httpMock: HttpTestingController;
    let elemDefault: IProductOnStock;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(ProductOnStockService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new ProductOnStock(0, currentDate, 0, 0, 0, 0, 0, 0, 0);
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

      it('should create a ProductOnStock', () => {
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
          .create(new ProductOnStock(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a ProductOnStock', () => {
        const returnedFromService = Object.assign(
          {
            deliveryDate: currentDate.format(DATE_FORMAT),
            quantity: 1,
            purchPriceNet: 1,
            purchPriceGross: 1,
            purchVatValue: 1,
            sellPriceNet: 1,
            sellPriceGross: 1,
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

      it('should return a list of ProductOnStock', () => {
        const returnedFromService = Object.assign(
          {
            deliveryDate: currentDate.format(DATE_FORMAT),
            quantity: 1,
            purchPriceNet: 1,
            purchPriceGross: 1,
            purchVatValue: 1,
            sellPriceNet: 1,
            sellPriceGross: 1,
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

      it('should delete a ProductOnStock', () => {
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
