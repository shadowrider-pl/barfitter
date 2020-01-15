import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { CashupService } from 'app/entities/cashup/cashup.service';
import { ICashup, Cashup } from 'app/shared/model/cashup.model';

describe('Service Tests', () => {
  describe('Cashup Service', () => {
    let injector: TestBed;
    let service: CashupService;
    let httpMock: HttpTestingController;
    let elemDefault: ICashup;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(CashupService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Cashup(0, currentDate, currentDate, 0, 0, 0, 0, 0, 'AAAAAAA');
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            barmanLoginTime: currentDate.format(DATE_TIME_FORMAT),
            cashupTime: currentDate.format(DATE_TIME_FORMAT)
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

      it('should create a Cashup', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            barmanLoginTime: currentDate.format(DATE_TIME_FORMAT),
            cashupTime: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            barmanLoginTime: currentDate,
            cashupTime: currentDate
          },
          returnedFromService
        );
        service
          .create(new Cashup(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Cashup', () => {
        const returnedFromService = Object.assign(
          {
            barmanLoginTime: currentDate.format(DATE_TIME_FORMAT),
            cashupTime: currentDate.format(DATE_TIME_FORMAT),
            startCash: 1,
            endCash: 1,
            totalSale: 1,
            cashTakenByManager: 1,
            cashTakenByBoss: 1,
            comment: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            barmanLoginTime: currentDate,
            cashupTime: currentDate
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

      it('should return a list of Cashup', () => {
        const returnedFromService = Object.assign(
          {
            barmanLoginTime: currentDate.format(DATE_TIME_FORMAT),
            cashupTime: currentDate.format(DATE_TIME_FORMAT),
            startCash: 1,
            endCash: 1,
            totalSale: 1,
            cashTakenByManager: 1,
            cashTakenByBoss: 1,
            comment: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            barmanLoginTime: currentDate,
            cashupTime: currentDate
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

      it('should delete a Cashup', () => {
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
