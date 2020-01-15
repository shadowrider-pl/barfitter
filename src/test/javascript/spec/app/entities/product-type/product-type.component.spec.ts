import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { BarfitterTestModule } from '../../../test.module';
import { ProductTypeComponent } from 'app/entities/product-type/product-type.component';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { ProductType } from 'app/shared/model/product-type.model';

describe('Component Tests', () => {
  describe('ProductType Management Component', () => {
    let comp: ProductTypeComponent;
    let fixture: ComponentFixture<ProductTypeComponent>;
    let service: ProductTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductTypeComponent],
        providers: []
      })
        .overrideTemplate(ProductTypeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductTypeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ProductTypeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ProductType(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.productTypes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
