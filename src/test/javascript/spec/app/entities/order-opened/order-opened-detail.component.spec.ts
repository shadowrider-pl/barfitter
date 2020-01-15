import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { OrderOpenedDetailComponent } from 'app/entities/order-opened/order-opened-detail.component';
import { OrderOpened } from 'app/shared/model/order-opened.model';

describe('Component Tests', () => {
  describe('OrderOpened Management Detail Component', () => {
    let comp: OrderOpenedDetailComponent;
    let fixture: ComponentFixture<OrderOpenedDetailComponent>;
    const route = ({ data: of({ orderOpened: new OrderOpened(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [OrderOpenedDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OrderOpenedDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderOpenedDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.orderOpened).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
