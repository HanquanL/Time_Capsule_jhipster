import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISubTimeCapsule } from '../sub-time-capsule.model';
import { SubTimeCapsuleService } from '../service/sub-time-capsule.service';

import { SubTimeCapsuleRoutingResolveService } from './sub-time-capsule-routing-resolve.service';

describe('SubTimeCapsule routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: SubTimeCapsuleRoutingResolveService;
  let service: SubTimeCapsuleService;
  let resultSubTimeCapsule: ISubTimeCapsule | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(SubTimeCapsuleRoutingResolveService);
    service = TestBed.inject(SubTimeCapsuleService);
    resultSubTimeCapsule = undefined;
  });

  describe('resolve', () => {
    it('should return ISubTimeCapsule returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSubTimeCapsule = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSubTimeCapsule).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSubTimeCapsule = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSubTimeCapsule).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ISubTimeCapsule>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultSubTimeCapsule = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSubTimeCapsule).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
