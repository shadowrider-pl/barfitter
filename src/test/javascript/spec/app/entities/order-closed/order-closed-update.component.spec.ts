import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { OrderClosedUpdateComponent } from 'app/entities/order-closed/order-closed-update.component';
import { OrderClosedService } from 'app/entities/order-closed/order-closed.service';
import { OrderClosed } from 'app/shared/model/order-closed.model';

describe('Component Tests', () => {
  describe('OrderClosed Management Update Component', () => {
    let comp: OrderClosedUpdateComponent;
    let fixture: ComponentFixture<OrderClosedUpdateComponent>;
    let service: OrderClosedService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [OrderClosedUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(OrderClosedUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderClosedUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderClosedService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new OrderClosed(123);
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
        const entity = new OrderClosed();
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
