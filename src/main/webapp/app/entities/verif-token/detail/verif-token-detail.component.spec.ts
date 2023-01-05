import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VerifTokenDetailComponent } from './verif-token-detail.component';

describe('VerifToken Management Detail Component', () => {
  let comp: VerifTokenDetailComponent;
  let fixture: ComponentFixture<VerifTokenDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifTokenDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ verifToken: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VerifTokenDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VerifTokenDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load verifToken on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.verifToken).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
