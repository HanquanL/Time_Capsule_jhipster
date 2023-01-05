import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserUploadFile } from '../user-upload-file.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-upload-file.test-samples';

import { UserUploadFileService } from './user-upload-file.service';

const requireRestSample: IUserUploadFile = {
  ...sampleWithRequiredData,
};

describe('UserUploadFile Service', () => {
  let service: UserUploadFileService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserUploadFile | IUserUploadFile[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserUploadFileService);
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

    it('should create a UserUploadFile', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userUploadFile = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userUploadFile).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserUploadFile', () => {
      const userUploadFile = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userUploadFile).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserUploadFile', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserUploadFile', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserUploadFile', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserUploadFileToCollectionIfMissing', () => {
      it('should add a UserUploadFile to an empty array', () => {
        const userUploadFile: IUserUploadFile = sampleWithRequiredData;
        expectedResult = service.addUserUploadFileToCollectionIfMissing([], userUploadFile);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userUploadFile);
      });

      it('should not add a UserUploadFile to an array that contains it', () => {
        const userUploadFile: IUserUploadFile = sampleWithRequiredData;
        const userUploadFileCollection: IUserUploadFile[] = [
          {
            ...userUploadFile,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserUploadFileToCollectionIfMissing(userUploadFileCollection, userUploadFile);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserUploadFile to an array that doesn't contain it", () => {
        const userUploadFile: IUserUploadFile = sampleWithRequiredData;
        const userUploadFileCollection: IUserUploadFile[] = [sampleWithPartialData];
        expectedResult = service.addUserUploadFileToCollectionIfMissing(userUploadFileCollection, userUploadFile);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userUploadFile);
      });

      it('should add only unique UserUploadFile to an array', () => {
        const userUploadFileArray: IUserUploadFile[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userUploadFileCollection: IUserUploadFile[] = [sampleWithRequiredData];
        expectedResult = service.addUserUploadFileToCollectionIfMissing(userUploadFileCollection, ...userUploadFileArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userUploadFile: IUserUploadFile = sampleWithRequiredData;
        const userUploadFile2: IUserUploadFile = sampleWithPartialData;
        expectedResult = service.addUserUploadFileToCollectionIfMissing([], userUploadFile, userUploadFile2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userUploadFile);
        expect(expectedResult).toContain(userUploadFile2);
      });

      it('should accept null and undefined values', () => {
        const userUploadFile: IUserUploadFile = sampleWithRequiredData;
        expectedResult = service.addUserUploadFileToCollectionIfMissing([], null, userUploadFile, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userUploadFile);
      });

      it('should return initial array if no UserUploadFile is added', () => {
        const userUploadFileCollection: IUserUploadFile[] = [sampleWithRequiredData];
        expectedResult = service.addUserUploadFileToCollectionIfMissing(userUploadFileCollection, undefined, null);
        expect(expectedResult).toEqual(userUploadFileCollection);
      });
    });

    describe('compareUserUploadFile', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserUploadFile(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserUploadFile(entity1, entity2);
        const compareResult2 = service.compareUserUploadFile(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserUploadFile(entity1, entity2);
        const compareResult2 = service.compareUserUploadFile(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserUploadFile(entity1, entity2);
        const compareResult2 = service.compareUserUploadFile(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
