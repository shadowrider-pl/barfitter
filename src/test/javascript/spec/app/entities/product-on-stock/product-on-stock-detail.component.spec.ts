import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { ProductOnStockDetailComponent } from 'app/entities/product-on-stock/product-on-stock-detail.component';
import { ProductOnStock } from 'app/shared/model/product-on-stock.model';

describe('Component Tests', () => {
  describe('ProductOnStock Management Detail Component', () => {
    let comp: ProductOnStockDetailComponent;
    let fixture: ComponentFixture<ProductOnStockDetailComponent>;
    const route = ({ data: of({ productOnStock: new ProductOnStock(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductOnStockDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ProductOnStockDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductOnStockDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.productOnStock).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
