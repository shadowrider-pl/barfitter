import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { OrderClosedDetailComponent } from 'app/entities/order-closed/order-closed-detail.component';
import { OrderClosed } from 'app/shared/model/order-closed.model';

describe('Component Tests', () => {
  describe('OrderClosed Management Detail Component', () => {
    let comp: OrderClosedDetailComponent;
    let fixture: ComponentFixture<OrderClosedDetailComponent>;
    const route = ({ data: of({ orderClosed: new OrderClosed(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [OrderClosedDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OrderClosedDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderClosedDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.orderClosed).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
