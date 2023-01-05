import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../verif-token.test-samples';

import { VerifTokenFormService } from './verif-token-form.service';

describe('VerifToken Form Service', () => {
  let service: VerifTokenFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifTokenFormService);
  });

  describe('Service methods', () => {
    describe('createVerifTokenFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVerifTokenFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tokenid: expect.any(Object),
            token: expect.any(Object),
            expirydate: expect.any(Object),
            userid: expect.any(Object),
          })
        );
      });

      it('passing IVerifToken should create a new form with FormGroup', () => {
        const formGroup = service.createVerifTokenFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tokenid: expect.any(Object),
            token: expect.any(Object),
            expirydate: expect.any(Object),
            userid: expect.any(Object),
          })
        );
      });
    });

    describe('getVerifToken', () => {
      it('should return NewVerifToken for default VerifToken initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVerifTokenFormGroup(sampleWithNewData);

        const verifToken = service.getVerifToken(formGroup) as any;

        expect(verifToken).toMatchObject(sampleWithNewData);
      });

      it('should return NewVerifToken for empty VerifToken initial value', () => {
        const formGroup = service.createVerifTokenFormGroup();

        const verifToken = service.getVerifToken(formGroup) as any;

        expect(verifToken).toMatchObject({});
      });

      it('should return IVerifToken', () => {
        const formGroup = service.createVerifTokenFormGroup(sampleWithRequiredData);

        const verifToken = service.getVerifToken(formGroup) as any;

        expect(verifToken).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVerifToken should not enable id FormControl', () => {
        const formGroup = service.createVerifTokenFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVerifToken should disable id FormControl', () => {
        const formGroup = service.createVerifTokenFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
