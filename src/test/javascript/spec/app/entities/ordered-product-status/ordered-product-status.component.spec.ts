import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { BarfitterTestModule } from '../../../test.module';
import { OrderedProductStatusComponent } from 'app/entities/ordered-product-status/ordered-product-status.component';
import { OrderedProductStatusService } from 'app/entities/ordered-product-status/ordered-product-status.service';
import { OrderedProductStatus } from 'app/shared/model/ordered-product-status.model';

describe('Component Tests', () => {
  describe('OrderedProductStatus Management Component', () => {
    let comp: OrderedProductStatusComponent;
    let fixture: ComponentFixture<OrderedProductStatusComponent>;
    let service: OrderedProductStatusService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [OrderedProductStatusComponent],
        providers: []
      })
        .overrideTemplate(OrderedProductStatusComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderedProductStatusComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderedProductStatusService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new OrderedProductStatus(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.orderedProductStatuses[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
