import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { OrderedProductStatusUpdateComponent } from 'app/entities/ordered-product-status/ordered-product-status-update.component';
import { OrderedProductStatusService } from 'app/entities/ordered-product-status/ordered-product-status.service';
import { OrderedProductStatus } from 'app/shared/model/ordered-product-status.model';

describe('Component Tests', () => {
  describe('OrderedProductStatus Management Update Component', () => {
    let comp: OrderedProductStatusUpdateComponent;
    let fixture: ComponentFixture<OrderedProductStatusUpdateComponent>;
    let service: OrderedProductStatusService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [OrderedProductStatusUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(OrderedProductStatusUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderedProductStatusUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderedProductStatusService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new OrderedProductStatus(123);
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
        const entity = new OrderedProductStatus();
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
