import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { UserToRestaurantUpdateComponent } from 'app/entities/user-to-restaurant/user-to-restaurant-update.component';
import { UserToRestaurantService } from 'app/entities/user-to-restaurant/user-to-restaurant.service';
import { UserToRestaurant } from 'app/shared/model/user-to-restaurant.model';

describe('Component Tests', () => {
  describe('UserToRestaurant Management Update Component', () => {
    let comp: UserToRestaurantUpdateComponent;
    let fixture: ComponentFixture<UserToRestaurantUpdateComponent>;
    let service: UserToRestaurantService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [UserToRestaurantUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(UserToRestaurantUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserToRestaurantUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(UserToRestaurantService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new UserToRestaurant(123);
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
        const entity = new UserToRestaurant();
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
