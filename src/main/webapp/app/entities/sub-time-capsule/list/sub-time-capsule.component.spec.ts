import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SubTimeCapsuleService } from '../service/sub-time-capsule.service';

import { SubTimeCapsuleComponent } from './sub-time-capsule.component';

describe('SubTimeCapsule Management Component', () => {
  let comp: SubTimeCapsuleComponent;
  let fixture: ComponentFixture<SubTimeCapsuleComponent>;
  let service: SubTimeCapsuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'sub-time-capsule', component: SubTimeCapsuleComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [SubTimeCapsuleComponent],
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
      .overrideTemplate(SubTimeCapsuleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SubTimeCapsuleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SubTimeCapsuleService);

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
    expect(comp.subTimeCapsules?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to subTimeCapsuleService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSubTimeCapsuleIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSubTimeCapsuleIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
