import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { DeskDetailComponent } from 'app/entities/desk/desk-detail.component';
import { Desk } from 'app/shared/model/desk.model';

describe('Component Tests', () => {
  describe('Desk Management Detail Component', () => {
    let comp: DeskDetailComponent;
    let fixture: ComponentFixture<DeskDetailComponent>;
    const route = ({ data: of({ desk: new Desk(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [DeskDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DeskDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DeskDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.desk).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
