import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { BestsellerDeleteDialogComponent } from 'app/entities/bestseller/bestseller-delete-dialog.component';
import { BestsellerService } from 'app/entities/bestseller/bestseller.service';

describe('Component Tests', () => {
  describe('Bestseller Management Delete Component', () => {
    let comp: BestsellerDeleteDialogComponent;
    let fixture: ComponentFixture<BestsellerDeleteDialogComponent>;
    let service: BestsellerService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [BestsellerDeleteDialogComponent]
      })
        .overrideTemplate(BestsellerDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BestsellerDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(BestsellerService);
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
