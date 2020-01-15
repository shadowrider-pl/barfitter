import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BarfitterTestModule } from '../../../test.module';
import { UserToRestaurantDetailComponent } from 'app/entities/user-to-restaurant/user-to-restaurant-detail.component';
import { UserToRestaurant } from 'app/shared/model/user-to-restaurant.model';

describe('Component Tests', () => {
  describe('UserToRestaurant Management Detail Component', () => {
    let comp: UserToRestaurantDetailComponent;
    let fixture: ComponentFixture<UserToRestaurantDetailComponent>;
    const route = ({ data: of({ userToRestaurant: new UserToRestaurant(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BarfitterTestModule],
        declarations: [UserToRestaurantDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(UserToRestaurantDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UserToRestaurantDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.userToRestaurant).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
