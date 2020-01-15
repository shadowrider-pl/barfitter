import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { ProductOrderedDeleteDialogComponent } from 'app/entities/product-ordered/product-ordered-delete-dialog.component';
import { ProductOrderedService } from 'app/entities/product-ordered/product-ordered.service';

describe('Component Tests', () => {
  describe('ProductOrdered Management Delete Component', () => {
    let comp: ProductOrderedDeleteDialogComponent;
    let fixture: ComponentFixture<ProductOrderedDeleteDialogComponent>;
    let service: ProductOrderedService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductOrderedDeleteDialogComponent]
      })
        .overrideTemplate(ProductOrderedDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductOrderedDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductOrderedService);
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
