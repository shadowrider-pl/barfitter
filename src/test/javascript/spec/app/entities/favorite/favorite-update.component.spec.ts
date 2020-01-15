import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { FavoriteUpdateComponent } from 'app/entities/favorite/favorite-update.component';
import { FavoriteService } from 'app/entities/favorite/favorite.service';
import { Favorite } from 'app/shared/model/favorite.model';

describe('Component Tests', () => {
  describe('Favorite Management Update Component', () => {
    let comp: FavoriteUpdateComponent;
    let fixture: ComponentFixture<FavoriteUpdateComponent>;
    let service: FavoriteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [FavoriteUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(FavoriteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FavoriteUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FavoriteService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Favorite(123);
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
        const entity = new Favorite();
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
