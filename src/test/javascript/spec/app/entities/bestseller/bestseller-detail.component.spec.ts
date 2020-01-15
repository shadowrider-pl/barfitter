import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { BestsellerDetailComponent } from 'app/entities/bestseller/bestseller-detail.component';
import { Bestseller } from 'app/shared/model/bestseller.model';

describe('Component Tests', () => {
  describe('Bestseller Management Detail Component', () => {
    let comp: BestsellerDetailComponent;
    let fixture: ComponentFixture<BestsellerDetailComponent>;
    const route = ({ data: of({ bestseller: new Bestseller(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [BestsellerDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(BestsellerDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BestsellerDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.bestseller).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
