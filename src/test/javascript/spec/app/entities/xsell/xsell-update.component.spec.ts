import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { XsellUpdateComponent } from 'app/entities/xsell/xsell-update.component';
import { XsellService } from 'app/entities/xsell/xsell.service';
import { Xsell } from 'app/shared/model/xsell.model';

describe('Component Tests', () => {
  describe('Xsell Management Update Component', () => {
    let comp: XsellUpdateComponent;
    let fixture: ComponentFixture<XsellUpdateComponent>;
    let service: XsellService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [XsellUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(XsellUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(XsellUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(XsellService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Xsell(123);
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
        const entity = new Xsell();
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
