import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { FavoriteDetailComponent } from 'app/entities/favorite/favorite-detail.component';
import { Favorite } from 'app/shared/model/favorite.model';

describe('Component Tests', () => {
  describe('Favorite Management Detail Component', () => {
    let comp: FavoriteDetailComponent;
    let fixture: ComponentFixture<FavoriteDetailComponent>;
    const route = ({ data: of({ favorite: new Favorite(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [FavoriteDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(FavoriteDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FavoriteDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.favorite).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
