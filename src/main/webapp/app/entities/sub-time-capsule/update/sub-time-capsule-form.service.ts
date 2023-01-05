import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISubTimeCapsule, NewSubTimeCapsule } from '../sub-time-capsule.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISubTimeCapsule for edit and NewSubTimeCapsuleFormGroupInput for create.
 */
type SubTimeCapsuleFormGroupInput = ISubTimeCapsule | PartialWithRequiredKeyOf<NewSubTimeCapsule>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISubTimeCapsule | NewSubTimeCapsule> = Omit<T, 'createdate'> & {
  createdate?: string | null;
};

type SubTimeCapsuleFormRawValue = FormValueOf<ISubTimeCapsule>;

type NewSubTimeCapsuleFormRawValue = FormValueOf<NewSubTimeCapsule>;

type SubTimeCapsuleFormDefaults = Pick<NewSubTimeCapsule, 'id' | 'createdate'>;

type SubTimeCapsuleFormGroupContent = {
  id: FormControl<SubTimeCapsuleFormRawValue['id'] | NewSubTimeCapsule['id']>;
  subtimecapsuleid: FormControl<SubTimeCapsuleFormRawValue['subtimecapsuleid']>;
  subtimecapsulename: FormControl<SubTimeCapsuleFormRawValue['subtimecapsulename']>;
  description: FormControl<SubTimeCapsuleFormRawValue['description']>;
  createdate: FormControl<SubTimeCapsuleFormRawValue['createdate']>;
};

export type SubTimeCapsuleFormGroup = FormGroup<SubTimeCapsuleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SubTimeCapsuleFormService {
  createSubTimeCapsuleFormGroup(subTimeCapsule: SubTimeCapsuleFormGroupInput = { id: null }): SubTimeCapsuleFormGroup {
    const subTimeCapsuleRawValue = this.convertSubTimeCapsuleToSubTimeCapsuleRawValue({
      ...this.getFormDefaults(),
      ...subTimeCapsule,
    });
    return new FormGroup<SubTimeCapsuleFormGroupContent>({
      id: new FormControl(
        { value: subTimeCapsuleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      subtimecapsuleid: new FormControl(subTimeCapsuleRawValue.subtimecapsuleid),
      subtimecapsulename: new FormControl(subTimeCapsuleRawValue.subtimecapsulename),
      description: new FormControl(subTimeCapsuleRawValue.description),
      createdate: new FormControl(subTimeCapsuleRawValue.createdate),
    });
  }

  getSubTimeCapsule(form: SubTimeCapsuleFormGroup): ISubTimeCapsule | NewSubTimeCapsule {
    return this.convertSubTimeCapsuleRawValueToSubTimeCapsule(
      form.getRawValue() as SubTimeCapsuleFormRawValue | NewSubTimeCapsuleFormRawValue
    );
  }

  resetForm(form: SubTimeCapsuleFormGroup, subTimeCapsule: SubTimeCapsuleFormGroupInput): void {
    const subTimeCapsuleRawValue = this.convertSubTimeCapsuleToSubTimeCapsuleRawValue({ ...this.getFormDefaults(), ...subTimeCapsule });
    form.reset(
      {
        ...subTimeCapsuleRawValue,
        id: { value: subTimeCapsuleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SubTimeCapsuleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdate: currentTime,
    };
  }

  private convertSubTimeCapsuleRawValueToSubTimeCapsule(
    rawSubTimeCapsule: SubTimeCapsuleFormRawValue | NewSubTimeCapsuleFormRawValue
  ): ISubTimeCapsule | NewSubTimeCapsule {
    return {
      ...rawSubTimeCapsule,
      createdate: dayjs(rawSubTimeCapsule.createdate, DATE_TIME_FORMAT),
    };
  }

  private convertSubTimeCapsuleToSubTimeCapsuleRawValue(
    subTimeCapsule: ISubTimeCapsule | (Partial<NewSubTimeCapsule> & SubTimeCapsuleFormDefaults)
  ): SubTimeCapsuleFormRawValue | PartialWithRequiredKeyOf<NewSubTimeCapsuleFormRawValue> {
    return {
      ...subTimeCapsule,
      createdate: subTimeCapsule.createdate ? subTimeCapsule.createdate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
