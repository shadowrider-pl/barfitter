import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { ProductOnStockDeleteDialogComponent } from 'app/entities/product-on-stock/product-on-stock-delete-dialog.component';
import { ProductOnStockService } from 'app/entities/product-on-stock/product-on-stock.service';

describe('Component Tests', () => {
  describe('ProductOnStock Management Delete Component', () => {
    let comp: ProductOnStockDeleteDialogComponent;
    let fixture: ComponentFixture<ProductOnStockDeleteDialogComponent>;
    let service: ProductOnStockService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductOnStockDeleteDialogComponent]
      })
        .overrideTemplate(ProductOnStockDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductOnStockDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductOnStockService);
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
