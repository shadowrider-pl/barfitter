import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { FavoriteDeleteDialogComponent } from 'app/entities/favorite/favorite-delete-dialog.component';
import { FavoriteService } from 'app/entities/favorite/favorite.service';

describe('Component Tests', () => {
  describe('Favorite Management Delete Component', () => {
    let comp: FavoriteDeleteDialogComponent;
    let fixture: ComponentFixture<FavoriteDeleteDialogComponent>;
    let service: FavoriteService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [FavoriteDeleteDialogComponent]
      })
        .overrideTemplate(FavoriteDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FavoriteDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FavoriteService);
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
