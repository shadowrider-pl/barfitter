import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { OrderClosedDeleteDialogComponent } from 'app/entities/order-closed/order-closed-delete-dialog.component';
import { OrderClosedService } from 'app/entities/order-closed/order-closed.service';

describe('Component Tests', () => {
  describe('OrderClosed Management Delete Component', () => {
    let comp: OrderClosedDeleteDialogComponent;
    let fixture: ComponentFixture<OrderClosedDeleteDialogComponent>;
    let service: OrderClosedService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [OrderClosedDeleteDialogComponent]
      })
        .overrideTemplate(OrderClosedDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderClosedDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderClosedService);
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
