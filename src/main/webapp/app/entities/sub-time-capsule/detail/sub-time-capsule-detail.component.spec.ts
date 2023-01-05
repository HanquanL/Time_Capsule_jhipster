import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SubTimeCapsuleDetailComponent } from './sub-time-capsule-detail.component';

describe('SubTimeCapsule Management Detail Component', () => {
  let comp: SubTimeCapsuleDetailComponent;
  let fixture: ComponentFixture<SubTimeCapsuleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubTimeCapsuleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ subTimeCapsule: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SubTimeCapsuleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SubTimeCapsuleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load subTimeCapsule on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.subTimeCapsule).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
