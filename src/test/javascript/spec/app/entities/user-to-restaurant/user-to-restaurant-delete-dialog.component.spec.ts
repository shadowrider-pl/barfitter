import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { UserToRestaurantDeleteDialogComponent } from 'app/entities/user-to-restaurant/user-to-restaurant-delete-dialog.component';
import { UserToRestaurantService } from 'app/entities/user-to-restaurant/user-to-restaurant.service';

describe('Component Tests', () => {
  describe('UserToRestaurant Management Delete Component', () => {
    let comp: UserToRestaurantDeleteDialogComponent;
    let fixture: ComponentFixture<UserToRestaurantDeleteDialogComponent>;
    let service: UserToRestaurantService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [UserToRestaurantDeleteDialogComponent]
      })
        .overrideTemplate(UserToRestaurantDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserToRestaurantDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(UserToRestaurantService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
