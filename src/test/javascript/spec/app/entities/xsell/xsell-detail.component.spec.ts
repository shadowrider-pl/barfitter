import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { XsellDetailComponent } from 'app/entities/xsell/xsell-detail.component';
import { Xsell } from 'app/shared/model/xsell.model';

describe('Component Tests', () => {
  describe('Xsell Management Detail Component', () => {
    let comp: XsellDetailComponent;
    let fixture: ComponentFixture<XsellDetailComponent>;
    const route = ({ data: of({ xsell: new Xsell(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [XsellDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(XsellDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(XsellDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.xsell).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
