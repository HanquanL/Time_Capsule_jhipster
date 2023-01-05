import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISubTimeCapsule } from '../sub-time-capsule.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sub-time-capsule.test-samples';

import { SubTimeCapsuleService, RestSubTimeCapsule } from './sub-time-capsule.service';

const requireRestSample: RestSubTimeCapsule = {
  ...sampleWithRequiredData,
  createdate: sampleWithRequiredData.createdate?.toJSON(),
};

describe('SubTimeCapsule Service', () => {
  let service: SubTimeCapsuleService;
  let httpMock: HttpTestingController;
  let expectedResult: ISubTimeCapsule | ISubTimeCapsule[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SubTimeCapsuleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a SubTimeCapsule', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const subTimeCapsule = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(subTimeCapsule).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SubTimeCapsule', () => {
      const subTimeCapsule = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(subTimeCapsule).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SubTimeCapsule', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SubTimeCapsule', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SubTimeCapsule', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSubTimeCapsuleToCollectionIfMissing', () => {
      it('should add a SubTimeCapsule to an empty array', () => {
        const subTimeCapsule: ISubTimeCapsule = sampleWithRequiredData;
        expectedResult = service.addSubTimeCapsuleToCollectionIfMissing([], subTimeCapsule);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subTimeCapsule);
      });

      it('should not add a SubTimeCapsule to an array that contains it', () => {
        const subTimeCapsule: ISubTimeCapsule = sampleWithRequiredData;
        const subTimeCapsuleCollection: ISubTimeCapsule[] = [
          {
            ...subTimeCapsule,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSubTimeCapsuleToCollectionIfMissing(subTimeCapsuleCollection, subTimeCapsule);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SubTimeCapsule to an array that doesn't contain it", () => {
        const subTimeCapsule: ISubTimeCapsule = sampleWithRequiredData;
        const subTimeCapsuleCollection: ISubTimeCapsule[] = [sampleWithPartialData];
        expectedResult = service.addSubTimeCapsuleToCollectionIfMissing(subTimeCapsuleCollection, subTimeCapsule);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subTimeCapsule);
      });

      it('should add only unique SubTimeCapsule to an array', () => {
        const subTimeCapsuleArray: ISubTimeCapsule[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const subTimeCapsuleCollection: ISubTimeCapsule[] = [sampleWithRequiredData];
        expectedResult = service.addSubTimeCapsuleToCollectionIfMissing(subTimeCapsuleCollection, ...subTimeCapsuleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const subTimeCapsule: ISubTimeCapsule = sampleWithRequiredData;
        const subTimeCapsule2: ISubTimeCapsule = sampleWithPartialData;
        expectedResult = service.addSubTimeCapsuleToCollectionIfMissing([], subTimeCapsule, subTimeCapsule2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subTimeCapsule);
        expect(expectedResult).toContain(subTimeCapsule2);
      });

      it('should accept null and undefined values', () => {
        const subTimeCapsule: ISubTimeCapsule = sampleWithRequiredData;
        expectedResult = service.addSubTimeCapsuleToCollectionIfMissing([], null, subTimeCapsule, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subTimeCapsule);
      });

      it('should return initial array if no SubTimeCapsule is added', () => {
        const subTimeCapsuleCollection: ISubTimeCapsule[] = [sampleWithRequiredData];
        expectedResult = service.addSubTimeCapsuleToCollectionIfMissing(subTimeCapsuleCollection, undefined, null);
        expect(expectedResult).toEqual(subTimeCapsuleCollection);
      });
    });

    describe('compareSubTimeCapsule', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSubTimeCapsule(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSubTimeCapsule(entity1, entity2);
        const compareResult2 = service.compareSubTimeCapsule(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSubTimeCapsule(entity1, entity2);
        const compareResult2 = service.compareSubTimeCapsule(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSubTimeCapsule(entity1, entity2);
        const compareResult2 = service.compareSubTimeCapsule(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
