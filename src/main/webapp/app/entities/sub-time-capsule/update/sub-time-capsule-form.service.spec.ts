import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../sub-time-capsule.test-samples';

import { SubTimeCapsuleFormService } from './sub-time-capsule-form.service';

describe('SubTimeCapsule Form Service', () => {
  let service: SubTimeCapsuleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubTimeCapsuleFormService);
  });

  describe('Service methods', () => {
    describe('createSubTimeCapsuleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSubTimeCapsuleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subtimecapsuleid: expect.any(Object),
            subtimecapsulename: expect.any(Object),
            description: expect.any(Object),
            createdate: expect.any(Object),
          })
        );
      });

      it('passing ISubTimeCapsule should create a new form with FormGroup', () => {
        const formGroup = service.createSubTimeCapsuleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subtimecapsuleid: expect.any(Object),
            subtimecapsulename: expect.any(Object),
            description: expect.any(Object),
            createdate: expect.any(Object),
          })
        );
      });
    });

    describe('getSubTimeCapsule', () => {
      it('should return NewSubTimeCapsule for default SubTimeCapsule initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSubTimeCapsuleFormGroup(sampleWithNewData);

        const subTimeCapsule = service.getSubTimeCapsule(formGroup) as any;

        expect(subTimeCapsule).toMatchObject(sampleWithNewData);
      });

      it('should return NewSubTimeCapsule for empty SubTimeCapsule initial value', () => {
        const formGroup = service.createSubTimeCapsuleFormGroup();

        const subTimeCapsule = service.getSubTimeCapsule(formGroup) as any;

        expect(subTimeCapsule).toMatchObject({});
      });

      it('should return ISubTimeCapsule', () => {
        const formGroup = service.createSubTimeCapsuleFormGroup(sampleWithRequiredData);

        const subTimeCapsule = service.getSubTimeCapsule(formGroup) as any;

        expect(subTimeCapsule).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISubTimeCapsule should not enable id FormControl', () => {
        const formGroup = service.createSubTimeCapsuleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSubTimeCapsule should disable id FormControl', () => {
        const formGroup = service.createSubTimeCapsuleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
