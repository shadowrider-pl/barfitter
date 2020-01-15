import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BarfitterTestModule } from '../../../test.module';
import { ProductTypeDeleteDialogComponent } from 'app/entities/product-type/product-type-delete-dialog.component';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';

describe('Component Tests', () => {
  describe('ProductType Management Delete Component', () => {
    let comp: ProductTypeDeleteDialogComponent;
    let fixture: ComponentFixture<ProductTypeDeleteDialogComponent>;
    let service: ProductTypeService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductTypeDeleteDialogComponent]
      })
        .overrideTemplate(ProductTypeDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductTypeDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductTypeService);
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
