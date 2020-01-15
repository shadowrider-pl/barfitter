import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { PaymentToCashupDetailComponent } from 'app/entities/payment-to-cashup/payment-to-cashup-detail.component';
import { PaymentToCashup } from 'app/shared/model/payment-to-cashup.model';

describe('Component Tests', () => {
  describe('PaymentToCashup Management Detail Component', () => {
    let comp: PaymentToCashupDetailComponent;
    let fixture: ComponentFixture<PaymentToCashupDetailComponent>;
    const route = ({ data: of({ paymentToCashup: new PaymentToCashup(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [PaymentToCashupDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(PaymentToCashupDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PaymentToCashupDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.paymentToCashup).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
