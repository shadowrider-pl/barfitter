import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { ProductDeliveredUpdateComponent } from 'app/entities/product-delivered/product-delivered-update.component';
import { ProductDeliveredService } from 'app/entities/product-delivered/product-delivered.service';
import { ProductDelivered } from 'app/shared/model/product-delivered.model';

describe('Component Tests', () => {
  describe('ProductDelivered Management Update Component', () => {
    let comp: ProductDeliveredUpdateComponent;
    let fixture: ComponentFixture<ProductDeliveredUpdateComponent>;
    let service: ProductDeliveredService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductDeliveredUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ProductDeliveredUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductDeliveredUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductDeliveredService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ProductDelivered(123);
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
        const entity = new ProductDelivered();
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
