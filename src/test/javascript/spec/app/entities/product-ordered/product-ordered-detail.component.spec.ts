import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { ProductOrderedDetailComponent } from 'app/entities/product-ordered/product-ordered-detail.component';
import { ProductOrdered } from 'app/shared/model/product-ordered.model';

describe('Component Tests', () => {
  describe('ProductOrdered Management Detail Component', () => {
    let comp: ProductOrderedDetailComponent;
    let fixture: ComponentFixture<ProductOrderedDetailComponent>;
    const route = ({ data: of({ productOrdered: new ProductOrdered(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductOrderedDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ProductOrderedDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductOrderedDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.productOrdered).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
