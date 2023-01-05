import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVerifToken } from '../verif-token.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../verif-token.test-samples';

import { VerifTokenService, RestVerifToken } from './verif-token.service';

const requireRestSample: RestVerifToken = {
  ...sampleWithRequiredData,
  expirydate: sampleWithRequiredData.expirydate?.toJSON(),
};

describe('VerifToken Service', () => {
  let service: VerifTokenService;
  let httpMock: HttpTestingController;
  let expectedResult: IVerifToken | IVerifToken[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VerifTokenService);
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

    it('should create a VerifToken', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const verifToken = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(verifToken).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VerifToken', () => {
      const verifToken = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(verifToken).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VerifToken', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VerifToken', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VerifToken', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVerifTokenToCollectionIfMissing', () => {
      it('should add a VerifToken to an empty array', () => {
        const verifToken: IVerifToken = sampleWithRequiredData;
        expectedResult = service.addVerifTokenToCollectionIfMissing([], verifToken);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(verifToken);
      });

      it('should not add a VerifToken to an array that contains it', () => {
        const verifToken: IVerifToken = sampleWithRequiredData;
        const verifTokenCollection: IVerifToken[] = [
          {
            ...verifToken,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVerifTokenToCollectionIfMissing(verifTokenCollection, verifToken);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VerifToken to an array that doesn't contain it", () => {
        const verifToken: IVerifToken = sampleWithRequiredData;
        const verifTokenCollection: IVerifToken[] = [sampleWithPartialData];
        expectedResult = service.addVerifTokenToCollectionIfMissing(verifTokenCollection, verifToken);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(verifToken);
      });

      it('should add only unique VerifToken to an array', () => {
        const verifTokenArray: IVerifToken[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const verifTokenCollection: IVerifToken[] = [sampleWithRequiredData];
        expectedResult = service.addVerifTokenToCollectionIfMissing(verifTokenCollection, ...verifTokenArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const verifToken: IVerifToken = sampleWithRequiredData;
        const verifToken2: IVerifToken = sampleWithPartialData;
        expectedResult = service.addVerifTokenToCollectionIfMissing([], verifToken, verifToken2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(verifToken);
        expect(expectedResult).toContain(verifToken2);
      });

      it('should accept null and undefined values', () => {
        const verifToken: IVerifToken = sampleWithRequiredData;
        expectedResult = service.addVerifTokenToCollectionIfMissing([], null, verifToken, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(verifToken);
      });

      it('should return initial array if no VerifToken is added', () => {
        const verifTokenCollection: IVerifToken[] = [sampleWithRequiredData];
        expectedResult = service.addVerifTokenToCollectionIfMissing(verifTokenCollection, undefined, null);
        expect(expectedResult).toEqual(verifTokenCollection);
      });
    });

    describe('compareVerifToken', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVerifToken(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVerifToken(entity1, entity2);
        const compareResult2 = service.compareVerifToken(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVerifToken(entity1, entity2);
        const compareResult2 = service.compareVerifToken(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVerifToken(entity1, entity2);
        const compareResult2 = service.compareVerifToken(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
