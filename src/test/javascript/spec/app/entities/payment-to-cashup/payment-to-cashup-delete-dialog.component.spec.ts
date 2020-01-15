import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { PaymentToCashupDeleteDialogComponent } from 'app/entities/payment-to-cashup/payment-to-cashup-delete-dialog.component';
import { PaymentToCashupService } from 'app/entities/payment-to-cashup/payment-to-cashup.service';

describe('Component Tests', () => {
  describe('PaymentToCashup Management Delete Component', () => {
    let comp: PaymentToCashupDeleteDialogComponent;
    let fixture: ComponentFixture<PaymentToCashupDeleteDialogComponent>;
    let service: PaymentToCashupService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [PaymentToCashupDeleteDialogComponent]
      })
        .overrideTemplate(PaymentToCashupDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PaymentToCashupDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PaymentToCashupService);
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
