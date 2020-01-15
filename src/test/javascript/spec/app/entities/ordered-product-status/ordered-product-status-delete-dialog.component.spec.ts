import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { OrderedProductStatusDeleteDialogComponent } from 'app/entities/ordered-product-status/ordered-product-status-delete-dialog.component';
import { OrderedProductStatusService } from 'app/entities/ordered-product-status/ordered-product-status.service';

describe('Component Tests', () => {
  describe('OrderedProductStatus Management Delete Component', () => {
    let comp: OrderedProductStatusDeleteDialogComponent;
    let fixture: ComponentFixture<OrderedProductStatusDeleteDialogComponent>;
    let service: OrderedProductStatusService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [OrderedProductStatusDeleteDialogComponent]
      })
        .overrideTemplate(OrderedProductStatusDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderedProductStatusDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OrderedProductStatusService);
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
