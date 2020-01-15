import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { PaymentToCashupUpdateComponent } from 'app/entities/payment-to-cashup/payment-to-cashup-update.component';
import { PaymentToCashupService } from 'app/entities/payment-to-cashup/payment-to-cashup.service';
import { PaymentToCashup } from 'app/shared/model/payment-to-cashup.model';

describe('Component Tests', () => {
  describe('PaymentToCashup Management Update Component', () => {
    let comp: PaymentToCashupUpdateComponent;
    let fixture: ComponentFixture<PaymentToCashupUpdateComponent>;
    let service: PaymentToCashupService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [PaymentToCashupUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PaymentToCashupUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PaymentToCashupUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PaymentToCashupService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new PaymentToCashup(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new PaymentToCashup();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
