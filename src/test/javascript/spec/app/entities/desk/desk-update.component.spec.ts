import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { DeskUpdateComponent } from 'app/entities/desk/desk-update.component';
import { DeskService } from 'app/entities/desk/desk.service';
import { Desk } from 'app/shared/model/desk.model';

describe('Component Tests', () => {
  describe('Desk Management Update Component', () => {
    let comp: DeskUpdateComponent;
    let fixture: ComponentFixture<DeskUpdateComponent>;
    let service: DeskService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [DeskUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DeskUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DeskUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DeskService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Desk(123);
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
        const entity = new Desk();
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
