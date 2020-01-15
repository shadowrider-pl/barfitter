import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { OrderOpenedUpdateComponent } from 'app/entities/order-opened/order-opened-update.component';
import { OrderOpenedService } from 'app/entities/order-opened/order-opened.service';
import { OrderOpened } from 'app/shared/model/order-opened.model';

describe('Component Tests', () => {
  describe('OrderOpened Management Update Component', () => {
    let comp: OrderOpenedUpdateComponent;
    let fixture: ComponentFixture<OrderOpenedUpdateComponent>;
    let service: OrderOpenedService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [OrderOpenedUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(OrderOpenedUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderOpenedUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderOpenedService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new OrderOpened(123);
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
        const entity = new OrderOpened();
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
