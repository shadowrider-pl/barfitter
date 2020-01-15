import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { BestsellerUpdateComponent } from 'app/entities/bestseller/bestseller-update.component';
import { BestsellerService } from 'app/entities/bestseller/bestseller.service';
import { Bestseller } from 'app/shared/model/bestseller.model';

describe('Component Tests', () => {
  describe('Bestseller Management Update Component', () => {
    let comp: BestsellerUpdateComponent;
    let fixture: ComponentFixture<BestsellerUpdateComponent>;
    let service: BestsellerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [BestsellerUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(BestsellerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BestsellerUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BestsellerService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Bestseller(123);
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
        const entity = new Bestseller();
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
