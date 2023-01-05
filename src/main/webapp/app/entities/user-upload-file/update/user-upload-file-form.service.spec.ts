import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-upload-file.test-samples';

import { UserUploadFileFormService } from './user-upload-file-form.service';

describe('UserUploadFile Form Service', () => {
  let service: UserUploadFileFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserUploadFileFormService);
  });

  describe('Service methods', () => {
    describe('createUserUploadFileFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserUploadFileFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fileid: expect.any(Object),
            filename: expect.any(Object),
            contentype: expect.any(Object),
            filesize: expect.any(Object),
            filedata: expect.any(Object),
            userid: expect.any(Object),
          })
        );
      });

      it('passing IUserUploadFile should create a new form with FormGroup', () => {
        const formGroup = service.createUserUploadFileFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fileid: expect.any(Object),
            filename: expect.any(Object),
            contentype: expect.any(Object),
            filesize: expect.any(Object),
            filedata: expect.any(Object),
            userid: expect.any(Object),
          })
        );
      });
    });

    describe('getUserUploadFile', () => {
      it('should return NewUserUploadFile for default UserUploadFile initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserUploadFileFormGroup(sampleWithNewData);

        const userUploadFile = service.getUserUploadFile(formGroup) as any;

        expect(userUploadFile).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserUploadFile for empty UserUploadFile initial value', () => {
        const formGroup = service.createUserUploadFileFormGroup();

        const userUploadFile = service.getUserUploadFile(formGroup) as any;

        expect(userUploadFile).toMatchObject({});
      });

      it('should return IUserUploadFile', () => {
        const formGroup = service.createUserUploadFileFormGroup(sampleWithRequiredData);

        const userUploadFile = service.getUserUploadFile(formGroup) as any;

        expect(userUploadFile).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserUploadFile should not enable id FormControl', () => {
        const formGroup = service.createUserUploadFileFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserUploadFile should disable id FormControl', () => {
        const formGroup = service.createUserUploadFileFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
