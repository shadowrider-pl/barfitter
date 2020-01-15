import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { ProductSoldUpdateComponent } from 'app/entities/product-sold/product-sold-update.component';
import { ProductSoldService } from 'app/entities/product-sold/product-sold.service';
import { ProductSold } from 'app/shared/model/product-sold.model';

describe('Component Tests', () => {
  describe('ProductSold Management Update Component', () => {
    let comp: ProductSoldUpdateComponent;
    let fixture: ComponentFixture<ProductSoldUpdateComponent>;
    let service: ProductSoldService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductSoldUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ProductSoldUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductSoldUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductSoldService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ProductSold(123);
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
        const entity = new ProductSold();
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
