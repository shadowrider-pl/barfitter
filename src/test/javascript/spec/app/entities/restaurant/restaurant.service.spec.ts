import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { RestaurantService } from 'app/entities/restaurant/restaurant.service';
import { IRestaurant, Restaurant } from 'app/shared/model/restaurant.model';

describe('Service Tests', () => {
  describe('Restaurant Service', () => {
    let injector: TestBed;
    let service: RestaurantService;
    let httpMock: HttpTestingController;
    let elemDefault: IRestaurant;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(RestaurantService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Restaurant(
        0,
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        'AAAAAAA',
        currentDate,
        'AAAAAAA',
        'AAAAAAA',
        0,
        'AAAAAAA',
        currentDate
      );
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            licenceDate: currentDate.format(DATE_FORMAT),
            createdDate: currentDate.format(DATE_FORMAT)
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

      it('should create a Restaurant', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            licenceDate: currentDate.format(DATE_FORMAT),
            createdDate: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            licenceDate: currentDate,
            createdDate: currentDate
          },
          returnedFromService
        );
        service
          .create(new Restaurant(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Restaurant', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            country: 'BBBBBB',
            address: 'BBBBBB',
            zipCode: 'BBBBBB',
            city: 'BBBBBB',
            vatNumber: 'BBBBBB',
            licenceDate: currentDate.format(DATE_FORMAT),
            licenceType: 'BBBBBB',
            nextLicenceType: 'BBBBBB',
            adsLevel: 1,
            currency: 'BBBBBB',
            createdDate: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            licenceDate: currentDate,
            createdDate: currentDate
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

      it('should return a list of Restaurant', () => {
        const returnedFromService = Object.assign(
          {
            name: 'BBBBBB',
            country: 'BBBBBB',
            address: 'BBBBBB',
            zipCode: 'BBBBBB',
            city: 'BBBBBB',
            vatNumber: 'BBBBBB',
            licenceDate: currentDate.format(DATE_FORMAT),
            licenceType: 'BBBBBB',
            nextLicenceType: 'BBBBBB',
            adsLevel: 1,
            currency: 'BBBBBB',
            createdDate: currentDate.format(DATE_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            licenceDate: currentDate,
            createdDate: currentDate
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

      it('should delete a Restaurant', () => {
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
