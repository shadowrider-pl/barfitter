import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { XsellDeleteDialogComponent } from 'app/entities/xsell/xsell-delete-dialog.component';
import { XsellService } from 'app/entities/xsell/xsell.service';

describe('Component Tests', () => {
  describe('Xsell Management Delete Component', () => {
    let comp: XsellDeleteDialogComponent;
    let fixture: ComponentFixture<XsellDeleteDialogComponent>;
    let service: XsellService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [XsellDeleteDialogComponent]
      })
        .overrideTemplate(XsellDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(XsellDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(XsellService);
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
