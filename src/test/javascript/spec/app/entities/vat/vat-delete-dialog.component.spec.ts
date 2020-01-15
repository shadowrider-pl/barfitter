import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { VatDeleteDialogComponent } from 'app/entities/vat/vat-delete-dialog.component';
import { VatService } from 'app/entities/vat/vat.service';

describe('Component Tests', () => {
  describe('Vat Management Delete Component', () => {
    let comp: VatDeleteDialogComponent;
    let fixture: ComponentFixture<VatDeleteDialogComponent>;
    let service: VatService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [VatDeleteDialogComponent]
      })
        .overrideTemplate(VatDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(VatDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(VatService);
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
