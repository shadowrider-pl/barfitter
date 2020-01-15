import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { CashupUpdateComponent } from 'app/entities/cashup/cashup-update.component';
import { CashupService } from 'app/entities/cashup/cashup.service';
import { Cashup } from 'app/shared/model/cashup.model';

describe('Component Tests', () => {
  describe('Cashup Management Update Component', () => {
    let comp: CashupUpdateComponent;
    let fixture: ComponentFixture<CashupUpdateComponent>;
    let service: CashupService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [CashupUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CashupUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CashupUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CashupService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Cashup(123);
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
        const entity = new Cashup();
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
