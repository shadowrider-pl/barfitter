import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { VatUpdateComponent } from 'app/entities/vat/vat-update.component';
import { VatService } from 'app/entities/vat/vat.service';
import { Vat } from 'app/shared/model/vat.model';

describe('Component Tests', () => {
  describe('Vat Management Update Component', () => {
    let comp: VatUpdateComponent;
    let fixture: ComponentFixture<VatUpdateComponent>;
    let service: VatService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [VatUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(VatUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VatUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(VatService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Vat(123);
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
        const entity = new Vat();
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
