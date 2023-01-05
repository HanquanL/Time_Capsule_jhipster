import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VerifTokenService } from '../service/verif-token.service';

import { VerifTokenComponent } from './verif-token.component';

describe('VerifToken Management Component', () => {
  let comp: VerifTokenComponent;
  let fixture: ComponentFixture<VerifTokenComponent>;
  let service: VerifTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'verif-token', component: VerifTokenComponent }]), HttpClientTestingModule],
      declarations: [VerifTokenComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(VerifTokenComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VerifTokenComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VerifTokenService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.verifTokens?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to verifTokenService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVerifTokenIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVerifTokenIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
