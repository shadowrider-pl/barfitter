import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { CashupDetailComponent } from 'app/entities/cashup/cashup-detail.component';
import { Cashup } from 'app/shared/model/cashup.model';

describe('Component Tests', () => {
  describe('Cashup Management Detail Component', () => {
    let comp: CashupDetailComponent;
    let fixture: ComponentFixture<CashupDetailComponent>;
    const route = ({ data: of({ cashup: new Cashup(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [CashupDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CashupDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CashupDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.cashup).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
