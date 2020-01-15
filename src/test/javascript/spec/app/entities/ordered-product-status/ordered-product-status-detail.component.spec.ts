import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { OrderedProductStatusDetailComponent } from 'app/entities/ordered-product-status/ordered-product-status-detail.component';
import { OrderedProductStatus } from 'app/shared/model/ordered-product-status.model';

describe('Component Tests', () => {
  describe('OrderedProductStatus Management Detail Component', () => {
    let comp: OrderedProductStatusDetailComponent;
    let fixture: ComponentFixture<OrderedProductStatusDetailComponent>;
    const route = ({ data: of({ orderedProductStatus: new OrderedProductStatus(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [OrderedProductStatusDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OrderedProductStatusDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderedProductStatusDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.orderedProductStatus).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
