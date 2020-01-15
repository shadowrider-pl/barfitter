import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { ProductOrderedUpdateComponent } from 'app/entities/product-ordered/product-ordered-update.component';
import { ProductOrderedService } from 'app/entities/product-ordered/product-ordered.service';
import { ProductOrdered } from 'app/shared/model/product-ordered.model';

describe('Component Tests', () => {
  describe('ProductOrdered Management Update Component', () => {
    let comp: ProductOrderedUpdateComponent;
    let fixture: ComponentFixture<ProductOrderedUpdateComponent>;
    let service: ProductOrderedService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductOrderedUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ProductOrderedUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductOrderedUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductOrderedService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ProductOrdered(123);
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
        const entity = new ProductOrdered();
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
