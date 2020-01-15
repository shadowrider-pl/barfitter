import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { ProductDeliveredDetailComponent } from 'app/entities/product-delivered/product-delivered-detail.component';
import { ProductDelivered } from 'app/shared/model/product-delivered.model';

describe('Component Tests', () => {
  describe('ProductDelivered Management Detail Component', () => {
    let comp: ProductDeliveredDetailComponent;
    let fixture: ComponentFixture<ProductDeliveredDetailComponent>;
    const route = ({ data: of({ productDelivered: new ProductDelivered(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [ProductDeliveredDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ProductDeliveredDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductDeliveredDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.productDelivered).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
