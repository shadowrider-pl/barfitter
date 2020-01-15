import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { VatDetailComponent } from 'app/entities/vat/vat-detail.component';
import { Vat } from 'app/shared/model/vat.model';

describe('Component Tests', () => {
  describe('Vat Management Detail Component', () => {
    let comp: VatDetailComponent;
    let fixture: ComponentFixture<VatDetailComponent>;
    const route = ({ data: of({ vat: new Vat(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [VatDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(VatDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(VatDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.vat).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
