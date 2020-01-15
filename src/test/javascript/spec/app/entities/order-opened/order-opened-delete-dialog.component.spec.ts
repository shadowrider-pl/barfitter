import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { OrderOpenedDeleteDialogComponent } from 'app/entities/order-opened/order-opened-delete-dialog.component';
import { OrderOpenedService } from 'app/entities/order-opened/order-opened.service';

describe('Component Tests', () => {
  describe('OrderOpened Management Delete Component', () => {
    let comp: OrderOpenedDeleteDialogComponent;
    let fixture: ComponentFixture<OrderOpenedDeleteDialogComponent>;
    let service: OrderOpenedService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [OrderOpenedDeleteDialogComponent]
      })
        .overrideTemplate(OrderOpenedDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderOpenedDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderOpenedService);
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
