import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { ProductOnStockUpdateComponent } from 'app/entities/product-on-stock/product-on-stock-update.component';
import { ProductOnStockService } from 'app/entities/product-on-stock/product-on-stock.service';
import { ProductOnStock } from 'app/shared/model/product-on-stock.model';

describe('Component Tests', () => {
  describe('ProductOnStock Management Update Component', () => {
    let comp: ProductOnStockUpdateComponent;
    let fixture: ComponentFixture<ProductOnStockUpdateComponent>;
    let service: ProductOnStockService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductOnStockUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ProductOnStockUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductOnStockUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductOnStockService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ProductOnStock(123);
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
        const entity = new ProductOnStock();
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
