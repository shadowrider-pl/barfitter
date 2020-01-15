import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { ProductSoldDetailComponent } from 'app/entities/product-sold/product-sold-detail.component';
import { ProductSold } from 'app/shared/model/product-sold.model';

describe('Component Tests', () => {
  describe('ProductSold Management Detail Component', () => {
    let comp: ProductSoldDetailComponent;
    let fixture: ComponentFixture<ProductSoldDetailComponent>;
    const route = ({ data: of({ productSold: new ProductSold(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductSoldDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ProductSoldDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductSoldDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.productSold).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
